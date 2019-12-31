import { Matrix } from '../../types/matrix/Matrix';
import { Vector } from '../../types/vector/Vector';
import { isVector } from '../../utilities/typeGuards';

/**
 * Calculates the mean of the values in the vector `x`
 * @param x - The vector for which to find the mean
 * @public
 */
export function mean<S>(x: Vector<S>): S;
/**
 * Calculates the mean vector of the matrix `A`
 * @remarks
 * The mean vector of a matrix is a vector of the means of the matrix columns
 * @param A - The matrix for which to find the mean vector
 * @public
 */
export function mean<S>(A: Matrix<S>): Vector<S>;
export function mean<S>(xOrA: Matrix<S> | Vector<S>): Vector<S> | S {
  if (isVector(xOrA)) {
    const x = xOrA as Vector<S>;
    const ops = x.ops();
    const dimInverse = ops.getMultiplicativeInverse(ops.fromNumber(x.getDimension()));
    if (dimInverse === undefined) throw Error('The mean is not defined for vectors of length 0');
    const ones = x.builder().ones(x.getDimension());
    return ones.scalarMultiply(dimInverse).innerProduct(x);
  } else {
    return xOrA.vectorBuilder().fromArray(xOrA.getColumnVectors().map(v => mean(v)));
  }
}

/**
 * Returns the vector `x`, shifted so that its mean is at 0
 * @param x - The vector to center
 * @public
 */
export function center<S>(x: Vector<S>): Vector<S>;
/**
 * Returns the matrix `A` with each column shifted so that its mean is at 0
 * @remarks
 * This does not shift the entire matrix uniformly
 * @param A - The matrix to center
 * @public
 */
export function center<S>(A: Matrix<S>): Matrix<S>;
export function center<S>(xOrA: Matrix<S> | Vector<S>): Matrix<S> | Vector<S> {
  if (isVector(xOrA)) {
    const x = xOrA;
    if (x.getDimension() === 0) return x;

    const mu = x.builder().fill(mean(x), x.getDimension());
    return x.add(mu.scalarMultiply(x.ops().negativeOne()));
  } else {
    const A = xOrA;
    if (A.getNumberOfColumns() === 0) return A;

    const ops = A.ops();
    const rows = A.getNumberOfRows();
    const dim = ops.fromNumber(rows);
    const dimInverse = ops.getMultiplicativeInverse(dim) as S;

    const offsets = A.builder()
      .fill(dimInverse, [rows, rows])
      .multiply(A);
    return A.add(offsets.scalarMultiply(ops.negativeOne()));
  }
}

/**
 * Returns the vector `x` shifted and scaled to have a mean of 0 and standard deviation of 1
 * @param x - The vector to standardize
 * @public
 */
export function standardize<S>(x: Vector<S>): Vector<S>;
/**
 * Returns the matrix `A` with each column shifted and scaled to have a mean of 0 and standard deviation of 1
 * @param A - The matrix to standardize
 * @public
 */
export function standardize<S>(A: Matrix<S>): Matrix<S>;
export function standardize<S>(xOrA: Matrix<S> | Vector<S>): Matrix<S> | Vector<S> {
  if (isVector(xOrA)) {
    if (xOrA.getDimension() === 0) return xOrA;
    const ops = xOrA.ops();
    const centered = center(xOrA);
    const std = standardDeviation(xOrA);
    const stdInverse = ops.getMultiplicativeInverse(std);
    if (stdInverse === undefined) {
      // Standard deviation is 0; just return the centered vector
      return centered;
    }
    return centered.scalarMultiply(stdInverse);
  } else {
    if (xOrA.getNumberOfColumns() === 0) return xOrA;
    return xOrA.builder().fromColumnVectors(xOrA.getColumnVectors().map(v => standardize(v)));
  }
}

/**
 * Calculates the variance of a vector
 * @param x - The vector
 * @public
 */
export function variance<S>(x: Vector<S>): S;
/**
 * Calculates the variance of each column of the matrix `A`
 * @param A - The matrix
 * @public
 */
export function variance<S>(A: Matrix<S>): Vector<S>;
export function variance<S>(xOrA: Matrix<S> | Vector<S>): Vector<S> | S {
  if (isVector(xOrA)) {
    if (xOrA.getDimension() === 0) throw Error('Variance is not defined for vectors of length 0');
    return covariance(xOrA, xOrA);
  } else {
    return xOrA.vectorBuilder().fromArray(xOrA.getColumnVectors().map(v => variance(v)));
  }
}

/**
 * Calculates the standard deviation of a vector
 * @param x - The vector
 * @public
 */
export function standardDeviation<S>(x: Vector<S>): S;
/**
 * Calculates the standard deviation of each column of the matrix `A`
 * @param A - The matrix
 * @public
 */
export function standardDeviation<S>(A: Matrix<S>): Vector<S>;
export function standardDeviation<S>(xOrA: Matrix<S> | Vector<S>): Vector<S> | S {
  if (isVector(xOrA)) {
    if (xOrA.getDimension() === 0)
      throw Error('Standard deviation is not defined for 0-dimensional vectors');
    return xOrA.ops().getPrincipalSquareRoot(variance(xOrA)) as S;
  } else {
    return xOrA.vectorBuilder().fromArray(xOrA.getColumnVectors().map(v => standardDeviation(v)));
  }
}

/**
 * Calculates the covariance of two vectors
 * @param first - The first vector
 * @param second - The second vector
 * @public
 */
export function covariance<S>(first: Vector<S>, second: Vector<S>): S;
/**
 * Calculates the covariance matrix of a matrix `A`
 * @param A - The matrix
 * @public
 */
export function covariance<S>(A: Matrix<S>): Matrix<S>;
export function covariance<S>(xOrA: Matrix<S> | Vector<S>, s?: Vector<S>): S | Matrix<S> {
  if (isVector(xOrA)) {
    const first = xOrA;
    const second = s as Vector<S>;
    const ops = first.ops();
    const dim = first.getDimension();
    if (dim === 0) throw Error('Covariance is not defined for vectors of dimension 0');
    if (second.getDimension() !== dim)
      throw Error('Covariance is not defined for vectors of different lengths');

    const ip = center(first).innerProduct(center(second));
    return ops.divide(ip, ops.fromNumber(dim)) as S;
  } else {
    const A = xOrA;
    const ops = A.ops();
    const rows = A.getNumberOfRows();
    const dim = ops.fromNumber(rows);
    const dimInverse = ops.getMultiplicativeInverse(dim);
    if (dimInverse === undefined)
      throw Error('The covariance matrix is not defined for a matrix with no rows');

    const centered = center(A);
    return centered
      .transpose()
      .multiply(centered)
      .scalarMultiply(dimInverse);
  }
}

/**
 * Calculates the correlation coefficient r of two vectors
 * @param first - The first vector
 * @param second - The second vector
 * @public
 */
export function correlation<S>(first: Vector<S>, second: Vector<S>): S;
/**
 * Calculates the correlation matrix of a matrix `A`
 * @param A - The matrix
 * @public
 */
export function correlation<S>(A: Matrix<S>): Matrix<S>;
export function correlation<S>(xOrA: Matrix<S> | Vector<S>, s?: Vector<S>): S | Matrix<S> {
  if (isVector(xOrA)) {
    const first = xOrA;
    const second = s as Vector<S>;
    const ops = first.ops();
    const dim = first.getDimension();
    if (dim === 0) throw Error('Correlation is not defined for vectors of dimension 0');
    if (second.getDimension() !== dim)
      throw Error('Correlation is not defined for vectors of different lengths');

    const ip = standardize(first).innerProduct(standardize(second));
    return ops.divide(ip, ops.fromNumber(dim)) as S;
  } else {
    const A = xOrA;
    const ops = A.ops();
    const rows = A.getNumberOfRows();
    const dim = ops.fromNumber(rows);
    const dimInverse = ops.getMultiplicativeInverse(dim);
    if (dimInverse === undefined)
      throw Error('The correlation matrix is not defined for a matrix with no rows');

    const centered = standardize(A);
    return centered
      .transpose()
      .multiply(centered)
      .scalarMultiply(dimInverse);
  }
}
