import { Matrix } from '../matrix/Matrix';
import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { VectorBuilder } from './VectorBuilder';

export type VectorData<S> = readonly S[];

export interface VectorConstructor<S, V extends Vector<S>> {
  new (data: VectorData<S>): V;
  ops(): ScalarOperations<S>;
  builder(): VectorBuilder<S, V>;
}

/**
 * An interface for a member of a vector space - specifically a member of an inner product space.
 */
export interface Vector<S> {
  /**
   * Yields a `ScalarOperations` object which will allow consumers to work generically
   * with the scalars contained in the vector.
   */
  ops(): ScalarOperations<S>;

  /**
   * Yields a `VectorBuilder` which will build new vectors of the same type
   */
  builder(): VectorBuilder<S, Vector<S>>;

  /**
   * Yields a `MatrixBuilder` which will build new matrices of a compatible type
   */
  matrixBuilder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * @returns The contents of the vector as an array
   */
  toArray(): S[];

  /**
   * @returns The contents of the vector as a map of indices to nonzero values
   */
  getSparseData(): Map<number, S>;

  /**
   * @param index - The index of the entry to retrieve
   * @returns The entry located at `index`
   */
  getEntry(index: number): S;

  /**
   * Implements vector addition
   *
   * @param other - The vector to add
   * @returns The vector sum
   */
  add(other: Vector<S>): Vector<S>;

  /**
   * Implements vector multiplication by a scalar
   *
   * @param scalar - The scalar by which to multiply
   * @returns The product
   */
  scalarMultiply(scalar: S): Vector<S>;

  /**
   * @param other - The vector with which to calculate an inner product
   * @returns The inner product
   */
  innerProduct(other: Vector<S>): S;

  /**
   * @param u - The vector on which to project this
   * @returns This vector projected onto `u`
   */
  projectOnto(u: Vector<S>): Vector<S>;

  /**
   * @param other - The vector with which to calculate an outer product
   * @returns The outer product
   */
  outerProduct(other: Vector<S>): Matrix<S>;

  /**
   * @returns The dimension of the vector
   */
  getDimension(): number;

  /**
   * @param other - The vector against which to compare
   * @returns - `true` if `this` is equal to `other`
   */
  equals(other: Vector<S>): boolean;
}
