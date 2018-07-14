import { VectorBuilder } from './VectorBuilder';
import { NumberMatrix } from '..';
import { Matrix, MatrixData } from '..';
import { Vector } from '..';
import { assertValidMatrixIndex } from './ErrorAssertions';

export class MatrixBuilder {
  private constructor() {}

  /**
   * Returns a 0x0 matrix
   *
   * ```
   * MatrixBuilder.empty(); // []
   * ```
   */
  static empty(): Matrix<number> {
    return NumberMatrix.fromData([]);
  }

  /**
   * Returns a matrix of the specified dimensions, consisting of all zeros
   *
   * ```
   * MatrixBuilder.zeros(2, 3);
   *
   * // [ 0 0 0 ]
   * // [ 0 0 0 ]
   * ```
   * @param {number} numberOfRows
   * @param {number} numberOfColumns
   * @returns {Matrix<number>}
   */
  static zeros(numberOfRows: number, numberOfColumns: number = numberOfRows): Matrix<number> {
    const columns: Array<Vector<number>> = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(VectorBuilder.zeros(numberOfRows));
    }
    return NumberMatrix.fromColumnVectors(columns);
  }

  /**
   * Returns a matrix of the specified dimensions, consisting of all ones
   *
   * ```
   * MatrixBuilder.ones(2, 3);
   *
   * // [ 1 1 1 ]
   * // [ 1 1 1 ]
   * ```
   * @param {number} numberOfRows
   * @param {number} numberOfColumns
   * @returns {Matrix<number>}
   */
  static ones(numberOfRows: number, numberOfColumns: number = numberOfRows): Matrix<number> {
    const columns: Array<Vector<number>> = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(VectorBuilder.ones(numberOfRows));
    }
    return NumberMatrix.fromColumnVectors(columns);
  }

  /**
   * Returns a `size` x `size` identity matrix
   *
   * ```
   * MatrixBuilder.identity(3);
   *
   * // [ 1 0 0 ]
   * // [ 0 1 0 ]
   * // [ 0 0 1 ]
   * ```
   * @param {number} size
   * @returns {Matrix<number>}
   */
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

  /**
   * Returns a square diagonal matrix whose diagonal entries come from `diagonalEntries`
   *
   * ```
   * const diagonalEntries = NumberVector.fromValues(1, 2, 3);
   * MatrixBuilder.diagonal(diagonalEntries);
   *
   * // [ 1 0 0 ]
   * // [ 0 2 0 ]
   * // [ 0 0 3 ]
   * ```
   * @param {Vector<number>} diagonalEntries
   * @returns {Matrix<number>}
   */
  static diagonal(diagonalEntries: Vector<number>): Matrix<number> {
    const numEntries = diagonalEntries.getDimension();
    return NumberMatrix.fromColumnVectors(
      diagonalEntries
        .getData()
        .map((entry, i) => VectorBuilder.elementaryVector(numEntries, i).scalarMultiply(entry))
    );
  }

  /**
   * Returns a square tridiagonal matrix whose diagonal entries correspond to the entries of
   * `diagonalEntries`, whose entries in the left-off-diagonal correspond to the entries
   * of `leftEntries`, and whose entries in the right-off-diagonal correspond fo the
   * entries of `rightEntries`.
   * The off-diagonals must have one fewer entry than the diagonal.
   * Throws an error if the dimensions are not correct.
   *
   * ```
   * const leftEntries = NumberVector.fromEntries(1, 2);
   * const diagonalEntries = NumberVector.fromEntries(3, 4, 5);
   * const rightEntries = NumberVector.fromEntries(6, 7);
   *
   * MatrixBuilder.tridiagonal(leftEntries, diagonalEntries, rightEntries);
   *
   * // [ 3 6 0 ]
   * // [ 1 4 7 ]
   * // [ 0 2 5 ]
   * ```
   *
   * @param {Vector<number>} leftEntries
   * @param {Vector<number>} diagonalEntries
   * @param {Vector<number>} rightEntries
   * @returns {Matrix<number>}
   */
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

  /**
   * Returns a new matrix consisting of `left` and `right` next to one another.
   * Throws an error of `left` and `right` do not have the same number of rows.
   *
   * ```
   * const left = MatrixBuilder.ones(2, 3);
   * const right = MatrixBuilder.zeros(2, 4);
   *
   * MatrixBuilder.augment(left, right);
   *
   * // [ 1 1 1 0 0 0 0 ]
   * // [ 1 1 1 0 0 0 0 ]
   * ```
   * @param {Matrix<number>} left
   * @param {Matrix<number>} right
   * @returns {Matrix<number>}
   */
  static augment(left: Matrix<number>, right: Matrix<number>): Matrix<number> {
    if (left.getNumberOfRows() !== right.getNumberOfRows()) {
      throw Error('Dimension mismatch!');
    }

    return NumberMatrix.fromColumnVectors([
      ...left.getColumnVectors(),
      ...right.getColumnVectors()
    ]);
  }

  /**
   * Returns a new matrix consisting of `top` and `bottom` on top of one another.
   * Throws an error if `top` and `bottom` do not have the same number of columns.
   *
   * ```
   * const top = MatrixBuilder.ones(2, 3);
   * const bottom = MatrixBuilder.zeros(1,3);
   *
   * MatrixBuilder.stack(top, bottom);
   *
   * // [ 1 1 1 ]
   * // [ 1 1 1 ]
   * // [ 0 0 0 ]
   * ```
   * @param {Matrix<number>} top
   * @param {Matrix<number>} bottom
   * @returns {Matrix<number>}
   */
  private static stack(top: Matrix<number>, bottom: Matrix<number>): Matrix<number> {
    if (top.getNumberOfColumns() !== bottom.getNumberOfColumns()) {
      throw Error('Dimension mismatch!');
    }

    const left = top.transpose();
    const right = bottom.transpose();
    return MatrixBuilder.augment(left, right).transpose();
  }

  /**
   * Returns a single matrix consisting of a grid of matrices combined together.
   * Throws an error if any of the dimensions are incompatible.
   *
   * ```
   * const upperLeft = MatrixBuilder.ones(1, 1);
   * const upperRight = MatrixBuilder.zeros(1, 2);
   * const lowerLeft = MatrixBuilder.zeros(2, 1);
   * const lowerRight = MatrixBuilder.ones(2, 2);
   *
   * const grid = [
   *   [ upperLeft, upperRight ],
   *   [ lowerLeft, lowerRight ]
   * ];
   *
   * MatrixBuilder.flatten(grid);
   *
   * // [ 1 0 0 ]
   * // [ 0 1 1 ]
   * // [ 0 1 1 ]
   * ```
   * @param {Array<Array<Matrix<number>>>} grid
   * @returns {Matrix<number>}
   */
  static flatten(grid: Array<Array<Matrix<number>>>): Matrix<number> {
    if (grid.length === 0 || grid[0].length === 0) {
      return MatrixBuilder.empty();
    }

    return grid
      .map(gridRow => {
        return gridRow.reduce((accumulator: Matrix<number>, gridEntry: Matrix<number>) => {
          return MatrixBuilder.augment(accumulator, gridEntry);
        });
      })
      .reduce((accumulator: Matrix<number>, row: Matrix<number>) => {
        return MatrixBuilder.stack(accumulator, row);
      });
  }

  /**
   * Returns a new matrix consisted of repetitions of a smaller matrix.
   *
   * ```
   * const I = MatrixBuilder.identity(2);
   * MatrixBuilder.repeat(I, 1, 2);
   *
   * // [ 1 0 1 0 ]
   * // [ 0 1 0 1 ]
   * ```
   * @param {Matrix<number>} matrix
   * @param {number} rows
   * @param {number} columns
   * @returns {Matrix<number>}
   */
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

  /**
   * Returns a new matrix based on a rectangular slice of a larger matrix
   *
   * ```
   * const matrix = MatrixBuilder.identity(4);
   * MatrixBuilder.slice(matrix, 2, 2, 3, 4);
   *
   * // [  1  0  0  0  ]
   * // [  0  1* 0* 0* ]  =>  [ 1 0 0 ]
   * // [  0  0* 1* 0* ]      [ 0 1 0 ]
   * // [  0  0  0  1  ]
   * ```
   *
   * @param {Matrix<number>} matrix  The original matrix
   * @param {number} rowStartIndex  The (inclusive) first row of the slice
   * @param {number} columnStartIndex  The (inclusive) first column of the slice
   * @param {number} rowEndIndex  The (exclusive) last row of the slice
   * @param {number} columnEndIndex  The (exclusive) last column of the slice
   * @returns {Matrix<number>}
   */
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

  /**
   * Returns a new matrix with all entries in row `rowToExclude` and in
   * column `columnToExclude` removed.
   *
   * ```
   * const I = MatrixBuilder.identity(4);
   * MatrixBuilder.slice(I, 1, 2)
   *
   * // [  1  0  0* 0  ]
   * // [  0* 1* 0* 0* ]  =>  [ 1 0 0 ]
   * // [  0  0  1* 0  ]      [ 0 0 0 ]
   * // [  0  0  0* 1  ]      [ 0 0 1 ]
   * ```
   * @param {Matrix<number>} matrix
   * @param {number} rowToExclude
   * @param {number} columnToExclude
   * @returns {Matrix<number>}
   */
  static exclude(
    matrix: Matrix<number>,
    rowToExclude: number,
    columnToExclude: number
  ): Matrix<number> {
    assertValidMatrixIndex(matrix, rowToExclude, columnToExclude);

    const data: MatrixData<number> = [];
    for (let i = 0; i < matrix.getNumberOfRows(); i++) {
      if (i < rowToExclude) {
        data[i] = [];
        for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
          if (j < columnToExclude) {
            data[i][j] = matrix.getEntry(i, j);
          } else if (j > columnToExclude) {
            data[i][j - 1] = matrix.getEntry(i, j);
          }
        }
      } else if (i > rowToExclude) {
        data[i - 1] = [];
        for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
          if (j < columnToExclude) {
            data[i - 1][j] = matrix.getEntry(i, j);
          } else if (j > columnToExclude) {
            data[i - 1][j - 1] = matrix.getEntry(i, j);
          }
        }
      }
    }

    return NumberMatrix.fromData(data);
  }
}
