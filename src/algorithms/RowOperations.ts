import { Matrix } from '..';
import { assertValidMatrixIndex } from '../utilities/ErrorAssertions';

export class RowOperations {
  /**
   * Returns a new matrix whose row at `rowIndex` is multipled by `scalar`
   *
   * @param {Matrix<ScalarType>} matrix  The original matrix
   * @param {number} rowIndex  The index of the row to modify
   * @param {ScalarType} scalar  The factor by which to scale the row
   * @returns {Matrix<number>}
   */
  static multiplyRowByScalar<ScalarType>(
    matrix: Matrix<ScalarType>,
    rowIndex: number,
    scalar: ScalarType
  ): Matrix<ScalarType> {
    assertValidMatrixIndex(matrix, rowIndex, 0);
    const ops = matrix.ops();
    return RowOperations.addScalarMultipleOfRowToRow(
      matrix,
      rowIndex,
      rowIndex,
      ops.subtract(scalar, ops.one())
    );
  }

  /**
   * Returns a new matrix whose row at `targetRow` has had the row at `rowToAdd` added to it.
   *
   * @param {Matrix<ScalarType>} matrix  The original matrix
   * @param {number} targetRow  The index of the row to modify
   * @param {number} rowToAdd  The index of the row to add
   * @returns {Matrix<ScalarType>}
   */
  static addRowToRow<ScalarType>(
    matrix: Matrix<ScalarType>,
    targetRow: number,
    rowToAdd: number
  ): Matrix<ScalarType> {
    return RowOperations.addScalarMultipleOfRowToRow(
      matrix,
      targetRow,
      rowToAdd,
      matrix.ops().one()
    );
  }

  /**
   * Returns a new matrix whose row at `targetRow` has had a scalar multiple of `rowToAdd` added to it.
   *
   * @param {Matrix<ScalarType>} matrix  The original matrix
   * @param {number} targetRow  The index of the row to modify
   * @param {number} rowToAdd  The index of the row to be scaled and added
   * @param {ScalarType} scalar  The factor by which to scale the row
   * @returns {Matrix<ScalarType>}
   */
  static addScalarMultipleOfRowToRow<ScalarType>(
    matrix: Matrix<ScalarType>,
    targetRow: number,
    rowToAdd: number,
    scalar: ScalarType
  ): Matrix<ScalarType> {
    assertValidMatrixIndex(matrix, targetRow, 0);
    assertValidMatrixIndex(matrix, rowToAdd, 0);

    const ops = matrix.ops();
    const data = matrix.getData();
    for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
      data[targetRow][j] = ops.add(data[targetRow][j], ops.multiply(scalar, data[rowToAdd][j]));
    }

    return matrix.builder().fromData(data);
  }

  /**
   * Returns a new matrix whose row at index `first` has been exchanged with the row at index `second`
   *
   * @param {Matrix<ScalarType>} matrix  The original matrix
   * @param {number} first  The index of the first row to exchange
   * @param {number} second  The index of the second row to exchange
   * @returns {Matrix<ScalarType>}
   */
  static exchangeRows<ScalarType>(
    matrix: Matrix<ScalarType>,
    first: number,
    second: number
  ): Matrix<ScalarType> {
    assertValidMatrixIndex(matrix, first, 0);
    assertValidMatrixIndex(matrix, second, 0);

    const dataCopy = matrix.getData();
    const data = matrix.getData();

    data[second] = dataCopy[first];
    data[first] = dataCopy[second];

    return matrix.builder().fromData(data);
  }
}
