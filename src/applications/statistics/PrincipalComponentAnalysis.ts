import { Matrix } from '../../types/matrix/Matrix';
import { Vector } from '../../types/vector/Vector';
import { covariance, correlation } from './DescriptiveStatistics';
import { eig } from '../../eigenvalues/Eigenvalues';

/**
 * The result of a principal component analysis.
 * @public
 */
export interface PrincipalComponentAnalysis<S> {
  /**
   * The directions in which the data varies the most, ordered by
   * the proportion of variation explained by each direction
   */
  principalComponents: Vector<S>[];
  /**
   * The variances in the directions of the corresponding principal components
   */
  variances: S[];
  /**
   * The proportion of the total variance explained by each principal component
   */
  proportions: S[];
  /**
   * The proportion of the total variance explained by the first k components
   */
  cumulativeProportions: S[];
  /**
   * The original data in a basis formed by the principal component vectors
   */
  coordinates: Matrix<S>;
}
/**
 * Conducts a principal component analysis of a matrix `A`, and returns `A` in a new basis
 * corresponding to the principal components.
 * @param A - The matrix to analyze
 * @param useCorrelation - Whether to use correlation rather than covariance to determine
 *     principal components.  Equivalently, whether to standardize rather than merely center
 *     the data.  This option should be used if the variables in the data naturally fall on
 *     different scales.
 * @public
 */
export function pca<S>(A: Matrix<S>, useCorrelation = false): PrincipalComponentAnalysis<S> {
  const ops = A.ops();
  const C = useCorrelation ? correlation(A) : covariance(A);
  const pairs = eig(C);

  // The eigenvectors of the covariance matrix are the principal components of the data
  const principalComponents = pairs.map(pair => pair.eigenvector);

  // The eigenvalues of the covariance matrix are the variances of the principal components
  const variances = pairs.map(pair => pair.eigenvalue);

  // Reframe the data in the new basis
  const coordinates = A.multiply(A.builder().fromColumnVectors(principalComponents));

  // Sum the eigenvalues
  const totalVariance = useCorrelation
    ? ops.fromNumber(variances.length)
    : variances.reduce((total, next) => ops.add(total, next), ops.zero());

  // The proportion of the total variance explained by each variable
  const proportions = variances.map(variance => ops.divide(variance, totalVariance)) as S[];

  // The proportion of the total variance explained by the first k variables
  const cumulativeProportions: S[] = [];
  proportions.forEach(prop => {
    const currentTotal =
      cumulativeProportions.length === 0
        ? ops.zero()
        : cumulativeProportions[cumulativeProportions.length - 1];
    cumulativeProportions.push(ops.add(currentTotal, prop));
  });

  return { variances, proportions, cumulativeProportions, principalComponents, coordinates };
}

type DimensionReductionType =
  | {
      keep: number;
    }
  | {
      remove: number;
    }
  | {
      proportionOfVariance: number;
    };

/**
 * Specify how dimension reduction ought to be done.
 * @public
 */
export type DimensionReductionOptions = DimensionReductionType & {
  useCorrelation?: boolean;
};

/**
 * Reduce the number of dimensions of a data matrix `A` while losing as little information as possible.
 * @param A - The data matrix
 * @param options - Specify how the dimension reduction should be done.
 *     `useCorrelation: boolean` - use the correlation rather than covariance matrix when conducting the PCA;
 *     `keep: number` - the desired number of dimensions;
 *     `remove: number` - the number of dimensions to remove;
 *     `proportionOfVariance: number` - the desired proportion of the total variance in the data that should
 *          be explained by the remaining columns
 * @public
 */
export function reduceDimensions(
  A: Matrix<number>,
  options: DimensionReductionOptions
): Matrix<number> {
  let keep = A.getNumberOfColumns();
  if (hasKeep(options) && (options.keep > keep || options.keep < 0)) {
    throw Error(`Cannot keep ${options.keep} dimensions of a matrix with ${keep} columns`);
  } else if (hasRemove(options) && (options.remove > keep || options.remove < 0)) {
    throw Error(`Cannot remove ${options.remove} dimensions of a matrix with ${keep} columns`);
  } else if (
    hasPropVar(options) &&
    (options.proportionOfVariance < 0 || options.proportionOfVariance > 1)
  ) {
    throw Error(
      `${options.proportionOfVariance} is not a valid proportion - expected between 0 and 1`
    );
  }

  const analysis = pca(A, options.useCorrelation || false);

  if (hasKeep(options)) {
    keep = options.keep;
  } else if (hasRemove(options)) {
    keep = A.getNumberOfColumns() - options.remove;
  } else if (hasPropVar(options)) {
    for (const prop of analysis.cumulativeProportions) {
      // TODO - it is currently this line that keeps this from working on general
      // scalar types. Even though the eigenvalues are definitely real in this
      // case, we still can't coerce them to numbers. Maybe pca should return
      // numbers for the proportions?
      if (prop > options.proportionOfVariance) {
        keep = analysis.cumulativeProportions.indexOf(prop) + 1;
        break;
      }
    }
  }

  return A.builder().slice(analysis.coordinates, 0, 0, A.getNumberOfRows(), keep);
}

function hasKeep(
  options: DimensionReductionOptions
): options is { useCorrelation: boolean; keep: number } {
  return (options as any).keep;
}

function hasRemove(
  options: DimensionReductionOptions
): options is { useCorrelation: boolean; remove: number } {
  return (options as any).remove;
}

function hasPropVar(
  options: DimensionReductionOptions
): options is { useCorrelation: boolean; proportionOfVariance: number } {
  return (options as any).proportionOfVariance;
}
