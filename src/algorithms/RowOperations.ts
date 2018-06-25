import { Matrix } from "../Matrix";

export class RowOperations {
  static multiplyRowByScalar(matrix: Matrix, rowIndex: number, scalar: number): Matrix {
    return RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, rowIndex, scalar - 1);
  }

  static addRowToRow(matrix: Matrix, targetRow: number, rowToAdd: number): Matrix {
    return RowOperations.addScalarMultipleOfRowToRow(matrix, targetRow, rowToAdd, 1);
  }

  static addScalarMultipleOfRowToRow(
    matrix: Matrix,
    targetRow: number,
    rowToAdd: number,
    scalar: number
  ): Matrix {
    if (targetRow >= matrix.getNumberOfRows() || targetRow < 0) {
      throw Error();
    }

    if (rowToAdd >= matrix.getNumberOfRows() || rowToAdd < 0) {
      throw Error();
    }

    const data = matrix.getData();
    for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
      data[targetRow][j] = data[targetRow][j] + scalar * data[rowToAdd][j];
    }

    return Matrix.fromData(data);
  }

  static exchangeRows(matrix: Matrix, first: number, second: number): Matrix {
    if (first >= matrix.getNumberOfRows() || first < 0) {
      throw Error();
    }

    if (second >= matrix.getNumberOfRows() || second < 0) {
      throw Error();
    }

    const dataCopy = matrix.getData();
    const data = matrix.getData();

    data[second] = dataCopy[first];
    data[first] = dataCopy[second];

    return Matrix.fromData(data);
  }
}
