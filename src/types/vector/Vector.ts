import { Matrix } from '../matrix/Matrix';
import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { VectorBuilder } from './VectorBuilder';

export type VectorData<ScalarType> = ScalarType[];

export interface VectorConstructor<ScalarType, VectorType extends Vector<ScalarType>> {
  new (data: VectorData<ScalarType>): VectorType;
  ops(): ScalarOperations<ScalarType>;
  builder(): VectorBuilder<ScalarType, VectorType>;
}

/**
 * An interface for a member of a vector space - specifically a member of an inner product space.
 */
export interface Vector<ScalarType> {
  /**
   * Yields a `ScalarOperations` object which will allow consumers to work generically
   * with the scalars contained in the vector.
   */
  ops(): ScalarOperations<ScalarType>;

  /**
   * Yields a `VectorBuilder` which will build new vectors of the same type
   */
  builder(): VectorBuilder<ScalarType, Vector<ScalarType>>;

  /**
   * Yields a `MatrixBuilder` which will build new matrices of a compatible type
   */
  matrixBuilder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;

  /**
   * @returns The contents of the vector as an array
   */
  getData(): VectorData<ScalarType>;

  /**
   * @param index - The index of the entry to retrieve
   * @returns The entry located at `index`
   */
  getEntry(index: number): ScalarType;

  /**
   * Implements vector addition
   *
   * @param other - The vector to add
   * @returns The vector sum
   */
  add(other: Vector<ScalarType>): Vector<ScalarType>;

  /**
   * Implements vector multiplication by a scalar
   *
   * @param scalar - The scalar by which to multiply
   * @returns The product
   */
  scalarMultiply(scalar: ScalarType): Vector<ScalarType>;

  /**
   * @param other - The vector with which to calculate an inner product
   * @returns The inner product
   */
  innerProduct(other: Vector<ScalarType>): ScalarType;

  /**
   * @param u - The vector on which to project this
   * @returns This vector projected onto `u`
   */
  projectOnto(u: Vector<ScalarType>): Vector<ScalarType>;

  /**
   * @param other - The vector with which to calculate an outer product
   * @returns The outer product
   */
  outerProduct(other: Vector<ScalarType>): Matrix<ScalarType>;

  /**
   * @returns The dimension of the vector
   */
  getDimension(): number;

  /**
   * @param other - The vector against which to compare
   * @returns - `true` if `this` is equal to `other`
   */
  equals(other: Vector<ScalarType>): boolean;
}
