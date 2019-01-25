export abstract class ScalarOperations<ScalarType> {
  /**
   * Returns true if the scalars are equal.
   * Implementors should ensure that the operation is reflexive, associative, and transitive.
   *
   * @returns {boolean}  true if `first` is equal to `second`
   */
  abstract equals(first: ScalarType, second: ScalarType): boolean;

  /**
   * Returns the sum of two scalars.
   * Implementors should ensure that this operation is commutative and associative.
   *
   * @returns {ScalarType}  The sum of `first` and `second`
   */
  abstract add(first: ScalarType, second: ScalarType): ScalarType;

  subtract(first: ScalarType, second: ScalarType): ScalarType {
    return this.add(first, this.getAdditiveInverse(second));
  }

  /**
   * Returns the product of two scalars.
   * Implementors should ensure that this operation is commutative and associative,
   * and that it distributes over the addition operation.
   *
   * @returns {ScalarType}  The product of `first` and `second`
   */
  abstract multiply(first: ScalarType, second: ScalarType): ScalarType;

  divide(numerator: ScalarType, denominator: ScalarType): ScalarType | undefined {
    var inverseOfSecond = this.getMultiplicativeInverse(denominator);
    if (inverseOfSecond === undefined) {
      return undefined;
    }
    return this.multiply(numerator, inverseOfSecond);
  }

  /**
   * Returns the complex conjugate of a scalar.
   * For real-valued scalars, this can just be an identity function.
   * @param {ScalarType} scalar  The scalar to conjugate
   * @returns {ScalarType}  The complex conjugate
   */
  abstract conjugate(scalar: ScalarType): ScalarType;

  /**
   * Returns the unique scalar such that
   * `addScalars(x, getAdditiveIdentity()) === x`
   * is true for all scalars `x`
   *
   * @returns {ScalarType}  The additive identity
   */
  abstract getAdditiveIdentity(): ScalarType;

  /**
   * @see getAdditiveIdentity
   */
  zero(): ScalarType {
    return this.getAdditiveIdentity();
  }

  /**
   * Returns the unique scalar such that
   * `addScalars(scalar, getAdditiveInverse(scalar)) === getAdditiveIdentity()`
   * is true for `scalar`
   *
   * @returns {ScalarType}  The additive inverse
   */
  abstract getAdditiveInverse(x: ScalarType): ScalarType;

  /**
   * Returns the unique scalar such that
   * `multiplyScalars(x, getMultiplicativeIdentity()) === x`
   * is true for all x
   *
   * @returns {ScalarType}  The multiplicative identity
   */
  abstract getMultiplicativeIdentity(): ScalarType;

  /**
   * @see getMultiplicativeIdentity
   */
  one(): ScalarType {
    return this.getMultiplicativeIdentity();
  }

  /**
   * Returns the additive inverse of the multiplicative identity.
   */
  negativeOne(): ScalarType {
    return this.getAdditiveInverse(this.getMultiplicativeIdentity());
  }

  /**
   * Returns the unique scalar such that
   *
   * ```
   * multiplyScalars(scalar, getMultiplicativeInverse(scalar)) === getMultiplicativeIdentity()
   * ```
   *
   * is true for `scalar`
   *
   * @returns {ScalarType}  The multiplicative inverse
   */
  abstract getMultiplicativeInverse(x: ScalarType): ScalarType | undefined;

  abstract getPrincipalSquareRoot(x: ScalarType): ScalarType;

  abstract random(min: number, max: number): ScalarType;

  abstract randomNormal(mean: number, standardDeviation: number): ScalarType;
}
