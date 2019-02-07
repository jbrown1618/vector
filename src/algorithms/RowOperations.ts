import { Matrix } from '../types/matrix/Matrix';
import { assertValidMatrixIndex } from '../utilities/ErrorAssertions';

export class RowOperations {
  /**
   * Returns a new matrix whose row at `rowIndex` is multipled by `scalar`
   *
   * @param matrix - The original matrix
   * @param rowIndex - The index of the row to modify
   * @param scalar - The factor by which to scale the row
   * @returns The matrix with the transformation applied
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
   * @param matrix - The original matrix
   * @param targetRow - The index of the row to modify
   * @param rowToAdd - The index of the row to add
   * @returns The matrix with the transformation applied
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
   * @param matrix - The original matrix
   * @param targetRow - The index of the row to modify
   * @param rowToAdd - The index of the row to be scaled and added
   * @param scalar - The factor by which to scale the row
   * @returns The matrix with the transformation applied
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
   * @param matrix - The original matrix
   * @param first - The index of the first row to exchange
   * @param second - The index of the second row to exchange
   * @returns The matrix with the transformation applied
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
