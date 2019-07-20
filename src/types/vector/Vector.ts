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
   * Yields a `ScalarOperations` object which will allow consumers to work generically
   * with the scalars contained in the vector.
   * @public
   */
  ops(): ScalarOperations<S>;

  /**
   * Yields a `VectorBuilder` which will build new vectors of the same type
   * @public
   */
  builder(): VectorBuilder<S, Vector<S>>;

  /**
   * Yields a `MatrixBuilder` which will build new matrices of a compatible type
   * @public
   */
  matrixBuilder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * @returns The contents of the vector as an array
   * @public
   */
  toArray(): S[];

  /**
   * @returns The contents of the vector as a map of indices to nonzero values
   * @public
   */
  getSparseData(): Map<number, S>;

  /**
   * @param index - The index of the entry to retrieve
   * @returns The entry located at `index`
   * @public
   */
  getEntry(index: number): S;

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
   * @param other - The vector with which to calculate an inner product
   * @returns The inner product
   * @public
   */
  innerProduct(other: Vector<S>): S;

  /**
   * @param u - The vector on which to project this
   * @returns This vector projected onto `u`
   * @public
   */
  projectOnto(u: Vector<S>): Vector<S>;

  /**
   * @param other - The vector with which to calculate an outer product
   * @returns The outer product
   * @public
   */
  outerProduct(other: Vector<S>): Matrix<S>;

  /**
   * @returns The dimension of the vector
   * @public
   */
  getDimension(): number;

  /**
   * @param other - The vector against which to compare
   * @returns - `true` if `this` is equal to `other`
   * @public
   */
  equals(other: Vector<S>): boolean;
}
