import { NumberMatrix } from '../../types/matrix/NumberMatrix';
import { NumberVector } from '../../types/vector/NumberVector';
import { VectorIndexFunction } from '../../types/vector/VectorBuilder';
import { Vector } from '../../types/vector/Vector';
import { ones, zeros } from '../../utilities/aliases';

/**
 * Builds a vector of `binCount` evenly spaced numbers between `xMin` (inclusive) and `xMax` (exclusive).
 *
 * @remarks
 * Throws an error if `xMin` is greater than or equal to `xMax` or if `binCount` is negative
 *
 * @example
 * ```
 * linspace(0, 1, 5); // [ 0, 0.2, 0.4, 0.6, 0.8 ]
 * ```
 *
 * @param xMin - The smallest value in the vector
 * @param xMax - The largest value in the vector
 * @param binCount - The number of entries
 * @returns The evenly-spaced vector
 * @public
 */
export function linspace(xMin: number, xMax: number, binCount: number): NumberVector {
  if (xMin >= xMax) {
    throw Error(`Expected xMin to be less than xMax; got ${xMin} and ${xMax}`);
  }

  if (binCount < 0) {
    throw Error(`Expected binCount to be nonnegative; got ${binCount}`);
  }

  const indexToX: VectorIndexFunction<number> = index => {
    return xMin + ((xMax - xMin) / binCount) * index;
  };

  return NumberVector.builder().fromIndexFunction(binCount, indexToX);
}

/**
 * Builds a matrix that transforms a vector to a vector of forward differences
 *
 * @remarks
 * A forward difference matrix calculates an approximate derivative scaled by the difference
 * when applied to a vector of function values, using a forward difference _f(x + delta) - f(x)_
 *
 * @example
 * ```
 * forwardDifferenceMatrix(4);
 *
 * // [ -1  1  0  0 ]
 * // [  0 -1  1  0 ]
 * // [  0  0 -1  1 ]
 * // [  0  0  0 -1 ]
 * ```
 * @param binCount - The size of the vector to which the output ought to be applied
 * @returns The forward difference matrix
 * @public
 */
export function forwardDifferenceMatrix(binCount: number): NumberMatrix {
  return NumberMatrix.builder().tridiagonal(
    zeros(binCount - 1),
    ones(binCount).scalarMultiply(-1),
    ones(binCount - 1)
  );
}

/**
 * Builds a matrix that transforms a vector to a vector of backward differences
 *
 * @remarks
 * A backward difference matrix calculates an approximate derivative scaled by the difference
 * when applied to a vector of function values, using a backward difference _f(x) - f(x - delta)_
 *
 * @example
 * ```
 * backwardDifferenceMatrix(4);
 *
 * // [  1  0  0  0 ]
 * // [ -1  1  0  0 ]
 * // [  0 -1  1  0 ]
 * // [  0  0 -1  1 ]
 * ```
 * @param binCount - The size of the vector to which the output ought to be applied
 * @returns The backward difference matrix
 * @public
 */
export function backwardDifferenceMatrix(binCount: number): NumberMatrix {
  return NumberMatrix.builder().tridiagonal(
    ones(binCount - 1).scalarMultiply(-1),
    ones(binCount),
    zeros(binCount - 1)
  );
}

/**
 * Builds a matrix that transforms a vector to a vector of central differences
 *
 * @remarks
 * A backward difference matrix calculates an approximate derivative scaled by the difference
 * when applied to a vector of function values, using a central
 * difference _f(x - delta)/2 - f(x + delta)/2_
 *
 * The central difference is equal to the average of the forward and backward differences
 * _1/2 * (forwardDifference + backwardDifference)_
 *
 * @example
 * ```
 * centralDifferenceMatrix(4);
 *
 * // [   0   1/2   0    0  ]
 * // [ -1/2   0   1/2   0  ]
 * // [   0  -1/2   0   1/2 ]
 * // [   0    0  -1/2   0  ]
 * ```
 * @param binCount - The size of the vector to which the output ought to be applied
 * @returns The central difference matrix
 * @public
 */
export function centralDifferenceMatrix(binCount: number): NumberMatrix {
  return NumberMatrix.builder().tridiagonal(
    ones(binCount - 1).scalarMultiply(-1 / 2),
    zeros(binCount),
    ones(binCount - 1).scalarMultiply(1 / 2)
  );
}

/**
 * Uses finite differences to build a vector containing approximate values of the derivative of `f`.
 *
 * @example
 * ```
 * // Approximates Math.cos at 100 points between 0 and 2*PI
 * derivative(Math.sin, 0, 2*Math.PI, 100);
 * ```
 *
 * @param f - A deterministic function with no side effects
 * @param xMin - The minimum value for which the derivative will be approximated
 * @param xMax - The maximum (exclusive) value for which the derivative will be approximated
 * @param binCount - The number of approximations
 * @returns A linearly spaced vector whose values represent the values of the derivative
 * @public
 */
export function derivative(
  f: (x: number) => number,
  xMin: number,
  xMax: number,
  binCount: number
): Vector<number> {
  const x = linspace(xMin, xMax, binCount);
  const y = x.map(f);
  const delta = x.getEntry(1) - x.getEntry(0);

  const D = centralDifferenceMatrix(binCount);
  return D.apply(y).scalarMultiply(1 / delta);
}
