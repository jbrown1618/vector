/**
 * An abstract linear transformation between vectors of type `V`
 * and vectors of type `U`.
 *
 * @remarks
 * Implementors should take care to ensure that the transformation is linear.
 * That is,
 *
 * _T(x + y) = T(x) + T(y)_
 *
 * _T(k * x) = k * T(x)_
 *
 * @public
 */
export interface LinearTransformation<V, U> {
  /**
   * Apply the linear transformation to a vector
   * @param vector - A vector in the domain of the transformation
   * @returns A vector in the image of the transformation
   * @public
   */
  apply(vector: V): U;
}
