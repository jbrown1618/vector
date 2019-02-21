import {
  assertHomogeneous,
  assertSquare,
  assertValidDimensions,
  assertValidMatrixIndex
} from '../../utilities/ErrorAssertions';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector } from '../vector/Vector';
import { Matrix, MatrixConstructor, MatrixData } from './Matrix';

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

  public fromData(data: MatrixData<ScalarType>): MatrixType {
    return new this._matrixConstructor(data);
  }

  /**
   * Builds a matrix from an array of column vectors
   *
   * ```
   * const firstColumn = vectorBuilder.fromData([ 1, 2, 3 ]);
   * const secondColumn = vectorBuilder.fromData([ 4, 5, 6 ]);
   *
   * const matrix = matrixBuilder.fromColumnVectors([ firstColumn, secondColumn ]);
   * // [ 1 4 ]
   * // [ 2 5 ]
   * // [ 3 6 ]
   * ```
   * @param columns - The vectors to use as the columns of the new matrix
   */
  public fromColumnVectors(columns: Array<Vector<ScalarType>>): MatrixType {
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

  /**
   * Builds a matrix from an array of row vectors
   *
   * ```
   * const firstRow = vectorBuilder.fromData([ 1, 2, 3 ]);
   * const secondRow = vectorBuilder.fromData([ 4, 5, 6 ]);
   *
   * const matrix = matrixBuilder.fromRowVectors([ firstRow, secondRow ]);
   * // [ 1 2 3 ]
   * // [ 4 5 6 ]
   * ```
   *
   * @param rows - The vectors to use as the rows of the new matrix
   * @returns The new matrix
   */
  public fromRowVectors(rows: Array<Vector<ScalarType>>): MatrixType {
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
   * Builds a matrix with entries given by _entry = f(i, j)_ where _f_ is `indexFunction`
   * and `i` and `j` are the indices of the element
   *
   * ```
   * matrixBuilder.fromIndexFunction(3, 4, (i, j) => i + j + 3);
   * // [ 3 4 5 6 ]
   * // [ 4 5 6 7 ]
   * // [ 5 6 7 8 ]
   * ```
   * @param numRows - The number of columns the new matrix should have
   * @param numColumns - The number of columns the new matrix should have
   * @param indexFunction - A function returning the entry for a given `i`, `j`
   * @returns The new matrix
   */
  public fromIndexFunction(
    numRows: number,
    numColumns: number,
    indexFunction: MatrixIndexFunction<ScalarType>
  ): MatrixType {
    assertValidDimensions(numRows, numColumns);
    const data: MatrixData<ScalarType> = [];
    for (let i = 0; i < numRows; i++) {
      data[i] = [];
      for (let j = 0; j < numColumns; j++) {
        data[i][j] = indexFunction(i, j);
      }
    }
    return new this._matrixConstructor(data);
  }

  /**
   * Builds a matrix by transforming the values of another matrix.
   *
   * ```
   * const original = matrixBuilder.fromData([
   *   [ 1, 2, 3 ]
   *   [ 4, 5, 6 ]
   * ]);
   *
   * const originalPlusOne = matrixBuilder.map(original, (value) => value + 1);
   * // [ 2 3 4 ]
   * // [ 5 6 7 ]
   *
   * const originalPlusIMinusJ = vectorBuilder.map(original, (value, i, j) => value + i - j);
   * // [ 1 1 1 ]
   * // [ 5 5 5 ]
   * ```
   * @param matrix - The matrix on whose entries to base the entries of the new matrix
   * @param entryFunction - A function which takes an entry of
   *     the original matrix and its indices, and returns the corresponding entry of the new matrix
   * @returns The new matrix
   */
  public map(
    matrix: Matrix<ScalarType>,
    entryFunction: MatrixEntryFunction<ScalarType>
  ): MatrixType {
    return this.fromIndexFunction(matrix.getNumberOfRows(), matrix.getNumberOfColumns(), (i, j) =>
      entryFunction(matrix.getEntry(i, j), i, j)
    );
  }

  /**
   * Constructs a 0x0 matrix
   *
   * ```
   * matrixBuilder.empty(); // []
   * ```
   */
  public empty(): MatrixType {
    return new this._matrixConstructor([]);
  }

  /**
   * Constructs a matrix of the specified dimension, whose entries are all the specified value
   *
   * ```
   * matrixBuilder.fill(2, 3, 4)
   *
   * // [ 2 2 2 2 ]
   * // [ 2 2 2 2 ]
   * // [ 2 2 2 2 ]
   * ```
   *
   * @param value - The value that should be used for every entry in the new matrix
   * @param numberOfRows - The number of rows the new matrix should have
   * @param numberOfColumns - The number of columns the new matrix should have
   * @returns The new matrix
   */
  public fill(
    value: ScalarType,
    numberOfRows: number,
    numberOfColumns: number = numberOfRows
  ): MatrixType {
    return this.fromIndexFunction(numberOfRows, numberOfColumns, () => value);
  }

  /**
   * Constructs a matrix of the specified dimensions, consisting of all zeros
   *
   * ```
   * matrixBuilder.zeros(2, 3);
   *
   * // [ 0 0 0 ]
   * // [ 0 0 0 ]
   * ```
   * @param numberOfRows - The number of rows the new matrix should have
   * @param numberOfColumns - The number of columns the new matrix should have
   * @returns The new matrix
   */
  public zeros(numberOfRows: number, numberOfColumns: number = numberOfRows): MatrixType {
    return this.fill(this.ops().zero(), numberOfRows, numberOfColumns);
  }

  /**
   * Constructs a matrix of the specified dimensions, consisting of all ones
   *
   * ```
   * matrixBuilder.ones(2, 3);
   *
   * // [ 1 1 1 ]
   * // [ 1 1 1 ]
   * ```
   * @param numberOfRows - The number of rows the new matrix should have
   * @param numberOfColumns - The number of columns the new matrix should have
   * @returns The new matrix
   */
  public ones(numberOfRows: number, numberOfColumns: number = numberOfRows): MatrixType {
    return this.fill(this.ops().one(), numberOfRows, numberOfColumns);
  }

  /**
   * Constructs a `size` x `size` identity matrix
   *
   * ```
   * matrixBuilder.identity(3);
   *
   * // [ 1 0 0 ]
   * // [ 0 1 0 ]
   * // [ 0 0 1 ]
   * ```
   * @param size - The dimension of the vector space for which the new matrix is the identity
   * @returns The new matrix
   */
  public identity(size: number): MatrixType {
    return this.fromIndexFunction(size, size, (i, j) =>
      i === j ? this.ops().one() : this.ops().zero()
    );
  }

  /**
   * Constructs a Hilbert matrix of the specified size
   *
   * ```
   * matrixBuilder.hilbert(3);
   * [  1   1/2  1/3 ]
   * [ 1/2  1/3  1/4 ]
   * [ 1/3  1/4  1/5 ]
   * ```
   *
   * @param size - The size of the Hilbert matrix
   */
  public hilbert(size: number): MatrixType {
    return this.fromIndexFunction(size, size, (i, j) => {
      return this.ops().fromNumber(1 / (i + j + 1));
    });
  }

  /**
   * Constructs a Hankel matrix from the specified first column and last row.
   * A Hankel matrix has constant anti-diagonals. If `lastRow` is not given,
   * then a vector with the last entry of the first row in the first entry and
   * zero elsewhere is assumed.  The last entry of the first column must equal
   * the first entry of the last row.
   *
   * ```
   * matrixBuilder.hankel(vectorBuilder.fromData([2, 4, 6, 8]));
   * // [ 2 4 6 8 ]
   * // [ 4 6 8 0 ]
   * // [ 6 8 0 0 ]
   * // [ 8 0 0 0 ]
   *
   * matrixBuilder.hankel(
   *   vectorBuilder.fromData([1, 2, 3, 4]),
   *   vectorBuilder.fromData([4, 9, 9])
   * );
   * // [ 1 2 3 ]
   * // [ 2 3 4 ]
   * // [ 3 4 9 ]
   * // [ 4 9 9 ]
   * ```
   *
   * @param firstColumn - The first column of the Hankel matrix
   * @param lastRow - The last row of the Hankel matrix
   */
  public hankel(firstColumn: Vector<ScalarType>, lastRow?: Vector<ScalarType>) {
    const numRows = firstColumn.getDimension();
    lastRow =
      lastRow ||
      firstColumn
        .builder()
        .elementaryVector(numRows, 0)
        .scalarMultiply(firstColumn.getEntry(numRows - 1));
    const numColumns = lastRow.getDimension();

    if (!this.ops().equals(lastRow.getEntry(0), firstColumn.getEntry(numRows - 1))) {
      throw Error('TODO - last entry of first column must equal first entry of last row');
    }

    return this.fromIndexFunction(numRows, numColumns, (i, j) => {
      const index = i + j;
      if (index < numRows) {
        return firstColumn.getEntry(index);
      } else {
        // TODO - review on TSC upgrade - should never be undefined
        return (lastRow as Vector<ScalarType>).getEntry(index - numRows + 1);
      }
    });
  }

  /**
   * Construct a circulant matrix using entries from the input vector
   *
   * ```
   * const circulant = matrixBuilder.circulant(vectorBuilder.fromData([1, 2, 3]));
   *
   * // [ 1 3 2 ]
   * // [ 2 1 3 ]
   * // [ 3 2 1 ]
   * ```
   *
   * @param vector - The vector whose entries to use in the circulant matrix
   */
  public circulant(vector: Vector<ScalarType>): MatrixType {
    const vb = this._matrixConstructor.vectorBuilder();
    const columns = [vector];
    for (let offset = 1; offset < vector.getDimension(); offset++) {
      columns.push(vb.shift(vector, offset, true));
    }
    return this.fromColumnVectors(columns);
  }

  /**
   * Constructs a matrix of the specified size whose entries are (uniformly-distributed) random
   * numbers between `min` and `max`
   *
   * @param numberOfRows - The number of rows the new matrix should have
   * @param numberOfColumns - The number of columns the new matrix should have
   * @param min - The lower limit of the random numbers to include
   * @param max - The upper limit of the random numbers to include
   */
  public random(
    numberOfRows: number,
    numberOfColumns: number = numberOfRows,
    min: number = 0,
    max: number = 1
  ): MatrixType {
    if (min >= max) {
      throw Error('TODO - message');
    }
    return this.fromIndexFunction(numberOfRows, numberOfColumns, () => this.ops().random(min, max));
  }

  /**
   * Constructs a matrix of the specified size whose entries are normally distributed with the
   * specified mean and standard deviation.
   *
   * @param numberOfRows - The number of rows the new matrix should have
   * @param numberOfColumns - The number of columns the new matrix should have
   * @param mean - The center of the distribution of random numbers to include
   * @param standardDeviation - The standard deviation of the distribution of random numbers to include
   */
  public randomNormal(
    numberOfRows: number,
    numberOfColumns: number = numberOfRows,
    mean: number = 0,
    standardDeviation: number = 1
  ): MatrixType {
    if (standardDeviation <= 0) {
      throw Error('TODO - message');
    }
    return this.fromIndexFunction(numberOfRows, numberOfColumns, () =>
      this.ops().randomNormal(mean, standardDeviation)
    );
  }

  /**
   * Constructs a square diagonal matrix whose diagonal entries come from `diagonalEntries`
   *
   * ```
   * const diagonalEntries = NumberVector.fromValues(1, 2, 3);
   * matrixBuilder.diagonal(diagonalEntries);
   *
   * // [ 1 0 0 ]
   * // [ 0 2 0 ]
   * // [ 0 0 3 ]
   * ```
   * @param diagonalEntries - A vector whose entries will be used as the diagonal entries of the new matrix
   * @returns The new matrix
   */
  public diagonal(diagonalEntries: VectorType): MatrixType {
    const size = diagonalEntries.getDimension();
    return this.fromIndexFunction(size, size, (i, j) =>
      i === j ? diagonalEntries.getEntry(i) : this.ops().zero()
    );
  }

  /**
   * Constructs a square tridiagonal matrix whose diagonal entries correspond to the entries of
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
   * @param leftEntries - A vector whose entries will be used in the left off-diagonal
   * @param diagonalEntries - A vector whose entries will be used in the diagonal
   * @param rightEntries - A vector whose entries will be used in the right off-diagonal
   * @returns The new matrix
   */
  public tridiagonal(
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
   * Creates a block-diagonal matrix.
   *
   * ```
   * const ones = matrixBuilder.ones(2);
   * const twos = matrixBuilder.fill(2, 3);
   *
   * const blockDiagonal = matrixBuilder.blockDiagonal([ones, twos, ones]);
   *
   * // [ 1 1 0 0 0 0 0 ]
   * // [ 1 1 0 0 0 0 0 ]
   * // [ 0 0 2 2 2 0 0 ]
   * // [ 0 0 2 2 2 0 0 ]
   * // [ 0 0 2 2 2 0 0 ]
   * // [ 0 0 0 0 0 1 1 ]
   * // [ 0 0 0 0 0 1 1 ]
   * ```
   *
   * @param matrices - The matrices to appear along the primary diagonal of the block matrix
   */
  public blockDiagonal(matrices: Array<Matrix<ScalarType>>): MatrixType {
    matrices.forEach(matrix => assertSquare(matrix));

    const numberOfDiagonalMatrices = matrices.length;

    const grid: Array<Array<Matrix<ScalarType>>> = matrices.map((matrix, index) => {
      const row: Array<Matrix<ScalarType>> = [];
      for (let i = 0; i < numberOfDiagonalMatrices; i++) {
        if (i === index) {
          row.push(matrix);
        } else {
          row.push(this.zeros(matrix.getNumberOfRows(), matrices[i].getNumberOfColumns()));
        }
      }
      return row;
    });

    return this.flatten(grid);
  }

  /**
   * Constructs a new matrix consisting of `left` and `right` next to one another.
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
   * @param left - The matrix that will form the left-side of the augmented matrix
   * @param right - The matrix that will form the right-side of the augmented matrix
   * @returns The new augmented matrix
   */
  public augment(left: Matrix<ScalarType>, right: Matrix<ScalarType>): MatrixType {
    if (left.getNumberOfRows() !== right.getNumberOfRows()) {
      throw Error('Dimension mismatch!');
    }

    return this.fromColumnVectors([...left.getColumnVectors(), ...right.getColumnVectors()]);
  }

  /**
   * Constructs a single matrix consisting of a grid of matrices combined together.
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
   * @param grid - A 2-dimensional array of matrices that will be combined into the new matrix
   * @returns The new matrix
   */
  public flatten(grid: Array<Array<Matrix<ScalarType>>>): MatrixType {
    if (grid.length === 0 || grid[0].length === 0) {
      return this.empty();
    }

    const data = grid
      .map(gridRow => {
        return gridRow.reduce((accumulator: Matrix<ScalarType>, gridEntry: Matrix<ScalarType>) => {
          return this.augment(accumulator, gridEntry);
        });
      })
      .reduce((accumulator: Matrix<ScalarType>, row: Matrix<ScalarType>) => {
        return this.stack(accumulator, row);
      })
      .getData();

    return this.fromData(data);
  }

  /**
   * Constructs a new matrix consisted of repetitions of a smaller matrix.
   *
   * ```
   * const I = matrixBuilder.identity(2);
   * matrixBuilder.repeat(I, 1, 2);
   *
   * // [ 1 0 1 0 ]
   * // [ 0 1 0 1 ]
   * ```
   * @param matrix - The matrix to be repeated
   * @param rows - The number of times to repeat the matrix vertically
   * @param columns - The number of times to repeat the matrix horizontally
   * @returns The new matrix
   */
  public repeat(matrix: MatrixType, rows: number, columns: number): MatrixType {
    const grid: MatrixType[][] = [];

    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i][j] = matrix;
      }
    }

    return this.flatten(grid);
  }

  /**
   * Constructs a new matrix based on a rectangular slice of a larger matrix
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
   * @param matrix - The original matrix
   * @param rowStartIndex - The (inclusive) first row of the slice
   * @param columnStartIndex - The (inclusive) first column of the slice
   * @param rowEndIndex - The (exclusive) last row of the slice
   * @param columnEndIndex - The (exclusive) last column of the slice
   * @returns The new matrix
   */
  public slice(
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
   * Constructs a new matrix with all entries in row `rowToExclude` and in
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
   * @param matrix - The input matrix
   * @param rowToExclude - The index of the row that will be removed
   * @param columnToExclude - The index of the column that will be removed
   * @returns The new matrix
   */
  public exclude(matrix: MatrixType, rowToExclude: number, columnToExclude: number): MatrixType {
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

  private ops(): ScalarOperations<ScalarType> {
    return this._matrixConstructor.ops();
  }

  /**
   * Constructs a new matrix consisting of `top` and `bottom` on top of one another.
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
   * @param top - The matrix that will be used for the top half of the new matrix
   * @param bottom - The matrix that will be used for the bottom half of the new matrix
   * @returns The new matrix
   */
  private stack(top: Matrix<ScalarType>, bottom: Matrix<ScalarType>): MatrixType {
    if (top.getNumberOfColumns() !== bottom.getNumberOfColumns()) {
      throw Error('Dimension mismatch!');
    }

    return this.fromRowVectors([...top.getRowVectors(), ...bottom.getRowVectors()]);
  }
}
