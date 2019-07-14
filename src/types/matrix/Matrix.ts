import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector, VectorData } from '../vector/Vector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { LinearTransformation } from './LinearTransformation';
import { MatrixBuilder } from './MatrixBuilder';

export type MatrixData<S> = readonly VectorData<S>[];
export type MatrixEntryCallback<S> = (entry: S, rowIndex: number, columnIndex: number) => void;

export interface MatrixConstructor<S, V extends Vector<S>, M extends Matrix<S>> {
  new (data: MatrixData<S>): M;
  ops(): ScalarOperations<S>;
  builder(): MatrixBuilder<S, V, M>;
  vectorBuilder(): VectorBuilder<S, V>;
}

export interface Matrix<S> extends LinearTransformation<Vector<S>, Vector<S>> {
  /**
   * Yields a `ScalarOperations` object which will allow consumers to work generically
   * with the scalars contained in the vector.
   */
  ops(): ScalarOperations<S>;

  /**
   * Yields a `MatrixBuilder` which will build new matrices of the same type
   */
  builder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * Yields a `VectorBuilder` which will build new vectors of a compatible type
   */
  vectorBuilder(): VectorBuilder<S, Vector<S>>;

  /**
   * @returns The contents of the matrix as an array of arrays.
   */
  toArray(): S[][];

  /**
   * @returns The contents of the matrix as a nested map of rowIndex to columnIndex to nonzero value
   */
  getSparseData(): Map<number, Map<number, S>>;

  /**
   * @returns The number of rows in the matrix
   */
  getNumberOfRows(): number;

  /**
   * @returns The number of columns in the matrix
   */
  getNumberOfColumns(): number;

  /**
   * @returns An array of vectors corresponding to the rows of the matrix
   */
  getRowVectors(): Vector<S>[];

  /**
   * @param rowIndex - The index for which to fetch the row
   * @returns A vector corresponding to the row at index `rowIndex`
   */
  getRow(rowIndex: number): Vector<S>;

  /**
   * @returns An array of vectors corresponding to the columns of the matrix
   */
  getColumnVectors(): Vector<S>[];

  /**
   * @param columnIndex - The index for which to fetch the column
   * @returns A vector corresponding to the column at index `columnIndex`
   */
  getColumn(columnIndex: number): Vector<S>;

  /**
   * @returns A vector containing the diagonal elements of the matrix
   */
  getDiagonal(): Vector<S>;

  /**
   * @param rowIndex - The index of the row containing the entry
   * @param columnIndex - The index of the column containing the entry
   * @returns The entry located at `(rowIndex, columnIndex)`
   */
  getEntry(rowIndex: number, columnIndex: number): S;

  /**
   * Returns a *new* matrix equal to the old one, except with the entry at
   * `(rowIndex, columnIndex)` replaced with `value`
   *
   * @param rowIndex - The row containing the value to replace
   * @param columnIndex - The column containing the value to replace
   * @param value - The new value
   * @returns A new matrix
   */
  set(rowIndex: number, columnIndex: number, value: S): Matrix<S>;

  /**
   * Implements matrix multiplication
   * @param other - The matrix by which to multiply
   * @returns The matrix product
   */
  multiply(other: Matrix<S>): Matrix<S>;

  /**
   * @returns The adjoint of the matrix
   */
  adjoint(): Matrix<S>;

  /**
   * @returns The transpose of the matrix
   */
  transpose(): Matrix<S>;

  /**
   * @returns The trace of the matrix
   */
  trace(): S;

  /**
   * Implements matrix addition
   * @param other - The matrix to add
   * @returns The matrix sum
   */
  add(other: Matrix<S>): Matrix<S>;

  /**
   * Implements multiplication of a matrix by a scalar
   * @param scalar - The scalar by which to multiply
   * @returns The product
   */
  scalarMultiply(scalar: S): Matrix<S>;

  /**
   * @param other - The matrix against which to compare
   * @returns true if `this` is equal to `other`
   */
  equals(other: Matrix<S>): boolean;

  /**
   * Executes the `callback` function for each entry in the matrix.
   * @param callback - The function to execute for each entry
   */
  forEachEntry(callback: MatrixEntryCallback<S>): void;
}
