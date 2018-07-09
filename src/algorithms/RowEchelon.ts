import { RowOperations } from './RowOperations';
import { Matrix, MatrixBuilder, NumberMatrix, VectorData } from '..';
import { assertSquare } from '../utilities/ErrorAssertions';

export function inverse(matrix: Matrix<number>): Matrix<number> | undefined {
  assertSquare(matrix);
  const dim = matrix.getNumberOfRows();
  const I = MatrixBuilder.identity(dim);

  const augmented = MatrixBuilder.augment(matrix, I);
  const rref = reducedRowEchelonForm(augmented);

  const left = MatrixBuilder.slice(rref, 0, 0, dim, dim);
  const right = MatrixBuilder.slice(rref, 0, dim);

  if (left.equals(I)) {
    return right;
  } else {
    // Not invertible
    return undefined;
  }
}

export function reducedRowEchelonForm(matrix: Matrix<number>): Matrix<number> {
  matrix = rowEchelonForm(matrix);

  const maxNumberOfPivotEntries = Math.min(matrix.getNumberOfColumns(), matrix.getNumberOfRows());
  for (let pivotRow = maxNumberOfPivotEntries - 1; pivotRow >= 0; pivotRow--) {
    const pivotColumn = matrix
      .getRow(pivotRow)
      .getData()
      .indexOf(1);
    if (pivotColumn === -1) {
      continue;
    }
    matrix = clearEntriesAbove(matrix, pivotRow, pivotColumn);
  }

  return matrix;
}

export function rowEchelonForm(matrix: Matrix<number>): Matrix<number> {
  matrix = moveLeadingZerosToBottom(matrix);

  const maxNumberOfPivotEntries = Math.min(matrix.getNumberOfRows(), matrix.getNumberOfColumns());
  for (let pivotRow = 0; pivotRow < maxNumberOfPivotEntries; pivotRow++) {
    let pivotColumn = pivotRow;
    let pivotEntry = matrix.getEntry(pivotRow, pivotColumn);

    while (pivotEntry == 0 && pivotColumn < matrix.getNumberOfColumns() - 1) {
      pivotEntry = matrix.getEntry(pivotRow, ++pivotColumn);
    }

    if (pivotEntry === 0) {
      continue;
    }

    if (pivotEntry !== 1) {
      matrix = RowOperations.multiplyRowByScalar(matrix, pivotRow, 1 / pivotEntry);
    }

    matrix = clearEntriesBelow(matrix, pivotRow, pivotColumn);
  }

  return matrix;
}

function moveLeadingZerosToBottom(matrix: Matrix<number>): Matrix<number> {
  const getNumberOfLeadingZeros = (row: VectorData<number>) => {
    let zeros = 0;
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 0) {
        ++zeros;
      } else {
        break;
      }
    }
    return zeros;
  };

  const comparator = (a: VectorData<number>, b: VectorData<number>) => {
    return getNumberOfLeadingZeros(a) - getNumberOfLeadingZeros(b);
  };

  return NumberMatrix.fromData(matrix.getData().sort(comparator));
}

function clearEntriesBelow(
  matrix: Matrix<number>,
  pivotRow: number,
  pivotColumn: number
): Matrix<number> {
  checkPreconditionsForClearingBelow(matrix, pivotRow, pivotColumn);

  for (let rowIndex = pivotRow + 1; rowIndex < matrix.getNumberOfRows(); rowIndex++) {
    const entry = matrix.getEntry(rowIndex, pivotColumn);
    if (entry === 0) {
      continue;
    }

    matrix = RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, pivotRow, -1 * entry);
  }

  return matrix;
}

function checkPreconditionsForClearingBelow(
  matrix: Matrix<number>,
  pivotRow: number,
  pivotColumn: number
): void {
  // The pivot entry should be 1
  if (matrix.getEntry(pivotRow, pivotColumn) !== 1) {
    throw Error('Not ready yet!');
  }

  // Values to the left of the pivot should be 0
  for (let i = 0; i < pivotColumn - 1; i++) {
    if (matrix.getEntry(pivotRow, i) !== 0) {
      throw Error('Not ready yet!');
    }
  }
}

function clearEntriesAbove(
  matrix: Matrix<number>,
  pivotRow: number,
  pivotColumn: number
): Matrix<number> {
  checkPreconditionsForClearingAbove(matrix, pivotRow, pivotColumn);

  for (let rowIndex = pivotRow - 1; rowIndex >= 0; rowIndex--) {
    const entry = matrix.getEntry(rowIndex, pivotColumn);
    if (entry === 0) {
      continue;
    }

    matrix = RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, pivotRow, -1 * entry);
  }
  return matrix;
}

function checkPreconditionsForClearingAbove(
  matrix: Matrix<number>,
  pivotRow: number,
  pivotColumn: number
): void {
  // Values to the left and of the pivot should be 0; the pivot should be 1
  for (let i = 0; i < pivotColumn; i++) {
    const entry = matrix.getEntry(pivotRow, i);

    if (entry !== 0) {
      throw Error('Not ready yet!');
    }
  }

  if (matrix.getEntry(pivotRow, pivotColumn) !== 1) {
    throw Error('Not ready yet!');
  }
}
