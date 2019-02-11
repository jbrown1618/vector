export abstract class ScalarOperations<ScalarType> {
  /**
   * Returns true if the scalars are equal.
   * Implementors should ensure that the operation is reflexive, associative, and transitive.
   *
   * @returns true if `first` is equal to `second`
   */
  public abstract equals(first: ScalarType, second: ScalarType): boolean;

  /**
   * Returns the sum of two scalars.
   * Implementors should ensure that this operation is commutative and associative.
   *
   * @returns The sum of `first` and `second`
   */
  public abstract add(first: ScalarType, second: ScalarType): ScalarType;

  public subtract(first: ScalarType, second: ScalarType): ScalarType {
    return this.add(first, this.getAdditiveInverse(second));
  }

  /**
   * Returns the product of two scalars.
   * Implementors should ensure that this operation is commutative and associative,
   * and that it distributes over the addition operation.
   *
   * @returns The product of `first` and `second`
   */
  public abstract multiply(first: ScalarType, second: ScalarType): ScalarType;

  public divide(numerator: ScalarType, denominator: ScalarType): ScalarType | undefined {
    const inverseOfSecond = this.getMultiplicativeInverse(denominator);
    if (inverseOfSecond === undefined) {
      return undefined;
    }
    return this.multiply(numerator, inverseOfSecond);
  }

  /**
   * Returns the complex conjugate of a scalar.
   * For real-valued scalars, this can just be an identity function.
   * @param scalar - The scalar to conjugate
   * @returns The complex conjugate
   */
  public abstract conjugate(scalar: ScalarType): ScalarType;

  /**
   * Returns the unique scalar such that
   * `addScalars(x, getAdditiveIdentity()) === x`
   * is true for all scalars `x`
   *
   * @returns The additive identity
   */
  public abstract getAdditiveIdentity(): ScalarType;

  /**
   * @see getAdditiveIdentity
   */
  public zero(): ScalarType {
    return this.getAdditiveIdentity();
  }

  /**
   * Returns the unique scalar such that
   * `addScalars(scalar, getAdditiveInverse(scalar)) === getAdditiveIdentity()`
   * is true for `scalar`
   *
   * @returns The additive inverse
   */
  public abstract getAdditiveInverse(x: ScalarType): ScalarType;

  /**
   * Returns the unique scalar such that
   * `multiplyScalars(x, getMultiplicativeIdentity()) === x`
   * is true for all x
   *
   * @returns The multiplicative identity
   */
  public abstract getMultiplicativeIdentity(): ScalarType;

  /**
   * @see getMultiplicativeIdentity
   */
  public one(): ScalarType {
    return this.getMultiplicativeIdentity();
  }

  /**
   * Returns the additive inverse of the multiplicative identity.
   */
  public negativeOne(): ScalarType {
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
   * @returns The multiplicative inverse
   */
  public abstract getMultiplicativeInverse(x: ScalarType): ScalarType | undefined;

  public abstract getPrincipalSquareRoot(x: ScalarType): ScalarType;

  public abstract random(min: number, max: number): ScalarType;

  public abstract randomNormal(mean: number, standardDeviation: number): ScalarType;
}
