import { Matrix, MatrixConstructor, MatrixData, Vector } from '..';
import { assertHomogeneous, assertValidMatrixIndex } from './ErrorAssertions';
import { ScalarOperations } from '../types/scalar/ScalarOperations';

export type MatrixIndexFunction<ScalarType> = (i: number, j: number) => ScalarType;
export type MatrixEntryFunction<ScalarType> = (
  entry: ScalarType,
  i: number,
  j: number
) => ScalarType;

export class MatrixBuilder<
  ScalarType,
  VectorType extends Vector<ScalarType>,
  MatrixType extends Matrix<ScalarType>
> {
  private readonly _matrixConstructor: MatrixConstructor<ScalarType, VectorType, MatrixType>;

  constructor(matrixConstructor: MatrixConstructor<ScalarType, VectorType, MatrixType>) {
    this._matrixConstructor = matrixConstructor;
  }

  private ops(): ScalarOperations<ScalarType> {
    return this._matrixConstructor.ops();
  }

  /**
   * Returns a 0x0 matrix
   *
   * ```
   * matrixBuilder.empty(); // []
   * ```
   */
  empty(): MatrixType {
    return new this._matrixConstructor([]);
  }

  fromData(data: MatrixData<ScalarType>): MatrixType {
    return new this._matrixConstructor(data);
  }

  fromIndexFunction(
    numRows: number,
    numColumns: number,
    indexFunction: MatrixIndexFunction<ScalarType>
  ) {
    const data: MatrixData<ScalarType> = [];
    for (let i = 0; i < numRows; i++) {
      data[i] = [];
      for (let j = 0; j < numColumns; j++) {
        data[i][j] = indexFunction(i, j);
      }
    }
    return new this._matrixConstructor(data);
  }

  map(matrix: Matrix<ScalarType>, entryFunction: MatrixEntryFunction<ScalarType>) {
    return this.fromIndexFunction(matrix.getNumberOfRows(), matrix.getNumberOfColumns(), (i, j) =>
      entryFunction(matrix.getEntry(i, j), i, j)
    );
  }

  fromColumnVectors(columns: Vector<ScalarType>[]): MatrixType {
    assertHomogeneous(columns);
    const numberOfColumns = columns.length;
    if (numberOfColumns === 0) {
      return this.empty();
    }
    const numberOfRows = columns[0].getDimension();
    if (numberOfRows === 0) {
      return this.empty();
    }

    return this.fromIndexFunction(numberOfRows, numberOfColumns, (i, j) => columns[j].getEntry(i));
  }

  fromRowVectors(rows: Vector<ScalarType>[]): MatrixType {
    assertHomogeneous(rows);
    const numberOfRows = rows.length;
    if (numberOfRows === 0) {
      return this.empty();
    }
    const numberOfColumns = rows[0].getDimension();
    if (numberOfColumns === 0) {
      return this.empty();
    }

    return this.fromIndexFunction(numberOfRows, numberOfColumns, (i, j) => rows[i].getEntry(j));
  }

  /**
   * Returns a matrix of the specified dimensions, consisting of all zeros
   *
   * ```
   * matrixBuilder.zeros(2, 3);
   *
   * // [ 0 0 0 ]
   * // [ 0 0 0 ]
   * ```
   * @param {number} numberOfRows
   * @param {number} numberOfColumns
   * @returns {MatrixType}
   */
  zeros(numberOfRows: number, numberOfColumns: number = numberOfRows): MatrixType {
    return this.fromIndexFunction(numberOfRows, numberOfColumns, () => this.ops().zero());
  }

  /**
   * Returns a matrix of the specified dimensions, consisting of all ones
   *
   * ```
   * matrixBuilder.ones(2, 3);
   *
   * // [ 1 1 1 ]
   * // [ 1 1 1 ]
   * ```
   * @param {number} numberOfRows
   * @param {number} numberOfColumns
   * @returns {MatrixType}
   */
  ones(numberOfRows: number, numberOfColumns: number = numberOfRows): MatrixType {
    return this.fromIndexFunction(numberOfRows, numberOfColumns, () => this.ops().one());
  }

  /**
   * Returns a `size` x `size` identity matrix
   *
   * ```
   * matrixBuilder.identity(3);
   *
   * // [ 1 0 0 ]
   * // [ 0 1 0 ]
   * // [ 0 0 1 ]
   * ```
   * @param {number} size
   * @returns {MatrixType}
   */
  identity(size: number): MatrixType {
    return this.fromIndexFunction(
      size,
      size,
      (i, j) => (i === j ? this.ops().one() : this.ops().zero())
    );
  }

  /**
   * Returns a square diagonal matrix whose diagonal entries come from `diagonalEntries`
   *
   * ```
   * const diagonalEntries = NumberVector.fromValues(1, 2, 3);
   * matrixBuilder.diagonal(diagonalEntries);
   *
   * // [ 1 0 0 ]
   * // [ 0 2 0 ]
   * // [ 0 0 3 ]
   * ```
   * @param {VectorType} diagonalEntries
   * @returns {MatrixType}
   */
  diagonal(diagonalEntries: VectorType): MatrixType {
    const size = diagonalEntries.getDimension();
    return this.fromIndexFunction(
      size,
      size,
      (i, j) => (i === j ? diagonalEntries.getEntry(i) : this.ops().zero())
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
   * matrixBuilder.tridiagonal(leftEntries, diagonalEntries, rightEntries);
   *
   * // [ 3 6 0 ]
   * // [ 1 4 7 ]
   * // [ 0 2 5 ]
   * ```
   *
   * @param {VectorType} leftEntries
   * @param {VectorType} diagonalEntries
   * @param {VectorType} rightEntries
   * @returns {MatrixType}
   */
  tridiagonal(
    leftEntries: Vector<ScalarType>,
    diagonalEntries: Vector<ScalarType>,
    rightEntries: Vector<ScalarType>
  ): MatrixType {
    const size = diagonalEntries.getDimension();
    const hasSizeMismatch =
      leftEntries.getDimension() !== size - 1 || rightEntries.getDimension() !== size - 1;

    if (hasSizeMismatch) {
      throw Error('');
    }

    return this.fromIndexFunction(size, size, (i, j) => {
      if (i === j) {
        return diagonalEntries.getEntry(i);
      } else if (i === j + 1) {
        return leftEntries.getEntry(j);
      } else if (i === j - 1) {
        return rightEntries.getEntry(i);
      } else {
        return this.ops().zero();
      }
    });
  }

  /**
   * Returns a new matrix consisting of `left` and `right` next to one another.
   * Throws an error of `left` and `right` do not have the same number of rows.
   *
   * ```
   * const left = matrixBuilder.ones(2, 3);
   * const right = matrixBuilder.zeros(2, 4);
   *
   * matrixBuilder.augment(left, right);
   *
   * // [ 1 1 1 0 0 0 0 ]
   * // [ 1 1 1 0 0 0 0 ]
   * ```
   * @param {MatrixType} left
   * @param {MatrixType} right
   * @returns {MatrixType}
   */
  augment(left: Matrix<ScalarType>, right: Matrix<ScalarType>): MatrixType {
    if (left.getNumberOfRows() !== right.getNumberOfRows()) {
      throw Error('Dimension mismatch!');
    }

    return this.fromColumnVectors([...left.getColumnVectors(), ...right.getColumnVectors()]);
  }

  /**
   * Returns a new matrix consisting of `top` and `bottom` on top of one another.
   * Throws an error if `top` and `bottom` do not have the same number of columns.
   *
   * ```
   * const top = matrixBuilder.ones(2, 3);
   * const bottom = matrixBuilder.zeros(1,3);
   *
   * matrixBuilder.stack(top, bottom);
   *
   * // [ 1 1 1 ]
   * // [ 1 1 1 ]
   * // [ 0 0 0 ]
   * ```
   * @param {MatrixType} top
   * @param {MatrixType} bottom
   * @returns {MatrixType}
   */
  private stack(top: Matrix<ScalarType>, bottom: Matrix<ScalarType>): MatrixType {
    if (top.getNumberOfColumns() !== bottom.getNumberOfColumns()) {
      throw Error('Dimension mismatch!');
    }

    return this.fromRowVectors([...top.getRowVectors(), ...bottom.getRowVectors()]);
  }

  /**
   * Returns a single matrix consisting of a grid of matrices combined together.
   * Throws an error if any of the dimensions are incompatible.
   *
   * ```
   * const upperLeft = matrixBuilder.ones(1, 1);
   * const upperRight = matrixBuilder.zeros(1, 2);
   * const lowerLeft = matrixBuilder.zeros(2, 1);
   * const lowerRight = matrixBuilder.ones(2, 2);
   *
   * const grid = [
   *   [ upperLeft, upperRight ],
   *   [ lowerLeft, lowerRight ]
   * ];
   *
   * matrixBuilder.flatten(grid);
   *
   * // [ 1 0 0 ]
   * // [ 0 1 1 ]
   * // [ 0 1 1 ]
   * ```
   * @param {Array<Array<MatrixType>>} grid
   * @returns {MatrixType}
   */
  flatten(grid: Array<Array<MatrixType>>): MatrixType {
    if (grid.length === 0 || grid[0].length === 0) {
      return this.empty();
    }

    return grid
      .map(gridRow => {
        return gridRow.reduce((accumulator: MatrixType, gridEntry: MatrixType) => {
          return this.augment(accumulator, gridEntry);
        });
      })
      .reduce((accumulator: MatrixType, row: MatrixType) => {
        return this.stack(accumulator, row);
      });
  }

  /**
   * Returns a new matrix consisted of repetitions of a smaller matrix.
   *
   * ```
   * const I = matrixBuilder.identity(2);
   * matrixBuilder.repeat(I, 1, 2);
   *
   * // [ 1 0 1 0 ]
   * // [ 0 1 0 1 ]
   * ```
   * @param {MatrixType} matrix
   * @param {number} rows
   * @param {number} columns
   * @returns {MatrixType}
   */
  repeat(matrix: MatrixType, rows: number, columns: number) {
    const grid: Array<Array<MatrixType>> = [];

    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i][j] = matrix;
      }
    }

    return this.flatten(grid);
  }

  /**
   * Returns a new matrix based on a rectangular slice of a larger matrix
   *
   * ```
   * const matrix = matrixBuilder.identity(4);
   * matrixBuilder.slice(matrix, 2, 2, 3, 4);
   *
   * // [  1  0  0  0  ]
   * // [  0  1* 0* 0* ]  =>  [ 1 0 0 ]
   * // [  0  0* 1* 0* ]      [ 0 1 0 ]
   * // [  0  0  0  1  ]
   * ```
   *
   * @param {MatrixType} matrix  The original matrix
   * @param {number} rowStartIndex  The (inclusive) first row of the slice
   * @param {number} columnStartIndex  The (inclusive) first column of the slice
   * @param {number} rowEndIndex  The (exclusive) last row of the slice
   * @param {number} columnEndIndex  The (exclusive) last column of the slice
   * @returns {MatrixType}
   */
  slice(
    matrix: Matrix<ScalarType>,
    rowStartIndex: number = 0,
    columnStartIndex: number = 0,
    rowEndIndex: number = matrix.getNumberOfRows(),
    columnEndIndex: number = matrix.getNumberOfColumns()
  ): MatrixType {
    if (rowStartIndex > rowEndIndex || columnStartIndex > columnEndIndex) {
      throw Error('start index must be less than end index');
    }

    if (rowStartIndex < 0 || columnStartIndex < 0) {
      throw Error('indices must be positive');
    }

    if (rowEndIndex > matrix.getNumberOfRows() || columnEndIndex > matrix.getNumberOfColumns()) {
      throw Error('index out of bounds');
    }

    const data: MatrixData<ScalarType> = [];
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

    return this.fromData(data);
  }

  /**
   * Returns a new matrix with all entries in row `rowToExclude` and in
   * column `columnToExclude` removed.
   *
   * ```
   * const I = matrixBuilder.identity(4);
   * matrixBuilder.slice(I, 1, 2)
   *
   * // [  1  0  0* 0  ]
   * // [  0* 1* 0* 0* ]  =>  [ 1 0 0 ]
   * // [  0  0  1* 0  ]      [ 0 0 0 ]
   * // [  0  0  0* 1  ]      [ 0 0 1 ]
   * ```
   * @param {MatrixType} matrix
   * @param {number} rowToExclude
   * @param {number} columnToExclude
   * @returns {MatrixType}
   */
  exclude(matrix: MatrixType, rowToExclude: number, columnToExclude: number): MatrixType {
    assertValidMatrixIndex(matrix, rowToExclude, columnToExclude);

    const data: MatrixData<ScalarType> = [];
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

    return this.fromData(data);
  }
}
