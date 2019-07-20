/**
 * A class which encapsulates the basic arithmetic operations for an arbitrary scalar type.
 *
 * @remarks
 * This must be implemented for each scalar to be used in a {@link Vector} or {@link Matrix}
 * @public
 */
export abstract class ScalarOperations<S> {
  public abstract fromNumber(num: number): S;
  /**
   * Returns true if the scalars are equal.
   * Implementors should ensure that the operation is reflexive, associative, and transitive.
   *
   * @returns true if `first` is equal to `second`
   * @public
   */
  public abstract equals(first: S, second: S): boolean;

  /**
   * Returns the sum of two scalars.
   * Implementors should ensure that this operation is commutative and associative.
   *
   * @returns The sum of `first` and `second`
   * @public
   */
  public abstract add(first: S, second: S): S;

  public subtract(first: S, second: S): S {
    return this.add(first, this.getAdditiveInverse(second));
  }

  /**
   * Returns the product of two scalars.
   * Implementors should ensure that this operation is commutative and associative,
   * and that it distributes over the addition operation.
   *
   * @returns The product of `first` and `second`
   * @public
   */
  public abstract multiply(first: S, second: S): S;

  public divide(numerator: S, denominator: S): S | undefined {
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
   * @public
   */
  public abstract conjugate(scalar: S): S;

  /**
   * Returns the unique scalar such that
   * `addScalars(x, getAdditiveIdentity()) === x`
   * is true for all scalars `x`
   *
   * @returns The additive identity
   * @public
   */
  public abstract getAdditiveIdentity(): S;

  /**
   * Alias for {@link ScalarOperations.getAdditiveIdentity}
   */
  public zero(): S {
    return this.getAdditiveIdentity();
  }

  /**
   * Returns the unique scalar such that
   * `addScalars(scalar, getAdditiveInverse(scalar)) === getAdditiveIdentity()`
   * is true for `scalar`
   *
   * @returns The additive inverse
   * @public
   */
  public abstract getAdditiveInverse(x: S): S;

  /**
   * Returns the unique scalar such that
   * `multiplyScalars(x, getMultiplicativeIdentity()) === x`
   * is true for all x
   *
   * @returns The multiplicative identity
   * @public
   */
  public abstract getMultiplicativeIdentity(): S;

  /**
   * Alias for {@link ScalarOperations.getMultiplicativeIdentity}
   * @public
   */
  public one(): S {
    return this.getMultiplicativeIdentity();
  }

  /**
   * Returns the additive inverse of the multiplicative identity.
   *
   * @public
   */
  public negativeOne(): S {
    return this.getAdditiveInverse(this.getMultiplicativeIdentity());
  }

  /**
   * Returns the unique scalar such that
   *
   * @example
   * ```
   * multiplyScalars(scalar, getMultiplicativeInverse(scalar)) === getMultiplicativeIdentity()
   * ```
   *
   * is true for `scalar`
   *
   * @returns The multiplicative inverse
   * @public
   */
  public abstract getMultiplicativeInverse(x: S): S | undefined;

  public abstract getPrincipalSquareRoot(x: S): S;

  public abstract norm(x: S): number;

  public abstract random(min: number, max: number): S;

  public abstract randomNormal(mean: number, standardDeviation: number): S;

  public abstract prettyPrint(x: S): string;
}
