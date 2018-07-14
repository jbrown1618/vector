/**
 * In order to make our `Matrix` and `Vector` type compatible with both primitives and objects,
 * rather than ensuring the scalar implements a certain set of operations on itself, we will
 * ensure that the container implements a certain set of operations on its contents.
 */
export interface ScalarContainer<ScalarType> {
  /**
   * Returns true if the scalars are equal.
   * Implementors should ensure that the operation is reflexive, associative, and transitive.
   *
   * @returns {boolean}  true if `first` is equal to `second`
   */
  scalarsEqual(first: ScalarType, second: ScalarType): boolean;

  /**
   * Returns the sum of two scalars.
   * Implementors should ensure that this operation is commutative and associative.
   *
   * @returns {ScalarType}  The sum of `first` and `second`
   */
  addScalars(first: ScalarType, second: ScalarType): ScalarType;

  /**
   * Returns the product of two scalars.
   * Implementors should ensure that this operation is commutative and associative,
   * and that it distributes over the addition operation.
   *
   * @returns {ScalarType}  The product of `first` and `second`
   */
  multiplyScalars(first: ScalarType, second: ScalarType): ScalarType;

  /**
   * Returns the complex conjugate of a scalar.
   * For real-valued scalars, this can just be an identity function.
   * @param {ScalarType} scalar  The scalar to conjugate
   * @returns {ScalarType}  The complex conjugate
   */
  conjugateScalar(scalar: ScalarType): ScalarType;

  /**
   * Returns the unique scalar such that `addScalars(x, getAdditiveIdentity()) === x`
   * is true for all x
   *
   * @returns {ScalarType}  The additive identity
   */
  getAdditiveIdentity(): ScalarType;

  /**
   * Returns the unique scalar sugh that `multiplyScalars(x, getMultiplicativeIdentity()) === x`
   * is true for all x
   *
   * @returns {ScalarType}  The multiplicative identity
   */
  getMultiplicativeIdentity(): ScalarType;
}
