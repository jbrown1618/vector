import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { assertSquare } from '../utilities/ErrorAssertions';
import { LinearSolution } from '../solvers/LinearSolution';
import { RowOperations } from './RowOperations';
import { backwardSubstituteAugmentedMatrix } from '../solvers/Substitution';

/**
 * Uses Gauss-Jordan elimination with pivoting and backward substitution
 * to solve the linear equation _Ax=b_
 *
 * @param A - The matrix _A_ in _Ax=b_
 * @param b - The vector _b_ in _Ax=b_
 * @returns The vector _x_ in _Ax=b_
 * @public
 */
export function solveByGaussianElimination<S>(A: Matrix<S>, b: Vector<S>): LinearSolution<S> {
  const augmented = A.builder().augment(A, A.builder().fromColumnVectors([b]));
  const ref = rowEchelonForm(augmented);
  return backwardSubstituteAugmentedMatrix(ref);
}

/**
 * Uses Gauss-Jordan elimination with pivoting to calculate the inverse of a matrix.
 *
 * @remarks
 * Throws an error if the matrix is not square.
 * Returns `undefined` if the matrix is not invertible.
 *
 * @param matrix - A square matrix
 * @returns The inverse matrix
 * @public
 */
export function inverse<S>(matrix: Matrix<S>): Matrix<S> | undefined {
  assertSquare(matrix);
  const dim = matrix.getNumberOfRows();
  const I = matrix.builder().identity(dim);

  const augmented = matrix.builder().augment(matrix, I);
  const rref = reducedRowEchelonForm(augmented);

  const left = matrix.builder().slice(rref, 0, 0, dim, dim);
  const right = matrix.builder().slice(rref, 0, dim);

  if (left.equals(I)) {
    return right;
  } else {
    // Not invertible
    return undefined;
  }
}

/**
 * Calculates the rank of a matrix
 *
 * @remarks
 * The rank of a matrix A is the dimension of the vector space spanned by the columns of A.
 * Equivalently, it is the number of pivot entries in the row-echelon form of A, or the number
 * of nonzero rows in the row echelon form of A.
 *
 * @param matrix - the matrix for which to determine the rank
 * @public
 */
export function rank<S>(matrix: Matrix<S>): number {
  const zeroRow = matrix.vectorBuilder().zeros(matrix.getNumberOfColumns());
  const ref = rowEchelonForm(matrix);
  const nonZeroRows = ref.getRowVectors().filter(v => !v.equals(zeroRow));
  return nonZeroRows.length;
}

/**
 * Uses Gauss-Jordan elimination with pivoting to convert a matrix to Reduced Row-Echelon Form (RREF)
 *
 * @param matrix - The input matrix
 * @returns The matrix in RREF
 * @public
 */
export function reducedRowEchelonForm<S>(matrix: Matrix<S>): Matrix<S> {
  const ops = matrix.ops();
  matrix = rowEchelonForm(matrix);
  const [m, n] = matrix.getShape();

  // Scale the rows
  for (let rowIndex = 0; rowIndex < m; rowIndex++) {
    let firstNonzeroEntry: S | undefined = undefined;
    for (const entry of matrix.getRow(rowIndex).toArray()) {
      if (!ops.equals(ops.zero(), entry)) {
        firstNonzeroEntry = entry;
        break;
      }
    }
    if (firstNonzeroEntry) {
      const inverse = ops.getMultiplicativeInverse(firstNonzeroEntry) as S;
      matrix = RowOperations.multiplyRowByScalar(matrix, rowIndex, inverse);
    }
  }

  // Clear above the pivot entries
  const maxNumberOfPivotEntries = Math.min(m, n);
  for (let pivotRow = maxNumberOfPivotEntries - 1; pivotRow >= 0; pivotRow--) {
    const pivotColumn = matrix
      .getRow(pivotRow)
      .toArray()
      .indexOf(ops.one());
    if (pivotColumn === -1) {
      continue;
    }
    matrix = clearEntriesAbove(matrix, pivotRow, pivotColumn);
  }

  return matrix;
}

/**
 * Uses Gauss-Jordan elimination with pivoting to convert a matrix to Row-Echelon Form (REF)
 *
 * @param matrix - The input matrix
 * @returns The matrix in REF
 * @public
 */
export function rowEchelonForm<S>(matrix: Matrix<S>): Matrix<S> {
  const ops = matrix.ops();
  const maxNumberOfPivotEntries = Math.min(...matrix.getShape());

  for (let pivotRow = 0; pivotRow < maxNumberOfPivotEntries; pivotRow++) {
    matrix = RowOperations.pivot(matrix).result;
    let pivotColumn = pivotRow;
    let pivotEntry = matrix.getEntry(pivotRow, pivotColumn);

    while (ops.equals(pivotEntry, ops.zero()) && pivotColumn < matrix.getNumberOfColumns() - 1) {
      pivotEntry = matrix.getEntry(pivotRow, ++pivotColumn);
    }

    if (ops.equals(pivotEntry, ops.zero())) {
      continue;
    }

    matrix = clearEntriesBelow(matrix, pivotRow, pivotColumn);
  }

  return matrix;
}

/**
 * Uses elementary row operations to clear all entries below the given pivot entry.
 * Throws an error of the necessary preconditions are not met - i.e. if the pivot
 * row is not cleared to the left.
 */
function clearEntriesBelow<S>(matrix: Matrix<S>, pivotRow: number, pivotColumn: number): Matrix<S> {
  checkPreconditionsForClearingBelow(matrix, pivotRow, pivotColumn);
  const ops = matrix.ops();
  const pivotEntry = matrix.getEntry(pivotRow, pivotColumn);

  for (let rowIndex = pivotRow + 1; rowIndex < matrix.getNumberOfRows(); rowIndex++) {
    const entry = matrix.getEntry(rowIndex, pivotColumn);
    if (ops.equals(entry, ops.zero())) {
      continue;
    }

    // not undefined because pivotEntry is not 0
    const coefficient = ops.divide(ops.getAdditiveInverse(entry), pivotEntry) as S;
    matrix = RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, pivotRow, coefficient);
  }

  return matrix;
}

/**
 * Throws an error if the row reduction algorithm prematurely attempts to
 * clear the entries below a pivot column.
 */
function checkPreconditionsForClearingBelow<S>(
  matrix: Matrix<S>,
  pivotRow: number,
  pivotColumn: number
): void {
  const ops = matrix.ops();

  // Values to the left of the pivot should be 0
  for (let i = 0; i < pivotColumn - 1; i++) {
    if (!ops.equals(matrix.getEntry(pivotRow, i), ops.zero())) {
      throw Error('Not ready yet!');
    }
  }
}

/**
 * Uses elementary row operations to clear the entries above a pivot entry.
 * Throws an error if the necessary preconditions are not met - i.e. if the
 * pivot entry is not 1 or the pivot row is not cleared to the left and the right.
 */
function clearEntriesAbove<S>(matrix: Matrix<S>, pivotRow: number, pivotColumn: number): Matrix<S> {
  checkPreconditionsForClearingAbove(matrix, pivotRow, pivotColumn);
  const ops = matrix.ops();

  for (let rowIndex = pivotRow - 1; rowIndex >= 0; rowIndex--) {
    const entry = matrix.getEntry(rowIndex, pivotColumn);
    if (ops.equals(entry, ops.zero())) {
      continue;
    }

    matrix = RowOperations.addScalarMultipleOfRowToRow(
      matrix,
      rowIndex,
      pivotRow,
      ops.getAdditiveInverse(entry)
    );
  }
  return matrix;
}

/**
 * Throws an error if the row reduction algorithm prematurely attempts to
 * clear the entries above a pivot entry.
 */
function checkPreconditionsForClearingAbove<S>(
  matrix: Matrix<S>,
  pivotRow: number,
  pivotColumn: number
): void {
  const ops = matrix.ops();

  // Values to the left and of the pivot should be 0; the pivot should be 1
  for (let i = 0; i < pivotColumn; i++) {
    const entry = matrix.getEntry(pivotRow, i);

    if (!ops.equals(entry, ops.zero())) {
      throw Error('Not ready yet!');
    }
  }

  if (!ops.equals(matrix.getEntry(pivotRow, pivotColumn), ops.one())) {
    throw Error('Not ready yet!');
  }
}
