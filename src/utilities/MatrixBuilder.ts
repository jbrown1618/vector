import { Matrix, MatrixConstructor, MatrixData, Vector } from '..';
import { assertHomogeneous, assertValidMatrixIndex } from './ErrorAssertions';

export class MatrixBuilder<
  ScalarType,
  VectorType extends Vector<ScalarType>,
  MatrixType extends Matrix<ScalarType>
> {
  private readonly _matrixConstructor: MatrixConstructor<ScalarType, VectorType, MatrixType>;

  constructor(matrixConstructor: MatrixConstructor<ScalarType, VectorType, MatrixType>) {
    this._matrixConstructor = matrixConstructor;
  }

  /**
   * Returns a 0x0 matrix
   *
   * ```
   * MatrixBuilder.empty(); // []
   * ```
   */
  empty(): MatrixType {
    return new this._matrixConstructor([]);
  }

  fromData(data: MatrixData<ScalarType>): MatrixType {
    return new this._matrixConstructor(data);
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

    const data: MatrixData<ScalarType> = [];
    for (let i = 0; i < numberOfRows; i++) {
      data[i] = [];
      for (let j = 0; j < numberOfColumns; j++) {
        data[i][j] = columns[j].getEntry(i);
      }
    }
    return new this._matrixConstructor(data);
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

    const data: MatrixData<ScalarType> = [];
    for (let i = 0; i < numberOfRows; i++) {
      data[i] = [];
      for (let j = 0; j < numberOfColumns; j++) {
        data[i][j] = rows[i].getEntry(j);
      }
    }
    return new this._matrixConstructor(data);
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
   * @returns {MatrixType}
   */
  zeros(numberOfRows: number, numberOfColumns: number = numberOfRows): MatrixType {
    const columns: Array<Vector<ScalarType>> = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(this._matrixConstructor.vectorBuilder().zeros(numberOfRows));
    }
    return this.fromColumnVectors(columns);
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
   * @returns {MatrixType}
   */
  ones(numberOfRows: number, numberOfColumns: number = numberOfRows): MatrixType {
    const columns: Array<VectorType> = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(this._matrixConstructor.vectorBuilder().ones(numberOfRows));
    }
    return this.fromColumnVectors(columns);
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
   * @returns {MatrixType}
   */
  identity(size: number): MatrixType {
    const data: MatrixData<ScalarType> = [];
    const ops = this._matrixConstructor.ops();
    for (let i = 0; i < size; i++) {
      data[i] = [];
      for (let j = 0; j < size; j++) {
        data[i][j] = i === j ? ops.one() : ops.zero();
      }
    }
    return new this._matrixConstructor(data);
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
   * @param {VectorType} diagonalEntries
   * @returns {MatrixType}
   */
  diagonal(diagonalEntries: VectorType): MatrixType {
    const numEntries = diagonalEntries.getDimension();
    return this.fromColumnVectors(
      diagonalEntries.getData().map((entry, i) =>
        this._matrixConstructor
          .vectorBuilder()
          .elementaryVector(numEntries, i)
          .scalarMultiply(entry)
      )
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
    const numEntries = diagonalEntries.getDimension();
    if (
      leftEntries.getDimension() !== numEntries - 1 ||
      rightEntries.getDimension() !== numEntries - 1
    ) {
      throw Error('');
    }

    const getColumn = (diagonalEntry: ScalarType, i: number) => {
      return this._matrixConstructor.vectorBuilder().fromIndexFunction(index => {
        if (index === i) {
          return diagonalEntry;
        } else if (index === i - 1) {
          return leftEntries.getEntry(i - 1);
        } else if (index === i + 1) {
          return rightEntries.getEntry(i);
        }
        return this._matrixConstructor.ops().zero();
      }, numEntries);
    };

    return this.fromColumnVectors(diagonalEntries.getData().map(getColumn));
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
   * const top = MatrixBuilder.ones(2, 3);
   * const bottom = MatrixBuilder.zeros(1,3);
   *
   * MatrixBuilder.stack(top, bottom);
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
   * const I = MatrixBuilder.identity(2);
   * MatrixBuilder.repeat(I, 1, 2);
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
   * const matrix = MatrixBuilder.identity(4);
   * MatrixBuilder.slice(matrix, 2, 2, 3, 4);
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
   * const I = MatrixBuilder.identity(4);
   * MatrixBuilder.slice(I, 1, 2)
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
