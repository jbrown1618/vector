import { Matrix, MatrixData } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';

/**
 * Throws an error of the 2d array `data` is not rectangular - i.e. if
 * all of its rows do not have the same length
 */
export function assertRectangular<T>(data: MatrixData<T>, message?: string): void {
  message = message || `Expected arrays of uniform length; got ${data}`;
  if (data.length === 0) {
    return;
  }
  const rowSize = data[0].length;
  for (const row of data) {
    if (row.length !== rowSize) {
      throw Error(message);
    }
  }
}

/**
 * Throws an error if `matrix` is not square
 */
export function assertSquare<T>(matrix: Matrix<T>, message?: string): void {
  const rows = matrix.getNumberOfRows();
  const cols = matrix.getNumberOfColumns();
  message = message || `Expected a square matrix; got ${rows}x${cols}`;
  if (rows !== cols) {
    throw new Error(message);
  }
}

/**
 * Throws an error if any member of `vectors` has a different length
 * from any other member.
 */
export function assertHomogeneous<T>(vectors: Vector<T>[], message?: string): void {
  message = message || `Expected vectors all to have the same dimension; got ${vectors}`;
  if (vectors.length === 0) {
    return;
  }
  const size = vectors[0].getDimension();
  for (const vector of vectors) {
    if (vector.getDimension() !== size) {
      throw Error(message);
    }
  }
}

/**
 * Throws an error if empty
 */
export function assertNonEmpty<T>(values: T[], message?: string): void {
  message = message || `Expected a nonempty array; got []`;
  if (values.length > 0) {
    return;
  }
  throw Error(message);
}

/**
 * Throws an error if `dimension` is negative
 */
export function assertValidDimension(dimension: number, message?: string): void {
  message = message || `Expected dimension to be nonnegative; got ${dimension}`;
  if (dimension < 0) {
    throw Error(message);
  }
}

/**
 * Throws an error if `numberOfRows` or `numberOfColumns` is negative
 */
export function assertValidDimensions(numberOfRows: number, numberOfColumns: number): void {
  assertValidDimension(numberOfRows);
  assertValidDimension(numberOfColumns);
}

/**
 * Throws an error if `index` is not a valid identifier for an entry in `vector`
 */
export function assertValidVectorIndex<T>(
  vector: Vector<T>,
  index: number,
  message?: string
): void {
  assertValidIndex(index, vector.getDimension(), message);
}

/**
 * Throws an error if `(rowIndex, colIndex)` is not a valid identifier for an entry in `matrix`
 */
export function assertValidMatrixIndex<T>(
  matrix: Matrix<T>,
  rowIndex: number,
  colIndex: number,
  message?: string
): void {
  const rows = matrix.getNumberOfRows();
  const cols = matrix.getNumberOfColumns();
  message =
    message ||
    `Expected indices between (0, 0) and (${rows - 1}, ${cols -
      1}); got (${rowIndex}, ${colIndex})`;
  assertValidIndex(rowIndex, rows, message);
  assertValidIndex(colIndex, cols, message);
}

/**
 * Throws an error if `index` is not a valid index for an array-like object of length `size`
 */
export function assertValidIndex(index: number, size: number, message?: string): void {
  message = message || `Expected an index between 0 and ${size - 1}; got ${index}`;

  if (index < 0 || index >= size) {
    throw Error(message);
  }
}
