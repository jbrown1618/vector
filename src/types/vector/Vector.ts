import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { Matrix } from '../matrix/Matrix';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { VectorBuilder } from './VectorBuilder';

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
   * @returns {ScalarType} the Euclidean norm of the vector
   */
  norm(): ScalarType;

  /**
   * @returns {Vector<ScalarType>} a new vector with the same direction
   *     but magnitude 1, or `undefined` if it is the zero vector
   */
  normalize(): Vector<ScalarType> | undefined;

  /**
   * @param u - the vector on which to project this
   * @returns this vector projected onto `u`
   */
  projectOnto(u: Vector<ScalarType>): Vector<ScalarType>;

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
