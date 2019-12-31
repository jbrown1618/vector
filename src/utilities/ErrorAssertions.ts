import { Matrix, MatrixData, MatrixShape } from '../types/matrix/Matrix';
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
  const [rows, cols] = matrix.getShape();
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
  message =
    message ||
    `Expected vectors all to have the same dimension; got ${vectors.map(v => v.getDimension())}`;
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

export function assertMultiplicable(
  first: Matrix<any>,
  second: Matrix<any>,
  message?: string
): void {
  message =
    message ||
    `Dimension mismatch: expected dimensions compatible with matrix multiplication; got ${shape(
      first
    )} and ${shape(second)}`;
  if (first.getNumberOfColumns() !== second.getNumberOfRows()) {
    throw Error(message);
  }
}

/**
 * Throws an error if either dimension is negative, or if only one dimension is nonzero.
 */
export function assertValidShape(shape: MatrixShape, message?: string): void {
  const [m, n] = shape;
  message = message || `Expected valid matrix dimensions; got ${m}x${n}`;
  assertValidDimension(m, message);
  assertValidDimension(n, message);
  if ((m !== 0 && n === 0) || (m === 0 && n !== 0)) {
    throw Error(message);
  }
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
  const [rows, cols] = matrix.getShape();
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

export function assertDimensionMatch(
  first: Matrix<any>,
  second: Matrix<any>,
  message?: string
): void {
  const [m1, n1] = first.getShape();
  const [m2, n2] = second.getShape();
  message = message || `Expected matching dimensions; got ${shape(first)} and ${shape(second)}`;
  if (m1 !== m2 || n1 !== n2) {
    throw Error(message);
  }
}

function shape(matrix: Matrix<any>): string {
  const [m, n] = matrix.getShape();
  return `(${m}x${n})`;
}
