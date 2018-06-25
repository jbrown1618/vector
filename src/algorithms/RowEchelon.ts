import { Matrix } from "../Matrix";
import { RowOperations } from "./RowOperations";
import { VectorData } from "../Vector";

export function reducedRowEchelonForm(matrix: Matrix): Matrix {
  matrix = rowEchelonForm(matrix);

  const numberOfPivotEntries = Math.min(matrix.getNumberOfColumns(), matrix.getNumberOfRows());
  for (let pivotIndex = numberOfPivotEntries - 1; pivotIndex >= 0; pivotIndex--) {
    matrix = clearEntriesAbove(matrix, pivotIndex);
  }

  return matrix;
}

export function rowEchelonForm(matrix: Matrix): Matrix {
  matrix = moveLeadingZerosToBottom(matrix);

  const numberOfPivotEntries = Math.min(matrix.getNumberOfColumns(), matrix.getNumberOfRows());
  for (let pivotIndex = 0; pivotIndex < numberOfPivotEntries; pivotIndex++) {
    const pivotEntry = matrix.getEntry(pivotIndex, pivotIndex);
    if (pivotEntry === 0) {
      continue;
    }

    if (pivotEntry !== 1) {
      matrix = RowOperations.multiplyRowByScalar(matrix, pivotIndex, 1 / pivotEntry);
    }

    matrix = clearEntriesBelow(matrix, pivotIndex);
  }

  return matrix;
}

function moveLeadingZerosToBottom(matrix: Matrix): Matrix {
  const getNumberOfLeadingZeros = (row: VectorData) => {
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

  const comparator = (a: VectorData, b: VectorData) => {
    return getNumberOfLeadingZeros(a) - getNumberOfLeadingZeros(b);
  };

  return Matrix.fromData(matrix.getData().sort(comparator));
}

function clearEntriesBelow(matrix: Matrix, pivotIndex: number): Matrix {
  checkPreconditionsForClearingBelow(matrix, pivotIndex);

  for (let rowIndex = pivotIndex + 1; rowIndex < matrix.getNumberOfRows(); rowIndex++) {
    const entry = matrix.getEntry(rowIndex, pivotIndex);
    if (entry === 0) {
      continue;
    }

    matrix = RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, pivotIndex, -1 * entry);
  }

  return matrix;
}

function checkPreconditionsForClearingBelow(matrix: Matrix, pivotIndex: number): void {
  // The pivot entry should be 1
  if (matrix.getEntry(pivotIndex, pivotIndex) !== 1) {
    throw Error("Not ready yet!");
  }

  // Values to the left of the pivot should be 0
  for (let i = 0; i < pivotIndex - 1; i++) {
    if (matrix.getEntry(pivotIndex, i) !== 0) {
      throw Error("Not ready yet!");
    }
  }
}

function clearEntriesAbove(matrix: Matrix, pivotIndex: number): Matrix {
  checkPreconditionsForClearingAbove(matrix, pivotIndex);

  for (let rowIndex = pivotIndex - 1; rowIndex >= 0; rowIndex--) {
    const entry = matrix.getEntry(rowIndex, pivotIndex);
    if (entry === 0) {
      continue;
    }

    matrix = RowOperations.addScalarMultipleOfRowToRow(matrix, rowIndex, pivotIndex, -1 * entry);
  }
  return matrix;
}

function checkPreconditionsForClearingAbove(matrix: Matrix, pivotIndex: number): void {
  // Values to the left and right of the pivot should be 0; the pivot should be 1
  for (let i = 0; i < matrix.getNumberOfColumns(); i++) {
    const entry = matrix.getEntry(pivotIndex, i);
    const expected = i === pivotIndex ? 1 : 0;
    if (entry !== expected) {
      throw Error("Not ready yet!");
    }
  }
}
