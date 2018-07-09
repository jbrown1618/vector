// TODO: make generic

import { Matrix, NumberMatrix } from '..';
import { assertValidMatrixIndex } from '../utilities/ErrorAssertions';

export class RowOperations {
  static multiplyRowByScalar(
    matrix: Matrix<number>,
    rowIndex: number,
    scalar: number
  ): Matrix<number> {
    assertValidMatrixIndex(matrix, rowIndex, 0);
    return RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, rowIndex, scalar - 1);
  }

  static addRowToRow(matrix: Matrix<number>, targetRow: number, rowToAdd: number): Matrix<number> {
    return RowOperations.addScalarMultipleOfRowToRow(matrix, targetRow, rowToAdd, 1);
  }

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

    return NumberMatrix.fromData(data);
  }

  static exchangeRows(matrix: Matrix<number>, first: number, second: number): Matrix<number> {
    assertValidMatrixIndex(matrix, first, 0);
    assertValidMatrixIndex(matrix, second, 0);

    const dataCopy = matrix.getData();
    const data = matrix.getData();

    data[second] = dataCopy[first];
    data[first] = dataCopy[second];

    return NumberMatrix.fromData(data);
  }
}
