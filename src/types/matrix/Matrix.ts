import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector, VectorData } from '../vector/Vector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { LinearTransformation } from './LinearTransformation';
import { MatrixBuilder } from './MatrixBuilder';

export type MatrixData<ScalarType> = Array<VectorData<ScalarType>>;
export type MatrixEntryCallback<ScalarType> = (
  entry: ScalarType,
  rowIndex: number,
  columnIndex: number
) => void;

export interface MatrixConstructor<
  ScalarType,
  VectorType extends Vector<ScalarType>,
  MatrixType extends Matrix<ScalarType>
> {
  new (data: ScalarType[][]): MatrixType;
  ops(): ScalarOperations<ScalarType>;
  builder(): MatrixBuilder<ScalarType, VectorType, MatrixType>;
  vectorBuilder(): VectorBuilder<ScalarType, VectorType>;
}

export interface Matrix<ScalarType>
  extends LinearTransformation<Vector<ScalarType>, Vector<ScalarType>> {
  /**
   * Yields a `ScalarOperations` object which will allow consumers to work generically
   * with the scalars contained in the vector.
   */
  ops(): ScalarOperations<ScalarType>;

  /**
   * Yields a `MatrixBuilder` which will build new matrices of the same type
   */
  builder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;

  /**
   * Yields a `VectorBuilder` which will build new vectors of a compatible type
   */
  vectorBuilder(): VectorBuilder<ScalarType, Vector<ScalarType>>;

  /**
   * @returns The contents of the matrix as an array of arrays.
   */
  getData(): MatrixData<ScalarType>;

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
  getRowVectors(): Array<Vector<ScalarType>>;

  /**
   * @param rowIndex - The index for which to fetch the row
   * @returns A vector corresponding to the row at index `rowIndex`
   */
  getRow(rowIndex: number): Vector<ScalarType>;

  /**
   * @returns An array of vectors corresponding to the columns of the matrix
   */
  getColumnVectors(): Array<Vector<ScalarType>>;

  /**
   * @param columnIndex - The index for which to fetch the column
   * @returns A vector corresponding to the column at index `columnIndex`
   */
  getColumn(columnIndex: number): Vector<ScalarType>;

  /**
   * @param rowIndex - The index of the row containing the entry
   * @param columnIndex - The index of the column containing the entry
   * @returns The entry located at `(rowIndex, columnIndex)`
   */
  getEntry(rowIndex: number, columnIndex: number): ScalarType;

  /**
   * Returns a *new* matrix equal to the old one, except with the entry at
   * `(rowIndex, columnIndex)` replaced with `value`
   *
   * @param rowIndex - The row containing the value to replace
   * @param columnIndex - The column containing the value to replace
   * @param value - The new value
   * @returns A new matrix
   */
  set(rowIndex: number, columnIndex: number, value: ScalarType): Matrix<ScalarType>;

  /**
   * Implements matrix multiplication
   * @param other - The matrix by which to multiply
   * @returns The matrix product
   */
  multiply(other: Matrix<ScalarType>): Matrix<ScalarType>;

  /**
   * @returns The adjoint of the matrix
   */
  adjoint(): Matrix<ScalarType>;

  /**
   * @returns The transpose of the matrix
   */
  transpose(): Matrix<ScalarType>;

  /**
   * Implements matrix addition
   * @param other - The matrix to add
   * @returns The matrix sum
   */
  add(other: Matrix<ScalarType>): Matrix<ScalarType>;

  /**
   * Implements multiplication of a matrix by a scalar
   * @param scalar - The scalar by which to multiply
   * @returns The product
   */
  scalarMultiply(scalar: ScalarType): Matrix<ScalarType>;

  /**
   * @param other - The matrix against which to compare
   * @returns true if `this` is equal to `other`
   */
  equals(other: Matrix<ScalarType>): boolean;

  /**
   * Executes the `callback` function for each entry in the matrix.
   * @param callback - The function to execute for each entry
   */
  forEachEntry(callback: MatrixEntryCallback<ScalarType>): void;
}
