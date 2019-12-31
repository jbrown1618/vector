import {
  assertHomogeneous,
  assertSquare,
  assertValidMatrixIndex,
  assertValidShape
} from '../../utilities/ErrorAssertions';
import { binomial } from '../../utilities/NumberUtilities';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector } from '../vector/Vector';
import { Matrix, MatrixConstructor, MatrixShape, MatrixData } from './Matrix';
import { SparseMatrixData } from './SparseMatrix';

/**
 * A function that generates a matrix entry based on an existing entry `entry`,
 * its row index `i`, and its column index `j`
 *
 * @remarks
 * This should be a pure function
 *
 * @public
 */
export type MatrixEntryFunction<S> = (entry: S, i: number, j: number) => S;

/**
 * Provides methods for constructing {@link Matrix | Matrices} of a given type
 * @public
 */
export class MatrixBuilder<S, V extends Vector<S>, M extends Matrix<S>> {
  private readonly _matrixConstructor: MatrixConstructor<S, V, M>;

  /**
   * @internal
   */
  constructor(matrixConstructor: MatrixConstructor<S, V, M>) {
    this._matrixConstructor = matrixConstructor;
  }

  public fromArray(data: MatrixData<S>): M {
    return new this._matrixConstructor(data);
  }

  public fromNumberArray(numberData: MatrixData<number>): M {
    const ops = this.ops();
    const data = numberData.map(dataRow => dataRow.map(num => ops.fromNumber(num)));
    return this.fromArray(data);
  }

  public fromSparseData(shape: MatrixShape, sparseData: SparseMatrixData<S>): M {
    assertValidShape(shape);
    const [m, n] = shape;
    const data: S[][] = this.zeros([m, n]).toArray();
    sparseData.forEach((sparseRowData, rowIndex) => {
      sparseRowData.forEach((value, colIndex) => {
        data[rowIndex][colIndex] = value;
      });
    });
    return this.fromArray(data);
  }

  /**
   * Builds a matrix from an array of column vectors
   *
   * @example
   * ```
   * const firstColumn = vectorBuilder.fromArray([ 1, 2, 3 ]);
   * const secondColumn = vectorBuilder.fromArray([ 4, 5, 6 ]);
   *
   * const matrix = matrixBuilder.fromColumnVectors([ firstColumn, secondColumn ]);
   *
   * // [ 1 4 ]
   * // [ 2 5 ]
   * // [ 3 6 ]
   * ```
   * @param columns - The vectors to use as the columns of the new matrix
   * @public
   */
  public fromColumnVectors(columns: Vector<S>[]): M {
    assertHomogeneous(columns);
    const numberOfColumns = columns.length;
    if (numberOfColumns === 0) {
      return this.empty();
    }
    const numberOfRows = columns[0].getDimension();
    if (numberOfRows === 0) {
      return this.empty();
    }

    return this.fromIndexFunction([numberOfRows, numberOfColumns], (i, j) =>
      columns[j].getEntry(i)
    );
  }

  /**
   * Builds a matrix from an array of row vectors
   *
   * @example
   * ```
   * const firstRow = vectorBuilder.fromArray([ 1, 2, 3 ]);
   * const secondRow = vectorBuilder.fromArray([ 4, 5, 6 ]);
   *
   * const matrix = matrixBuilder.fromRowVectors([ firstRow, secondRow ]);
   *
   * // [ 1 2 3 ]
   * // [ 4 5 6 ]
   * ```
   *
   * @param rows - The vectors to use as the rows of the new matrix
   * @returns The new matrix
   * @public
   */
  public fromRowVectors(rows: Vector<S>[]): M {
    assertHomogeneous(rows);
    const numberOfRows = rows.length;
    if (numberOfRows === 0) {
      return this.empty();
    }
    const numberOfColumns = rows[0].getDimension();
    if (numberOfColumns === 0) {
      return this.empty();
    }

    return this.fromIndexFunction([numberOfRows, numberOfColumns], (i, j) => rows[i].getEntry(j));
  }

  /**
   * Builds a matrix with entries given by _entry = f(i, j)_ where _f_ is `indexFunction`
   * and `i` and `j` are the indices of the element
   *
   * @example
   * ```
   * const matrix = matrixBuilder.fromIndexFunction(3, 4, (i, j) => i + j + 3);
   *
   * // [ 3 4 5 6 ]
   * // [ 4 5 6 7 ]
   * // [ 5 6 7 8 ]
   * ```
   * @param shape - The shape of the matrix as a tuple
   * @param indexFunction - A function returning the entry for a given `i`, `j`
   * @returns The new matrix
   * @public
   */
  public fromIndexFunction(shape: MatrixShape, indexFunction: (i: number, j: number) => S): M {
    assertValidShape(shape);
    const [m, n] = shape;
    const data: S[][] = [];
    for (let i = 0; i < m; i++) {
      data[i] = [];
      for (let j = 0; j < n; j++) {
        data[i][j] = indexFunction(i, j);
      }
    }
    return new this._matrixConstructor(data);
  }

  /**
   * Constructs a 0x0 matrix
   *
   * @example
   * ```
   * matrixBuilder.empty(); // []
   * ```
   *
   * @public
   */
  public empty(): M {
    return new this._matrixConstructor([]);
  }

  /**
   * Constructs a matrix of the specified dimension, whose entries are all the specified value
   *
   * @example
   * ```
   * const allTwos = matrixBuilder.fill(2, 3, 4)
   *
   * // [ 2 2 2 2 ]
   * // [ 2 2 2 2 ]
   * // [ 2 2 2 2 ]
   * ```
   *
   * @param value - The value that should be used for every entry in the new matrix
   * @param shape - The shape of the matrix as a tuple
   * @returns The new matrix
   * @public
   */
  public fill(value: S, shape: MatrixShape): M {
    return this.fromIndexFunction(shape, () => value);
  }

  /**
   * Constructs a matrix of the specified dimensions, consisting of all zeros
   *
   * @example
   * ```
   * const allZeros = matrixBuilder.zeros([2, 3]);
   *
   * // [ 0 0 0 ]
   * // [ 0 0 0 ]
   * ```
   * @param shape - the shape of the matrix as a tuple
   * @returns The new matrix
   * @public
   */
  public zeros(shape: MatrixShape): M {
    return this.fill(this.ops().zero(), shape);
  }

  /**
   * Constructs a matrix of the specified dimensions, consisting of all ones
   *
   * @example
   * ```
   * const allOnes = matrixBuilder.ones(2, 3);
   *
   * // [ 1 1 1 ]
   * // [ 1 1 1 ]
   * ```
   * @param shape - the shape of the matrix as a tuple
   * @returns The new matrix
   * @public
   */
  public ones(shape: MatrixShape): M {
    return this.fill(this.ops().one(), shape);
  }

  /**
   * Constructs a `size` x `size` identity matrix
   *
   * @example
   * ```
   * const I3 = matrixBuilder.identity(3);
   *
   * // [ 1 0 0 ]
   * // [ 0 1 0 ]
   * // [ 0 0 1 ]
   * ```
   * @param size - The dimension of the vector space for which the new matrix is the identity
   * @returns The new matrix
   * @public
   */
  public identity(size: number): M {
    return this.fromIndexFunction([size, size], (i, j) =>
      i === j ? this.ops().one() : this.ops().zero()
    );
  }

  /**
   * Constructs a Hilbert matrix of the specified size
   *
   * @example
   * ```
   * const H = matrixBuilder.hilbert(3);
   *
   * // [  1   1/2  1/3 ]
   * // [ 1/2  1/3  1/4 ]
   * // [ 1/3  1/4  1/5 ]
   * ```
   *
   * @param size - The size of the Hilbert matrix
   * @public
   */
  public hilbert(size: number): M {
    return this.fromIndexFunction([size, size], (i, j) => {
      return this.ops().fromNumber(1 / (i + j + 1));
    });
  }

  /**
   * Constructs a Toeplitz matrix from the specified first column and first row.
   * A Toeplitz matrix has constant diagonals.  If `firstRow` is not given, then
   * the complex conjugate of `firstColumn` is assumed.  The first entry must be
   * real because the first entry of the first column must equal the first entry
   * of the first row.
   *
   * @example
   * ```
   * const toeplitz = matrixBuilder.toeplitz(vectorBuilder.fromArray([1, 2, 3]));
   *
   * // [ 1 2 3 ]
   * // [ 2 1 2 ]
   * // [ 3 2 1 ]
   *
   * const toeplitzWithSpecifiedRow = matrixBuilder.toeplitz(
   *   vectorBuilder.fromArray([1, 2, 3]),
   *   vectorBuilder.fromArray([1, 3, 5, 7])
   * );
   *
   * // [ 1 3 5 7 ]
   * // [ 2 1 3 5 ]
   * // [ 3 2 1 3 ]
   * ```
   *
   * @param firstColumn - The first column of the Toeplitz matrix
   * @param firstRow - The first row of the Toeplitz matrix
   * @public
   */
  public toeplitz(firstColumn: Vector<S>, firstRow?: Vector<S>): M {
    const ops = this.ops();
    firstRow = firstRow || firstColumn.map(value => ops.conjugate(value));

    if (firstRow.getDimension() === 0 || firstColumn.getDimension() === 0) {
      return this.empty();
    }

    if (!this.ops().equals(firstRow.getEntry(0), firstColumn.getEntry(0))) {
      throw Error(`The first entry of firstColumn must equal the first entry of firstRow`);
    }

    return this.fromIndexFunction([firstColumn.getDimension(), firstRow.getDimension()], (i, j) => {
      if (i >= j) {
        return firstColumn.getEntry(i - j);
      } else {
        // TODO - review on TSC upgrade - should never be undefined
        return (firstRow as Vector<S>).getEntry(j - i);
      }
    });
  }

  /**
   * Constructs a Hankel matrix from the specified first column and last row.
   * A Hankel matrix has constant anti-diagonals. If `lastRow` is not given,
   * then a vector with the last entry of the first row in the first entry and
   * zero elsewhere is assumed.  The last entry of the first column must equal
   * the first entry of the last row.
   *
   * @example
   * ```
   * const hankel = matrixBuilder.hankel(vectorBuilder.fromArray([2, 4, 6, 8]));
   *
   * // [ 2 4 6 8 ]
   * // [ 4 6 8 0 ]
   * // [ 6 8 0 0 ]
   * // [ 8 0 0 0 ]
   *
   * const hankelWithSpecifiedRow = matrixBuilder.hankel(
   *   vectorBuilder.fromArray([1, 2, 3, 4]),
   *   vectorBuilder.fromArray([4, 9, 9])
   * );
   *
   * // [ 1 2 3 ]
   * // [ 2 3 4 ]
   * // [ 3 4 9 ]
   * // [ 4 9 9 ]
   * ```
   *
   * @param firstColumn - The first column of the Hankel matrix
   * @param lastRow - The last row of the Hankel matrix
   * @public
   */
  public hankel(firstColumn: Vector<S>, lastRow?: Vector<S>): M {
    const numRows = firstColumn.getDimension();
    if (numRows === 0) {
      return this.empty();
    }

    lastRow =
      lastRow ||
      firstColumn
        .builder()
        .elementaryVector(numRows, 0)
        .scalarMultiply(firstColumn.getEntry(numRows - 1));
    const numColumns = lastRow.getDimension();

    if (
      numColumns === 0 ||
      !this.ops().equals(lastRow.getEntry(0), firstColumn.getEntry(numRows - 1))
    ) {
      throw Error(`The last entry of firstColumn must equal the first entry of lastRow`);
    }

    return this.fromIndexFunction([numRows, numColumns], (i, j) => {
      const index = i + j;
      if (index < numRows) {
        return firstColumn.getEntry(index);
      } else {
        // TODO - review on TSC upgrade - should never be undefined
        return (lastRow as Vector<S>).getEntry(index - numRows + 1);
      }
    });
  }

  /**
   * Constructs a lower-triangular matrix whose entries are the binomial coefficients (j choose i).
   * Constructs an upper triangular matrix when the second argument is `true`.
   *
   * @example
   * ```
   * const pascalLower = matrixBuilder.pascal(4);
   *
   * // [ 1 0 0 0 ]
   * // [ 1 1 0 0 ]
   * // [ 1 2 1 0 ]
   * // [ 1 3 3 1 ]
   *
   * const pascalUpper = matrixBuilder.pascal(4, true);
   *
   * // [ 1 1 1 1 ]
   * // [ 0 1 2 3 ]
   * // [ 0 0 1 3 ]
   * // [ 0 0 0 1 ]
   * ```
   *
   * @param size - The size of the Pascal matrix
   * @param upper - Construct an upper-triangular matrix (i choose j)
   * @public
   */
  public pascal(size: number, upper = false): M {
    return this.fromIndexFunction([size, size], (i, j) => {
      const entry = upper ? binomial(j, i) : binomial(i, j);
      return this.ops().fromNumber(entry);
    });
  }

  /**
   * Constructs a symmetric matrix whose entries are the binomial coefficients (i + j choose i)
   *
   * @example
   * ```
   * const pascalSymmetric = matrixBuilder.pascalSymmetric(4);
   *
   * // [ 1  1  1  1  ]
   * // [ 1  2  3  4  ]
   * // [ 1  3  6  10 ]
   * // [ 1  4  10 20 ]
   * ```
   *
   * @param size - The size of the Pascal matrix
   * @public
   */
  public pascalSymmetric(size: number): M {
    return this.fromIndexFunction([size, size], (i, j) => {
      return this.ops().fromNumber(binomial(i + j, i));
    });
  }

  /**
   * Construct a circulant matrix using entries from the input vector
   *
   * @example
   * ```
   * const circulant = matrixBuilder.circulant(vectorBuilder.fromArray([1, 2, 3]));
   *
   * // [ 1 3 2 ]
   * // [ 2 1 3 ]
   * // [ 3 2 1 ]
   * ```
   *
   * @param vector - The vector whose entries to use in the circulant matrix
   * @public
   */
  public circulant(vector: Vector<S>): M {
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
   * @param shape - The shape of the matrix as a tuple
   * @param min - The lower limit of the random numbers to include
   * @param max - The upper limit of the random numbers to include
   * @public
   */
  public random(shape: MatrixShape, min = 0, max = 1): M {
    if (min >= max) {
      throw Error(`Expected min < max; got ${min} and ${max}`);
    }
    return this.fromIndexFunction(shape, () => this.ops().random(min, max));
  }

  /**
   * Constructs a matrix of the specified size whose entries are normally distributed with the
   * specified mean and standard deviation.
   *
   * @param shape - The shape of the matrix as a tuple
   * @param mean - The center of the distribution of random numbers to include
   * @param standardDeviation - The standard deviation of the distribution of random numbers to include
   * @public
   */
  public randomNormal(shape: MatrixShape, mean = 0, standardDeviation = 1): M {
    if (standardDeviation <= 0) {
      throw Error(`Expected standardDeviation > 0; got ${standardDeviation}`);
    }
    return this.fromIndexFunction(shape, () => this.ops().randomNormal(mean, standardDeviation));
  }

  /**
   * Constructs a square diagonal matrix whose diagonal entries come from `diagonalEntries`
   *
   * @example
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
   * @public
   */
  public diagonal(diagonalEntries: Vector<S>): M {
    const size = diagonalEntries.getDimension();
    return this.fromIndexFunction([size, size], (i, j) =>
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
   * @example
   * ```
   * const leftEntries = NumberVector.fromEntries(1, 2);
   * const diagonalEntries = NumberVector.fromEntries(3, 4, 5);
   * const rightEntries = NumberVector.fromEntries(6, 7);
   *
   * const tridiagonal = matrixBuilder.tridiagonal(leftEntries, diagonalEntries, rightEntries);
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
   * @public
   */
  public tridiagonal(
    leftEntries: Vector<S>,
    diagonalEntries: Vector<S>,
    rightEntries: Vector<S>
  ): M {
    const size = diagonalEntries.getDimension();
    const hasSizeMismatch =
      leftEntries.getDimension() !== size - 1 || rightEntries.getDimension() !== size - 1;

    if (hasSizeMismatch) {
      throw Error('');
    }

    return this.fromIndexFunction([size, size], (i, j) => {
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
   * @example
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
   * @public
   */
  public blockDiagonal(matrices: Matrix<S>[]): M {
    matrices.forEach(matrix => assertSquare(matrix));

    const numberOfDiagonalMatrices = matrices.length;

    const grid: Matrix<S>[][] = matrices.map((matrix, index) => {
      const row: Matrix<S>[] = [];
      for (let i = 0; i < numberOfDiagonalMatrices; i++) {
        if (i === index) {
          row.push(matrix);
        } else {
          row.push(this.zeros([matrix.getNumberOfRows(), matrices[i].getNumberOfColumns()]));
        }
      }
      return row;
    });

    return this.block(grid);
  }

  /**
   * Constructs a single matrix consisting of a grid of matrices combined together.
   * Throws an error if any of the dimensions are incompatible.
   *
   * @example
   * ```
   * const upperLeft = matrixBuilder.ones(1, 1);
   * const upperRight = matrixBuilder.fill(2, 1, 2);
   * const lowerLeft = matrixBuilder.fill(3, 2, 1);
   * const lowerRight = matrixBuilder.fill(4, 2, 2);
   *
   * const grid = [
   *   [ upperLeft, upperRight ],
   *   [ lowerLeft, lowerRight ]
   * ];
   *
   * const block = matrixBuilder.block(grid);
   *
   * // [ 1 2 2 ]
   * // [ 3 4 4 ]
   * // [ 3 4 4 ]
   * ```
   * @param grid - A 2-dimensional array of matrices that will be combined into the new matrix
   * @returns The new matrix
   * @public
   */
  public block(grid: Matrix<S>[][]): M {
    if (grid.length === 0 || grid[0].length === 0) {
      return this.empty();
    }

    const data = grid
      .map(gridRow => {
        return gridRow.reduce((accumulator: Matrix<S>, gridEntry: Matrix<S>) => {
          return this.augment(accumulator, gridEntry);
        });
      })
      .reduce((accumulator: Matrix<S>, row: Matrix<S>) => {
        return this.stack(accumulator, row);
      })
      .toArray();

    return this.fromArray(data);
  }

  /**
   * Constructs a new matrix consisting of `left` and `right` next to one another.
   * Throws an error of `left` and `right` do not have the same number of rows.
   *
   * @example
   * ```
   * const left = matrixBuilder.ones(2);
   * const right = matrixBuilder.zeros(2, 3);
   *
   * matrixBuilder.augment(left, right);
   *
   * // [ 1 1 0 0 0 ]
   * // [ 1 1 0 0 0 ]
   * ```
   * @param left - The matrix that will form the left-side of the augmented matrix
   * @param right - The matrix that will form the right-side of the augmented matrix
   * @returns The new augmented matrix
   * @public
   */
  public augment(left: Matrix<S>, right: Matrix<S>): M {
    if (left.getNumberOfRows() !== right.getNumberOfRows()) {
      throw Error('Dimension mismatch!');
    }

    return this.fromColumnVectors([...left.getColumnVectors(), ...right.getColumnVectors()]);
  }

  /**
   * Constructs a new matrix consisted of repetitions of a smaller matrix.
   *
   * @example
   * ```
   * const I = matrixBuilder.identity(2);
   * const repeated = matrixBuilder.repeat(I, 1, 2);
   *
   * // [ 1 0 1 0 ]
   * // [ 0 1 0 1 ]
   * ```
   * @param matrix - The matrix to be repeated
   * @param rows - The number of times to repeat the matrix vertically
   * @param columns - The number of times to repeat the matrix horizontally
   * @returns The new matrix
   * @public
   */
  public repeat(matrix: Matrix<S>, rows: number, columns: number): M {
    const grid: Matrix<S>[][] = [];

    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i][j] = matrix;
      }
    }

    return this.block(grid);
  }

  /**
   * Constructs a new matrix based on a rectangular slice of a larger matrix
   *
   * @example
   * ```
   * const matrix = matrixBuilder.identity(4);
   * const slice = matrixBuilder.slice(matrix, 2, 2, 3, 4);
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
   * @public
   */
  public slice(
    matrix: Matrix<S>,
    rowStartIndex = 0,
    columnStartIndex = 0,
    rowEndIndex: number = matrix.getNumberOfRows(),
    columnEndIndex: number = matrix.getNumberOfColumns()
  ): M {
    if (rowStartIndex < 0 || columnStartIndex < 0 || rowEndIndex < 0 || columnEndIndex < 0) {
      throw Error('indices must be positive');
    }

    const [m, n] = matrix.getShape();
    if (rowStartIndex > m || rowEndIndex > m || columnStartIndex > n || columnEndIndex > n) {
      throw Error('index out of bounds');
    }

    if (rowStartIndex > rowEndIndex || columnStartIndex > columnEndIndex) {
      throw Error('start index must be less than end index');
    }

    const data: S[][] = [];
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

    return this.fromArray(data);
  }

  /**
   * Constructs a new matrix with all entries in row `rowToExclude` and in
   * column `columnToExclude` removed.
   *
   * @example
   * ```
   * const I = matrixBuilder.identity(4);
   * const excluded = matrixBuilder.slice(I, 1, 2)
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
   * @public
   */
  public exclude(matrix: Matrix<S>, rowToExclude: number, columnToExclude: number): M {
    assertValidMatrixIndex(matrix, rowToExclude, columnToExclude);

    const data: S[][] = [];
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

    return this.fromArray(data);
  }

  private ops(): ScalarOperations<S> {
    return this._matrixConstructor.ops();
  }

  /**
   * Constructs a new matrix consisting of `top` and `bottom` on top of one another.
   * Throws an error if `top` and `bottom` do not have the same number of columns.
   *
   * @example
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
   * @public
   */
  private stack(top: Matrix<S>, bottom: Matrix<S>): M {
    if (top.getNumberOfColumns() !== bottom.getNumberOfColumns()) {
      throw Error('Dimension mismatch!');
    }

    return this.fromRowVectors([...top.getRowVectors(), ...bottom.getRowVectors()]);
  }
}
