// TODO: make generic

import { Matrix, NumberMatrix } from '..';
import { assertValidMatrixIndex } from '../utilities/ErrorAssertions';

export class RowOperations {
  /**
   * Returns a new matrix whose row at `rowIndex` is multipled by `scalar`
   *
   * @param {Matrix<number>} matrix  The original matrix
   * @param {number} rowIndex  The index of the row to modify
   * @param {number} scalar  The factor by which to scale the row
   * @returns {Matrix<number>}
   */
  static multiplyRowByScalar(
    matrix: Matrix<number>,
    rowIndex: number,
    scalar: number
  ): Matrix<number> {
    assertValidMatrixIndex(matrix, rowIndex, 0);
    return RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, rowIndex, scalar - 1);
  }

  /**
   * Returns a new matrix whose row at `targetRow` has had the row at `rowToAdd` added to it.
   *
   * @param {Matrix<number>} matrix  The original matrix
   * @param {number} targetRow  The index of the row to modify
   * @param {number} rowToAdd  The index of the row to add
   * @returns {Matrix<number>}
   */
  static addRowToRow(matrix: Matrix<number>, targetRow: number, rowToAdd: number): Matrix<number> {
    return RowOperations.addScalarMultipleOfRowToRow(matrix, targetRow, rowToAdd, 1);
  }

  /**
   * Returns a new matrix whose row at `targetRow` has had a scalar multiple of `rowToAdd` added to it.
   *
   * @param {Matrix<number>} matrix  The original matrix
   * @param {number} targetRow  The index of the row to modify
   * @param {number} rowToAdd  The index of the row to be scaled and added
   * @param {number} scalar  The factor by which to scale the row
   * @returns {Matrix<number>}
   */
  static addScalarMultipleOfRowToRow(
    matrix: Matrix<number>,
    targetRow: number,
    rowToAdd: number,
    scalar: number
  ): Matrix<number> {
    assertValidMatrixIndex(matrix, targetRow, 0);
    assertValidMatrixIndex(matrix, rowToAdd, 0);

    const data = matrix.getData();
    for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
      data[targetRow][j] = data[targetRow][j] + scalar * data[rowToAdd][j];
    }

    return NumberMatrix.builder().fromData(data);
  }

  /**
   * Returns a new matrix whose row at index `first` has been exchanged with the row at index `second`
   *
   * @param {Matrix<number>} matrix  The original matrix
   * @param {number} first  The index of the first row to exchange
   * @param {number} second  The index of the second row to exchange
   * @returns {Matrix<number>}
   */
  static exchangeRows(matrix: Matrix<number>, first: number, second: number): Matrix<number> {
    assertValidMatrixIndex(matrix, first, 0);
    assertValidMatrixIndex(matrix, second, 0);

    const dataCopy = matrix.getData();
    const data = matrix.getData();

    data[second] = dataCopy[first];
    data[first] = dataCopy[second];

    return NumberMatrix.builder().fromData(data);
  }
}
