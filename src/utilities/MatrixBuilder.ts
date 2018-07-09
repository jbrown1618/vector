import { VectorBuilder } from './VectorBuilder';
import { NumberMatrix } from '..';
import { Matrix, MatrixData } from '..';
import { Vector } from '..';

export class MatrixBuilder {
  private constructor() {}

  static empty() {
    return NumberMatrix.fromData([]);
  }

  static zeros(numberOfRows: number, numberOfColumns: number = numberOfRows): Matrix<number> {
    const columns: Array<Vector<number>> = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(VectorBuilder.zeros(numberOfRows));
    }
    return NumberMatrix.fromColumnVectors(columns);
  }

  static ones(numberOfRows: number, numberOfColumns: number = numberOfRows): Matrix<number> {
    const columns: Array<Vector<number>> = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(VectorBuilder.ones(numberOfRows));
    }
    return NumberMatrix.fromColumnVectors(columns);
  }

  static identity(size: number): Matrix<number> {
    if (size < 0) {
      throw Error();
    }

    const columns: Array<Vector<number>> = [];
    for (let i = 0; i < size; i++) {
      columns.push(VectorBuilder.elementaryVector(size, i));
    }
    return NumberMatrix.fromColumnVectors(columns);
  }

  static diagonal(diagonalEntries: Vector<number>): Matrix<number> {
    const numEntries = diagonalEntries.getDimension();
    return NumberMatrix.fromColumnVectors(
      diagonalEntries
        .getData()
        .map((entry, i) => VectorBuilder.elementaryVector(numEntries, i).scalarMultiply(entry))
    );
  }

  static tridiagonal(
    leftEntries: Vector<number>,
    diagonalEntries: Vector<number>,
    rightEntries: Vector<number>
  ): Matrix<number> {
    const numEntries = diagonalEntries.getDimension();
    if (
      leftEntries.getDimension() !== numEntries - 1 ||
      rightEntries.getDimension() !== numEntries - 1
    ) {
      throw Error('');
    }

    const getColumn = (diagonalEntry: number, i: number) => {
      return VectorBuilder.fromIndexFunction(index => {
        if (index === i) {
          return diagonalEntry;
        } else if (index === i - 1) {
          return leftEntries.getEntry(i - 1);
        } else if (index === i + 1) {
          return rightEntries.getEntry(i);
        }
        return 0;
      }, numEntries);
    };

    return NumberMatrix.fromColumnVectors(diagonalEntries.getData().map(getColumn));
  }

  static augment(left: Matrix<number>, right: Matrix<number>): Matrix<number> {
    if (left.getNumberOfRows() !== right.getNumberOfRows()) {
      throw Error('Dimension mismatch!');
    }

    return NumberMatrix.fromColumnVectors([
      ...left.getColumnVectors(),
      ...right.getColumnVectors()
    ]);
  }

  private static stack(top: Matrix<number>, bottom: Matrix<number>): Matrix<number> {
    if (top.getNumberOfColumns() !== bottom.getNumberOfColumns()) {
      throw Error('Dimension mismatch!');
    }

    const left = top.transpose();
    const right = bottom.transpose();
    return MatrixBuilder.augment(left, right).transpose();
  }

  static flatten(grid: Array<Array<Matrix<number>>>): Matrix<number> {
    if (grid.length === 0 || grid[0].length === 0) {
      return MatrixBuilder.empty();
    }

    const rowsAsMatrices: Array<Matrix<number>> = grid.map(gridRow => {
      return gridRow.reduce((accumulator: Matrix<number>, gridEntry: Matrix<number>) => {
        return MatrixBuilder.augment(accumulator, gridEntry);
      });
    });

    return rowsAsMatrices.reduce((accumulator: Matrix<number>, row: Matrix<number>) => {
      return MatrixBuilder.stack(accumulator, row);
    });
  }

  static repeat(matrix: Matrix<number>, rows: number, columns: number) {
    const grid: Array<Array<Matrix<number>>> = [];

    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i][j] = matrix;
      }
    }

    return MatrixBuilder.flatten(grid);
  }

  static slice(
    matrix: Matrix<number>,
    rowStartIndex: number = 0,
    columnStartIndex: number = 0,
    rowEndIndex: number = matrix.getNumberOfRows(),
    columnEndIndex: number = matrix.getNumberOfColumns()
  ): Matrix<number> {
    if (rowStartIndex > rowEndIndex || columnStartIndex > columnEndIndex) {
      throw Error('start index must be less than end index');
    }

    if (rowStartIndex < 0 || columnStartIndex < 0) {
      throw Error('indices must be positive');
    }

    if (rowEndIndex > matrix.getNumberOfRows() || columnEndIndex > matrix.getNumberOfColumns()) {
      throw Error('index out of bounds');
    }

    const data: MatrixData<number> = [];
    let newRowIndex = 0;
    for (let i = rowStartIndex; i < rowEndIndex; i++) {
      data[newRowIndex] = [];
      let newColumnIndex = 0;
      for (let j = columnStartIndex; j < columnEndIndex; j++) {
        data[newRowIndex][newColumnIndex] = matrix.getEntry(i, j);
        newColumnIndex++;
      }
      newRowIndex++;
    }

    return NumberMatrix.fromData(data);
  }
}
