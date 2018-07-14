/**
 * An abstract linear transformation between vectors of type `V`
 * and vectors of type `U`.
 * Implementors should take care to ensure that the transformation is linear.
 * That is,
 *
 * _T(x + y) = T(x) + T(y)_
 *
 * _T(k * x) = k * T(x)_
 */
export interface LinearTransformation<V, U> {
  /**
   * Apply the linear transformation to a vector
   * @param {V} vector  A vector in the domain of the transformation
   * @returns {U}  A vector in the image of the transformation
   */
  apply(vector: V): U;
}
