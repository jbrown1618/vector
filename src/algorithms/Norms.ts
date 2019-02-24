import { Matrix } from '../types/matrix/Matrix';
import { NumberVector } from '../types/vector/NumberVector';
import { Vector } from '../types/vector/Vector';

/**
 * Returns a vector with the same direction as the input `v`, but with a Euclidean norm of 1
 *
 * ```
 * const v = vectorBuilder.fromData(3, 4);
 * const normalized = normalize(v); // [ 0.6, 0.8 ]
 * ```
 *
 * @param v - The vector to normalize
 */
export function normalize<ScalarType>(v: Vector<ScalarType>): Vector<ScalarType> | undefined {
  const ops = v.ops();
  const scaleFactor = ops.getMultiplicativeInverse(ops.fromNumber(euclideanNorm(v)));
  return scaleFactor === undefined ? undefined : v.scalarMultiply(scaleFactor);
}

/**
 * Calculates the P-Norm of a vector `v`
 *
 * ```
 * const v = vectorBuilder.fromData([3, 4]);
 * const norm1 = pNorm(v, 1); // 7
 * const norm2 = pNorm(v, 2); // 5
 * const norm3 = pNorm(v, 3); // 4.49794...
 * ```
 *
 * @param v - The vector for which to calculate the norm
 * @param p - The power used to calculate the norm
 */
export function pNorm<ScalarType>(v: Vector<ScalarType>, p: number): number {
  if (p < 1) {
    throw Error('TODO - nonsense');
  }

  if (v.getDimension() === 0) {
    return 0;
  }

  const ops = v.ops();
  let terms: number[] = v.getData().map(ops.norm);
  if (p > 1) {
    terms = terms.map(term => Math.abs(Math.pow(term, p)));
  }

  const sum = terms.reduce((a, b) => a + b, 0);
  return p > 1 ? Math.pow(sum, 1 / p) : sum;
}

/**
 * Calculates the Sum Norm (or 1-Norm) of a vector `v`
 *
 * ```
 * const v = vectorBuilder.fromData([3, 4]);
 * const norm = sumNorm(v); // 7
 * ```
 *
 * @param v - The vector for which to calculate the norm
 */
export function sumNorm<ScalarType>(v: Vector<ScalarType>): number {
  return pNorm(v, 1);
}

/**
 * Calculates the Euclidean Norm (or 2-Norm) of a vector `v`
 *
 * ```
 * const v = vectorBuilder.fromData([3, 4]);
 * const norm = euclideanNorm(v); // 5
 * ```
 *
 * @param v - The vector for which to calculate the norm
 */
export function euclideanNorm<ScalarType>(v: Vector<ScalarType>): number {
  return pNorm(v, 2);
}

/**
 * Calculates the Supremum Norm (or Infinity-Norm) of a vector `v`
 *
 * ```
 * const v = vectorBuilder.fromData([3, 4]);
 * const norm = supremumNorm(v); // 4
 * ```
 *
 * @param v - The vector for which to calculate the norm
 */
export function supremumNorm<ScalarType>(v: Vector<ScalarType>): number {
  if (v.getDimension() === 0) {
    return 0;
  }

  const ops = v.ops();
  const entries: number[] = v.getData().map(ops.norm);

  let max: number | undefined;
  entries.forEach(entry => {
    if (max === undefined || entry > max) {
      max = entry;
    }
  });

  return max as number; // cannot be undefined
}

/**
 * Calculates the Frobenius Norm of a matrix `A`
 *
 * ```
 * const A = matrixBuilder.fromData([[1, 2], [3, 4]]);
 * const norm = frobeniusNorm(A); // sqrt(30)
 * ```
 *
 * @param A - The matrix for which to calculate the norm
 */
export function frobeniusNorm<ScalarType>(A: Matrix<ScalarType>): number {
  const vb = A.vectorBuilder();
  const allEntries = A.getColumnVectors().reduce(
    (all, next) => vb.concatenate(all, next),
    vb.empty()
  );
  return euclideanNorm(allEntries);
}

/**
 * Calculates the 1-Norm of a matrix `A`
 *
 * ```
 * const A = matrixBuilder.fromData([[1, 2], [3, 4]]);
 * const norm = columnSumSupremumNorm(A); // 6
 * ```
 *
 * @param A - The matrix for which to calculate the norm
 */
export function columnSumSupremumNorm<ScalarType>(A: Matrix<ScalarType>): number {
  const columnSums = A.getColumnVectors().map(sumNorm);
  const columnSumVector = NumberVector.builder().fromData(columnSums);
  return supremumNorm(columnSumVector);
}

/**
 * Calculates the Infinity-Norm of a matrix `A`
 *
 * ```
 * const A = matrixBuilder.fromData([[1, 2], [3, 4]]);
 * const norm = rowSumSupremumNorm(A); // 7
 * ```
 *
 * @param A - The matrix for which to calculate the norm
 */
export function rowSumSupremumNorm<ScalarType>(A: Matrix<ScalarType>): number {
  const rowSums = A.getRowVectors().map(sumNorm);
  const rowSumVector = NumberVector.builder().fromData(rowSums);
  return supremumNorm(rowSumVector);
}
