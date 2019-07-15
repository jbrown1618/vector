import { Matrix, MatrixData } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';

/**
 * Throws an error of the 2d array `data` is not square - i.e. if
 * all of its rows do not have the same length
 */
export function assertRectangular<T>(data: MatrixData<T>): void {
  if (data.length === 0) {
    return;
  }
  const rowSize = data[0].length;
  for (const row of data) {
    if (row.length !== rowSize) {
      throw Error('TODO - message');
    }
  }
}

/**
 * Throws an error if `matrix` is not square
 */
export function assertSquare<T>(matrix: Matrix<T>): void {
  if (matrix.getNumberOfColumns() !== matrix.getNumberOfRows()) {
    throw new Error('TODO - message');
  }
}

/**
 * Throws an error if any member of `vectors` has a different length
 * from any other member.
 */
export function assertHomogeneous<T>(vectors: Vector<T>[]): void {
  if (vectors.length === 0) {
    return;
  }
  const size = vectors[0].getDimension();
  for (const vector of vectors) {
    if (vector.getDimension() !== size) {
      throw Error('TODO - message');
    }
  }
}

/**
 * Throws an error if empty
 */
export function assertNonEmpty<T>(values: T[]): void {
  if (values.length > 0) {
    return;
  }
  throw Error('TODO - message');
}

/**
 * Throws an error if `dimension` is negative
 */
export function assertValidDimension(dimension: number): void {
  if (dimension < 0) {
    throw Error('TODO - message');
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
export function assertValidVectorIndex<T>(vector: Vector<T>, index: number): void {
  assertValidIndex(index, vector.getDimension());
}

/**
 * Throws an error if `(rowIndex, colIndex)` is not a valid identifier for an entry in `matrix`
 */
export function assertValidMatrixIndex<T>(
  matrix: Matrix<T>,
  rowIndex: number,
  colIndex: number
): void {
  assertValidIndex(rowIndex, matrix.getNumberOfRows());
  assertValidIndex(colIndex, matrix.getNumberOfColumns());
}

/**
 * Throws an error if `index` is not a valid index for an array-like object of length `size`
 */
export function assertValidIndex(index: number, size: number): void {
  if (index < 0 || index >= size) {
    throw Error('TODO - message');
  }
}
