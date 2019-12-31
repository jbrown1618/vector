import { Matrix } from '../matrix/Matrix';
import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { VectorBuilder } from './VectorBuilder';

/**
 * The data stored in a {@link Vector} represented as a map
 * @public
 */
export type VectorData<S> = readonly S[];

/**
 * @internal
 */
export interface VectorConstructor<S, V extends Vector<S>> {
  new (data: VectorData<S>): V;
  ops(): ScalarOperations<S>;
  builder(): VectorBuilder<S, V>;
}

/**
 * A generalized Vector - one of the core data types
 * @public
 */
export interface Vector<S> {
  /**
   * Returns a {@link ScalarOperations} object which will allow consumers to work generically
   * with the scalars contained in the vector.
   * @public
   */
  ops(): ScalarOperations<S>;

  /**
   * Returns a {@link VectorBuilder} which will build new vectors of the same type
   * @public
   */
  builder(): VectorBuilder<S, Vector<S>>;

  /**
   * Returns a {@link MatrixBuilder} which will build new matrices of a compatible type
   * @public
   */
  matrixBuilder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * Returns the contents of the vector as an array
   * @returns The contents of the vector
   * @public
   */
  toArray(): S[];

  /**
   * Returns the contents of the vector as a map of indices to nonzero values
   * @returns The contents of the vector
   * @public
   */
  getSparseData(): Map<number, S>;

  /**
   * Returns the entry of the matrix located at the provided index (`index`)
   * @param index - The index of the entry to retrieve
   * @returns The entry
   * @public
   */
  getEntry(index: number): S;

  /**
   * Returns a new vector equal to the old one, except with the entry at
   * `index` replaced with `value`
   *
   * @param index - The index of the value to replace
   * @param value - The new value
   * @returns The new vector
   * @public
   */
  set(index: number, value: S): Vector<S>;

  /**
   * Implements vector addition
   *
   * @param other - The vector to add
   * @returns The vector sum
   * @public
   */
  add(other: Vector<S>): Vector<S>;

  /**
   * Implements vector multiplication by a scalar
   *
   * @param scalar - The scalar by which to multiply
   * @returns The product
   * @public
   */
  scalarMultiply(scalar: S): Vector<S>;

  /**
   * Implements the inner product (scalar product or dot product) of two vectors
   * @param other - The vector with which to calculate an inner product
   * @returns The inner product
   * @public
   */
  innerProduct(other: Vector<S>): S;

  /**
   * Returns a new vector in the direction of `u` but with magnitude equal to the
   * amount of the original vector that lies in that direction
   * @param u - The vector on which to project this
   * @returns This vector projected onto `u`
   * @public
   */
  projectOnto(u: Vector<S>): Vector<S>;

  /**
   * Implements the outer product (matrix product) of two vectors
   * @param other - The vector with which to calculate an outer product
   * @returns The outer product
   * @public
   */
  outerProduct(other: Vector<S>): Matrix<S>;

  /**
   * Executes the `callback` function for each entry in the vector.
   * @param callback - The function to execute for each entry
   * @public
   */
  forEach(callback: (entry: S, index: number) => void): void;

  /**
   * Constructs a vector by transforming the values of another vector.
   *
   * @example
   * ```
   * const original = vectorBuilder.fromValues(1, 2, 3, 4);
   *
   * const originalPlusOne = original.map(value => value + 1);
   * // [2, 3, 4, 5]
   *
   * const originalPlusIndex = original.map((value, index) => value + index);
   * // [1, 3, 5, 7]
   * ```
   * @param valueFromEntry - A function which takes an entry of
   *     the original vector and its index, and returns the corresponding entry of the new vector
   * @returns The new vector
   * @public
   */
  map(valueFromEntry: (entry: S, index: number) => S): Vector<S>;

  /**
   * Constructs a vector by combining the values of two other vectors
   *
   * @example
   * ```
   * const first = vec([1, 2, 3]);
   * const second = vec([2, 3, 4]);
   *
   * const combined = first.combine(second, (a, b) => a * b);
   * // [2, 6, 12]
   * ```
   * @param other - The vector with which to combine this one
   * @param combineEntries - A function which takes an entry from each vector and returns a new entry
   * @returns The new vector
   * @public
   */
  combine(other: Vector<S>, combineEntries: (a: S, b: S) => S): Vector<S>;

  /**
   * Returns the dimension of the vector
   * @returns The dimension
   * @public
   */
  getDimension(): number;

  /**
   * Tests if two vectors are equal
   * @param other - The vector against which to compare
   * @returns - `true` if `this` is equal to `other`
   * @public
   */
  equals(other: Vector<S>): boolean;
}
