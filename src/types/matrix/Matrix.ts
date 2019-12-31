import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector, VectorData } from '../vector/Vector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { LinearTransformation } from './LinearTransformation';
import { MatrixBuilder } from './MatrixBuilder';

/**
 * The data stored in a {@link Matrix} represented as a 2-D array
 * @public
 */
export type MatrixData<S> = readonly VectorData<S>[];

/**
 * A tuple representing the shape of a {@link Matrix}.
 * The first entry is the number of rows, and the second entry is the number of columns.
 * @public
 */
export type MatrixShape = [number, number];

// TODO - the matrix constructor should be able to take data in any format.  Maybe we just need conversion functions for each of the data formats
/**
 * @internal
 */
export interface MatrixConstructor<S, V extends Vector<S>, M extends Matrix<S>> {
  new (data: MatrixData<S>): M;
  ops(): ScalarOperations<S>;
  builder(): MatrixBuilder<S, V, M>;
  vectorBuilder(): VectorBuilder<S, V>;
}

/**
 * A generalized Matrix - one of the core data types
 * @public
 */
export interface Matrix<S> extends LinearTransformation<Vector<S>, Vector<S>> {
  /**
   * Returns a {@link ScalarOperations} object which will allow consumers to work generically
   * with the scalars contained in the vector.
   * @public
   */
  ops(): ScalarOperations<S>;

  /**
   * Returns a {@link MatrixBuilder} which will build new matrices of the same type
   * @public
   */
  builder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * Returns a {@link VectorBuilder} which will build new vectors of a compatible type
   * @public
   */
  vectorBuilder(): VectorBuilder<S, Vector<S>>;

  /**
   * Returns the contents of the matrix as a 2-D array.
   * @returns The contents of the matrix
   * @public
   */
  toArray(): S[][];

  /**
   * Returns the contents of the matrix as a nested map of rowIndex to columnIndex to nonzero value
   * @returns The contents of the matrix
   * @public
   */
  getSparseData(): Map<number, Map<number, S>>;

  /**
   * Returns a tuple representing the dimensions of the matrix.
   * The first entry is the number of rows, and the second entry is the number of columns.
   * @returns The shape of the matrix as a tuple
   * @public
   */
  getShape(): MatrixShape;

  /**
   * Returns the number of rows in the matrix
   * @returns The number of rows
   * @public
   */
  getNumberOfRows(): number;

  /**
   * Returns the number of columns in the matrix
   * @returns The number of columns
   * @public
   */
  getNumberOfColumns(): number;

  /**
   * Returns an array of vectors corresponding to the rows of the matrix
   * @returns The row vectors
   * @public
   */
  getRowVectors(): Vector<S>[];

  /**
   * Returns a vector corresponding to the row at index `rowIndex`
   * @param i - The index for which to fetch the row
   * @returns The row vector
   * @public
   */
  getRow(i: number): Vector<S>;

  /**
   * An array of vectors corresponding to the columns of the matrix
   * @returns The column vectors
   * @public
   */
  getColumnVectors(): Vector<S>[];

  /**
   * Returns a vector corresponding to the column at index `columnIndex`
   * @param j - The index for which to fetch the column
   * @returns The column vector
   * @public
   */
  getColumn(j: number): Vector<S>;

  /**
   * Returns a vector containing the elements of the main diagonal of the matrix
   * @returns The vector of diagonal entries
   * @public
   */
  getDiagonal(): Vector<S>;

  /**
   * Returns the entry of the matrix at the specified indices `i` and `j`
   * @param rowIndex - The index of the row containing the entry
   * @param columnIndex - The index of the column containing the entry
   * @returns The entry
   * @public
   */
  getEntry(i: number, j: number): S;

  /**
   * Returns a new matrix equal to the old one, except with the entry at
   * `(i, j)` replaced with `value`
   *
   * @param rowIndex - The row containing the value to replace
   * @param columnIndex - The column containing the value to replace
   * @param value - The new value
   * @returns The new matrix
   * @public
   */
  set(i: number, j: number, value: S): Matrix<S>;

  /**
   * Implements matrix multiplication
   * @param other - The matrix by which to multiply
   * @returns The matrix product
   * @public
   */
  multiply(other: Matrix<S>): Matrix<S>;

  /**
   * Applies the matrix as a linear transformation to the given vector.
   * Implements matrix-vector multiplication.
   * @param vector - the vector that should be transformed by the matrix
   * @returns The transformed vector
   * @public
   */
  apply(vector: Vector<S>): Vector<S>;

  /**
   * Returns the adjoint of the matrix
   *
   * @remarks
   * The adjoint of a matrix A is the conjugate of the transpose of A
   *
   * @returns The adjoint
   * @public
   */
  adjoint(): Matrix<S>;

  /**
   * Returns the transpose of the matrix
   *
   * @remarks
   * The transpose of a matrix A is the unique matrix for which the entry
   * at `(i,j)` is equal to the entry in A at `(j, i)`
   *
   * @returns The transpose
   * @public
   */
  transpose(): Matrix<S>;

  /**
   * Returns the trace of the matrix
   *
   * @remarks
   * The trace of a matrix is the sum of the entries along the main diagonal
   *
   * @returns The trace
   * @public
   */
  trace(): S;

  /**
   * Implements matrix addition
   * @param other - The matrix to add
   * @returns The matrix sum
   * @public
   */
  add(other: Matrix<S>): Matrix<S>;

  /**
   * Implements multiplication of a matrix by a scalar
   * @param scalar - The scalar by which to multiply
   * @returns The product
   * @public
   */
  scalarMultiply(scalar: S): Matrix<S>;

  /**
   * Tests if two matrices are equal
   * @param other - The matrix against which to compare
   * @returns true if `this` is equal to `other`
   * @public
   */
  equals(other: Matrix<S>): boolean;

  /**
   * Executes the `callback` function for each entry in the matrix.
   * @param callback - The function to execute for each entry
   * @public
   */
  forEach(callback: (entry: S, rowIndex: number, columnIndex: number) => void): void;

  /**
   * Builds a matrix by transforming the values of another matrix.
   *
   * @example
   * ```
   * const original = matrixBuilder.fromArray([
   *   [ 1, 2, 3 ]
   *   [ 4, 5, 6 ]
   * ]);
   *
   * const originalPlusOne = original.map(value => value + 1);
   *
   * // [ 2 3 4 ]
   * // [ 5 6 7 ]
   *
   * const originalPlusIMinusJ = original.map((value, i, j) => value + i - j);
   *
   * // [ 1 1 1 ]
   * // [ 5 5 5 ]
   * ```
   * @param entryFunction - A function which takes an entry of
   *     the original matrix and its indices, and returns the corresponding entry of the new matrix
   * @returns The new matrix
   * @public
   */
  map(entryFunction: (entry: S, rowIndex: number, columnIndex: number) => S): Matrix<S>;
}
