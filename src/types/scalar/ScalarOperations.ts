/**
 * A class which encapsulates the basic arithmetic operations for an arbitrary scalar type.
 *
 * @remarks
 * This must be implemented for each scalar to be used in a {@link Vector} or {@link Matrix}
 * @public
 */
export abstract class ScalarOperations<S> {
  /**
   * Returns an instance of the scalar type which most accurately corresponds to the value of `num`
   * @returns The scalar
   * @public
   */
  public abstract fromNumber(num: number): S;

  /**
   * Returns an instance of the scalar type from its real and imaginary parts.  If the scalar
   * type does not support complex numbers, then an error will be thrown.
   * @returns The scalar
   * @public
   */
  public fromComplex(real: number, imaginary: number): S {
    if (imaginary === 0) {
      return this.fromNumber(real);
    }
    throw new Error('This scalar type does not support creation of complex numbers');
  }

  /**
   * Tests if the scalars are equal.
   * Implementors should ensure that the operation is reflexive, associative, and transitive.
   *
   * @returns true if `first` is equal to `second`
   * @public
   */
  public abstract equals(first: S, second: S): boolean;

  /**
   * Returns the sum of two scalars `first` and `second`.
   *
   * @remarks
   * Implementors should ensure that this operation is commutative and associative.
   *
   * @returns The sum
   * @public
   */
  public abstract add(first: S, second: S): S;

  /**
   * Returns the difference of two scalars.
   *
   * @returns The difference
   * @public
   */
  public subtract(first: S, second: S): S {
    return this.add(first, this.getAdditiveInverse(second));
  }

  /**
   * Returns the product of two scalars `first` and `second`.
   *
   * @remarks
   * Implementors should ensure that this operation is commutative and associative,
   * and that it distributes over the addition operation.
   *
   * @returns The product of `first` and `second`
   * @public
   */
  public abstract multiply(first: S, second: S): S;

  /**
   * Returns the quotient of two scalars `numerator` and `denominator`,
   * or `undefined` if the quotient does not exist.
   *
   * @returns The quotient
   */
  public divide(numerator: S, denominator: S): S | undefined {
    const inverseOfSecond = this.getMultiplicativeInverse(denominator);
    if (inverseOfSecond === undefined) {
      return undefined;
    }
    return this.multiply(numerator, inverseOfSecond);
  }

  /**
   * Returns the complex conjugate of a scalar.
   *
   * @remarks
   * For real-valued scalars, this can just be an identity function.
   *
   * @param scalar - The scalar to conjugate
   * @returns The complex conjugate
   * @public
   */
  public abstract conjugate(scalar: S): S;

  /**
   * Returns the unique scalar that, when added to another scalar, returns that scalar
   *
   * @remarks
   * In other words,
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
   * Returns the unique value that, when added to `x`, returns the additive identity
   *
   * @remarks
   * In other words,
   * `addScalars(scalar, getAdditiveInverse(scalar)) === getAdditiveIdentity()`
   * is true for `x`
   *
   * @returns The additive inverse
   * @public
   */
  public abstract getAdditiveInverse(x: S): S;

  /**
   * Returns the unique scalar that, when multiplied by another scalar, returns that scalar
   *
   * @remarks
   * In other words,
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
   * Returns the unique scalar that, when multiplied by `scalar`,
   * returns the multiplicative identity
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

  /**
   * Returns the principal square root of a scalar.
   *
   * @remarks
   * For real-valued scalar types, this should be the positive square root.
   * For complex-values scalar types, this should be the root with a positive real part.
   *
   * @returns The square root
   * @public
   */
  public abstract getPrincipalSquareRoot(x: S): S | undefined;

  /**
   * Returns the norm (absolute value or magnitude) of a scalar
   * @returns The norm
   * @public
   */
  public abstract norm(x: S): number;

  /**
   * Returns a random scalar value between `min` and `max`
   *
   * @remarks
   * This might not be a meaningful value for non-real-values scalar types
   *
   * @returns The random scalar
   * @public
   */
  public abstract random(min: number, max: number): S;

  /**
   * Returns a random scalar value from a normal distribution centered on `mean`
   * with standard deviation `standardDeviation`
   *
   * @remarks
   * This might not be a meaningful value for non-real-values scalar types
   *
   * @returns The random scalar
   * @public
   */
  public abstract randomNormal(mean: number, standardDeviation: number): S;

  /**
   * Returns a readable string that represents the value of the scalar
   * @returns The readable string
   * @public
   */
  public abstract prettyPrint(x: S): string;
}
