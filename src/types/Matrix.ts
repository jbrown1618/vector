import { LinearTransformation } from './LinearTransformation';
import { Vector, VectorData } from './Vector';
import { ScalarContainer } from './ScalarContainer';

export type MatrixData<ScalarType> = Array<VectorData<ScalarType>>;
export type MatrixEntryCallback<ScalarType> = (
  entry: ScalarType,
  rowIndex: number,
  columnIndex: number
) => void;

export interface Matrix<ScalarType>
  extends LinearTransformation<Vector<ScalarType>, Vector<ScalarType>>,
    ScalarContainer<ScalarType> {
  /**
   * @returns {MatrixData<ScalarType>}  The contents of the matrix as an array of arrays.
   */
  getData(): MatrixData<ScalarType>;

  /**
   * @returns {number}  The number of rows in the matrix
   */
  getNumberOfRows(): number;

  /**
   * @returns {number}  The number of columns in the matrix
   */
  getNumberOfColumns(): number;

  /**
   * @returns {Array<Vector<ScalarType>>} An array of vectors corresponding to the rows of the matrix
   */
  getRowVectors(): Array<Vector<ScalarType>>;

  /**
   * @param {number} rowIndex  The index for which to fetch the row
   * @returns {Vector<ScalarType>}  A vector corresponding to the row at index `rowIndex`
   */
  getRow(rowIndex: number): Vector<ScalarType>;

  /**
   * @returns {Array<Vector<ScalarType>>}  An array of vectors corresponding to the columns of the matrix
   */
  getColumnVectors(): Array<Vector<ScalarType>>;

  /**
   * @param {number} columnIndex  The index for which to fetch the column
   * @returns {Vector<ScalarType>}  A vector corresponding to the column at index `columnIndex`
   */
  getColumn(columnIndex: number): Vector<ScalarType>;

  /**
   * @param {number} rowIndex  The index of the row containing the entry
   * @param {number} columnIndex  The index of the column containing the entry
   * @returns {ScalarType}  The entry located at `(rowIndex, columnIndex)`
   */
  getEntry(rowIndex: number, columnIndex: number): ScalarType;

  /**
   * Returns a *new* matrix equal to the old one, except with the entry at
   * `(rowIndex, columnIndex)` replaced with `value`
   *
   * @param {number} rowIndex  The row containing the value to replace
   * @param {number} columnIndex  The column containing the value to replace
   * @param {ScalarType} value  The new value
   * @returns {Matrix<ScalarType>}  A new matrix
   */
  set(rowIndex: number, columnIndex: number, value: ScalarType): Matrix<ScalarType>;

  /**
   * Implements matrix multiplication
   * @param {Matrix<ScalarType>} other  The matrix by which to multiply
   * @returns {Matrix<ScalarType>}  The matrix product
   */
  multiply(other: Matrix<ScalarType>): Matrix<ScalarType>;

  /**
   * @returns {Matrix<ScalarType>}  The adjoint of the matrix
   */
  adjoint(): Matrix<ScalarType>;

  /**
   * @returns {Matrix<ScalarType>}  The transpose of the matrix
   */
  transpose(): Matrix<ScalarType>;

  /**
   * Implements matrix addition
   * @param {Matrix<ScalarType>} other  The matrix to add
   * @returns {Matrix<ScalarType>}  The matrix sum
   */
  add(other: Matrix<ScalarType>): Matrix<ScalarType>;

  /**
   * Implements multiplication of a matrix by a scalar
   * @param {ScalarType} scalar  The scalar by which to multiply
   * @returns {Matrix<ScalarType>}  The product
   */
  scalarMultiply(scalar: ScalarType): Matrix<ScalarType>;

  /**
   * @param {Matrix<ScalarType>} other
   * @returns {boolean}  true if `this` is equal to `other`
   */
  equals(other: Matrix<ScalarType>): boolean;

  /**
   * Executes the `callback` function for each entry in the matrix.
   * @param {MatrixEntryCallback<ScalarType>} callback
   */
  forEachEntry(callback: MatrixEntryCallback<ScalarType>): void;
}
