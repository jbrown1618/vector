import { vec } from '../utilities/aliases';
import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';

/**
 * Returns a vector with the same direction as the input `v`, but with a Euclidean norm of 1
 *
 * @example
 * ```
 * const v = vec(3, 4);
 * const normalized = normalize(v); // [ 0.6, 0.8 ]
 * ```
 *
 * @param v - The vector to normalize
 * @public
 */
export function normalize<S>(v: Vector<S>): Vector<S> | undefined {
  const ops = v.ops();
  const scaleFactor = ops.getMultiplicativeInverse(ops.fromNumber(euclideanNorm(v)));
  return scaleFactor === undefined ? undefined : v.scalarMultiply(scaleFactor);
}

/**
 * Calculates the P-Norm of a vector `v`
 *
 * @example
 * ```
 * const v = vec([3, 4]);
 * const norm1 = pNorm(v, 1); // 7
 * const norm2 = pNorm(v, 2); // 5
 * const norm3 = pNorm(v, 3); // 4.49794...
 * ```
 *
 * @param v - The vector for which to calculate the norm
 * @param p - The power used to calculate the norm
 * @public
 */
export function pNorm<S>(v: Vector<S>, p: number): number {
  if (p < 1) {
    throw Error(`The p-norm is only defined for p >= 1; got ${p}`);
  }

  if (v.getDimension() === 0) {
    return 0;
  }

  const ops = v.ops();
  let terms: number[] = v.toArray().map(ops.norm);
  if (p > 1) {
    terms = terms.map(term => Math.abs(Math.pow(term, p)));
  }

  const sum = terms.reduce((a, b) => a + b, 0);
  return p > 1 ? Math.pow(sum, 1 / p) : sum;
}

/**
 * Calculates the Sum Norm (or 1-Norm) of a vector `v`
 *
 * @example
 * ```
 * const v = vec([3, 4]);
 * const norm = sumNorm(v); // 7
 * ```
 *
 * @param v - The vector for which to calculate the norm
 * @public
 */
export function sumNorm<S>(v: Vector<S>): number {
  return pNorm(v, 1);
}

/**
 * Calculates the Euclidean Norm (or 2-Norm) of a vector `v`
 *
 * @example
 * ```
 * const v = vec([3, 4]);
 * const norm = euclideanNorm(v); // 5
 * ```
 *
 * @param v - The vector for which to calculate the norm
 * @public
 */
export function euclideanNorm<S>(v: Vector<S>): number {
  return pNorm(v, 2);
}

/**
 * Calculates the Supremum Norm (or Infinity-Norm) of a vector `v`
 *
 * @example
 * ```
 * const v = vec([3, 4]);
 * const norm = supremumNorm(v); // 4
 * ```
 *
 * @param v - The vector for which to calculate the norm
 * @public
 */
export function supremumNorm<S>(v: Vector<S>): number {
  if (v.getDimension() === 0) {
    return 0;
  }

  const ops = v.ops();
  const entries = v.toArray().map(ops.norm);

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
 * @example
 * ```
 * const A = mat([[1, 2], [3, 4]]);
 * const norm = frobeniusNorm(A); // sqrt(30)
 * ```
 *
 * @param A - The matrix for which to calculate the norm
 * @public
 */
export function frobeniusNorm<S>(A: Matrix<S>): number {
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
 * @example
 * ```
 * const A = mat([[1, 2], [3, 4]]);
 * const norm = columnSumSupremumNorm(A); // 6
 * ```
 *
 * @param A - The matrix for which to calculate the norm
 * @public
 */
export function columnSumSupremumNorm<S>(A: Matrix<S>): number {
  const columnSums = A.getColumnVectors().map(sumNorm);
  const columnSumVector = vec(columnSums);
  return supremumNorm(columnSumVector);
}

/**
 * Calculates the Infinity-Norm of a matrix `A`
 *
 * @example
 * ```
 * const A = mat([[1, 2], [3, 4]]);
 * const norm = rowSumSupremumNorm(A); // 7
 * ```
 *
 * @param A - The matrix for which to calculate the norm
 * @public
 */
export function rowSumSupremumNorm<S>(A: Matrix<S>): number {
  const rowSums = A.getRowVectors().map(sumNorm);
  const rowSumVector = vec(rowSums);
  return supremumNorm(rowSumVector);
}
