import { Matrix } from '../matrix/Matrix';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { MatrixBuilder, VectorBuilder } from '../../index';

export type VectorData<ScalarType> = Array<ScalarType>;

export interface VectorConstructor<ScalarType, VectorType extends Vector<ScalarType>> {
  new (data: VectorData<ScalarType>): VectorType;
  ops(): ScalarOperations<ScalarType>;
  builder(): VectorBuilder<ScalarType, VectorType>;
}

/**
 * An interface for a member of a vector space - specifically a member of an inner product space.
 */
export interface Vector<ScalarType> {
  ops(): ScalarOperations<ScalarType>;
  builder(): VectorBuilder<ScalarType, Vector<ScalarType>>;
  matrixBuilder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;

  /**
   * @returns {VectorData<ScalarType>}  The contents of the vector as an array
   */
  getData(): VectorData<ScalarType>;

  /**
   * @param {number} index
   * @returns {ScalarType}  The entry located at `index`
   */
  getEntry(index: number): ScalarType;

  /**
   * Implements vector addition
   *
   * @param {Vector<ScalarType>} other  The vector to add
   * @returns {Vector<ScalarType>}  The vector sum
   */
  add(other: Vector<ScalarType>): Vector<ScalarType>;

  /**
   * Implements vector multiplication by a scalar
   *
   * @param {ScalarType} scalar  The scalar by which to multiply
   * @returns {Vector<ScalarType>}  The product
   */
  scalarMultiply(scalar: ScalarType): Vector<ScalarType>;

  /**
   * @param {Vector<ScalarType>} other
   * @returns {ScalarType}  The inner product
   */
  innerProduct(other: Vector<ScalarType>): ScalarType;

  /**
   * @param {Vector<ScalarType>} other
   * @returns {Matrix<ScalarType>}  The outer product
   */
  outerProduct(other: Vector<ScalarType>): Matrix<ScalarType>;

  /**
   * @returns {number}  The dimension of the vector
   */
  getDimension(): number;

  /**
   * @param {Vector<ScalarType>} other
   * @returns {boolean}  true if `this` is equal to `other`
   */
  equals(other: Vector<ScalarType>): boolean;
}
