import { Matrix } from '../types/matrix/Matrix';
import { assertSquare } from '../utilities/ErrorAssertions';
import { factorial } from '../utilities/NumberUtilities';
import { inverse } from './GaussJordan';
import { columnSumSupremumNorm } from './Norms';

/**
 * Computes _A^n_ recursively.
 *
 * @param A - The matrix to raise to a power `n`
 * @param n - The power to which to raise `A`
 * @public
 */
export function pow<S>(A: Matrix<S>, n: number): Matrix<S> {
  // TODO - memoize these results
  if (n < 0) {
    const invA = inverse(A);
    if (invA === undefined) {
      throw Error('Cannot raise a non-invertible matrix to a negative power');
    }
    return pow(invA, -n);
  }
  if (n === 0) {
    return A.builder().identity(A.getNumberOfColumns());
  }

  return A.multiply(pow(A, n - 1));
}

/**
 * Implements the Pade Approximant to compute the exponential of matrix `A`
 *
 * @param A - The matrix to exponentiate
 * @param order - The order of the approximation - higher numbers yield more accurate results
 * @public
 */
export function exp<S>(A: Matrix<S>, order = 6): Matrix<S> {
  assertSquare(A);
  const ops = A.ops();

  // To increase numerical stability, choose a scale factor m that
  // leaves the norm of A/m inside a reasonable bound.
  // To reduce the number of matrix multiplications when computing the
  // final result, choose m = 2^k so we can scale back at the end by
  // repeatedly squaring.
  const k = getScaleFactorExponent(A);
  const m = Math.pow(2, k);
  const scaleFactor = ops.fromNumber(1 / m);

  // Scale A downward, and perform the approximation on A/m
  const scaledA = A.scalarMultiply(scaleFactor);

  // R is an approximation for exp(scaledA)
  const R = computeR(scaledA, order, order);

  // Scale back up to get exp(A)
  const expA = deScaleSolution(R, k);

  return expA;
}

/**
 * Returns the smallest integral exponent k such that A/(2^k) has a 1-norm less than 0.5
 *
 * @param A - The matrix to scale down
 */
function getScaleFactorExponent<S>(A: Matrix<S>): number {
  const norm = columnSumSupremumNorm(A);
  let scaledNorm = norm;
  let exponent = 0;
  while (scaledNorm > 0.5) {
    exponent++;
    scaledNorm /= 2;
  }
  return exponent;
}

/**
 * Returns exp(A) given exp(A/(2^k)) by repeatedly squaring the latter.
 * Note: _exp(A) = exp(A/(2^k))^(2^k)_
 *
 * @param exponentialOfScaledMatrix - The calculated exponential of original matrix `A` scaled down
 * @param scaleFactorExponent  - The exponent `k` that was used to scale down the original matrix `A`
 */
function deScaleSolution<S>(
  exponentialOfScaledMatrix: Matrix<S>,
  scaleFactorExponent: number
): Matrix<S> {
  let exponentialOfOriginalMatrix = exponentialOfScaledMatrix;
  for (let i = 0; i < scaleFactorExponent; i++) {
    exponentialOfOriginalMatrix = exponentialOfOriginalMatrix.multiply(exponentialOfOriginalMatrix);
  }
  return exponentialOfOriginalMatrix;
}

/**
 * Computes the (p,q) Pade approximation for the exponential of matrix `A` - a rational
 * function that converges more quickly than the power series definition of the matrix exponential
 *
 * @param A - The matrix `A` to exponentiate
 * @param p - The number of terms in the numerator of the rational function
 * @param q - The number of terms in the denominator of the rational function
 */
function computeR<S>(A: Matrix<S>, p: number, q: number): Matrix<S> {
  const N = computeN(A, p, q);
  const D = computeD(A.scalarMultiply(A.ops().negativeOne()), p, q);
  const dInverse = inverse(D);
  if (dInverse === undefined) {
    throw Error('Encountered an unexpected non-invertible matrix in the exponential calculation');
  }
  return dInverse.multiply(N);
}

/**
 * Computes the matrix which gives the numerator of the rational function approximation
 *
 * @param A - The matrix `A` to exponentiate
 * @param p - The number of terms in the numerator of the rational function
 * @param q - The number of terms in the denominator of the rational function
 */
function computeN<S>(A: Matrix<S>, p: number, q: number): Matrix<S> {
  const n = A.getNumberOfColumns();
  let result = A.builder().zeros([n, n]);
  for (let j = 0; j < p; j++) {
    result = result.add(computeJthTermOfN(A, p, q, j));
  }
  return result;
}

/**
 * Computes the jth term of the numerator matrix `N`
 *
 * @param A - The matrix `A` to exponentiate
 * @param p - The number of terms in the numerator of the rational function
 * @param q - The number of terms in the denominator of the rational function
 * @param j - The index of the term being computed
 */
function computeJthTermOfN<S>(A: Matrix<S>, p: number, q: number, j: number): Matrix<S> {
  const ops = A.ops();
  const numerator = ops.fromNumber(factorial(p + q - j) * factorial(p));
  const denominator = ops.fromNumber(factorial(p + q) * factorial(j) * factorial(p - j));
  const coefficient = ops.divide(numerator, denominator) as S; // can never be 0
  return pow(A, j).scalarMultiply(coefficient);
}

/**
 * Computes the matrix which gives the denominator of the rational function approximation
 *
 * @param negativeA - The additive inverse of the matrix being exponentiated
 * @param p - The number of terms in the numerator of the rational function
 * @param q - The number of terms in the denominator of the rational function
 */
function computeD<S>(negativeA: Matrix<S>, p: number, q: number): Matrix<S> {
  const n = negativeA.getNumberOfColumns();
  let result = negativeA.builder().zeros([n, n]);
  for (let j = 0; j < q; j++) {
    result = result.add(computeJthTermOfD(negativeA, p, q, j));
  }
  return result;
}

/**
 * Computes the jth term of the denominator matrix `D`
 *
 * @param negativeA - The additive inverse of the matrix being exponentiated
 * @param p - The number of terms in the numerator of the rational function
 * @param q - The number of terms in the denominator of the rational function
 * @param j - The index of the term being computed
 */
function computeJthTermOfD<S>(negativeA: Matrix<S>, p: number, q: number, j: number): Matrix<S> {
  const ops = negativeA.ops();
  const numerator = ops.fromNumber(factorial(p + q - j) * factorial(q));
  const denominator = ops.fromNumber(factorial(p + q) * factorial(j) * factorial(q - j));
  const coefficient = ops.divide(numerator, denominator) as S; // can never be 0
  return pow(negativeA, j).scalarMultiply(coefficient);
}
