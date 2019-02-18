import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { assertValidMatrixIndex } from '../utilities/ErrorAssertions';

/**
 * The result of a row operation (`result`), and the matrix that we multiply
 * by the original matrix to yield that result (`operator`)
 */
export interface RowOperationResult<ScalarType> {
  result: Matrix<ScalarType>;
  operator: Matrix<ScalarType>;
}

/**
 * Returns a new matrix whose row at `rowIndex` is multipled by `scalar`
 *
 * @param matrix - The original matrix
 * @param rowIndex - The index of the row to modify
 * @param scalar - The factor by which to scale the row
 * @returns The matrix with the transformation applied
 */
export function multiplyRowByScalar<ScalarType>(
  matrix: Matrix<ScalarType>,
  rowIndex: number,
  scalar: ScalarType
): Matrix<ScalarType> {
  assertValidMatrixIndex(matrix, rowIndex, 0);
  const ops = matrix.ops();
  return addScalarMultipleOfRowToRow(matrix, rowIndex, rowIndex, ops.subtract(scalar, ops.one()));
}

/**
 * Returns a new matrix whose row at `targetRow` has had the row at `rowToAdd` added to it.
 *
 * @param matrix - The original matrix
 * @param targetRow - The index of the row to modify
 * @param rowToAdd - The index of the row to add
 * @returns The matrix with the transformation applied
 */
export function addRowToRow<ScalarType>(
  matrix: Matrix<ScalarType>,
  targetRow: number,
  rowToAdd: number
): Matrix<ScalarType> {
  return addScalarMultipleOfRowToRow(matrix, targetRow, rowToAdd, matrix.ops().one());
}

/**
 * Returns a new matrix whose row at `targetRow` has had a scalar multiple of `rowToAdd` added to it.
 *
 * @param matrix - The original matrix
 * @param targetRow - The index of the row to modify
 * @param rowToAdd - The index of the row to be scaled and added
 * @param scalar - The factor by which to scale the row
 * @returns The matrix with the transformation applied
 */
export function addScalarMultipleOfRowToRow<ScalarType>(
  matrix: Matrix<ScalarType>,
  targetRow: number,
  rowToAdd: number,
  scalar: ScalarType
): Matrix<ScalarType> {
  assertValidMatrixIndex(matrix, targetRow, 0);
  assertValidMatrixIndex(matrix, rowToAdd, 0);

  const ops = matrix.ops();
  const data = matrix.getData();
  for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
    data[targetRow][j] = ops.add(data[targetRow][j], ops.multiply(scalar, data[rowToAdd][j]));
  }

  return matrix.builder().fromData(data);
}

/**
 * Returns a new matrix whose row at index `first` has been exchanged with the row at index `second`
 *
 * @param matrix - The original matrix
 * @param first - The index of the first row to exchange
 * @param second - The index of the second row to exchange
 * @returns The matrix with the transformation applied
 */
export function exchangeRows<ScalarType>(
  matrix: Matrix<ScalarType>,
  first: number,
  second: number
): Matrix<ScalarType> {
  assertValidMatrixIndex(matrix, first, 0);
  assertValidMatrixIndex(matrix, second, 0);

  const dataCopy = matrix.getData();
  const data = matrix.getData();

  data[second] = dataCopy[first];
  data[first] = dataCopy[second];

  return matrix.builder().fromData(data);
}

/**
 * Sorts the rows of a matrix according to the number of leading zeros
 */
export function moveLeadingZerosToBottom<ScalarType>(
  matrix: Matrix<ScalarType>
): RowOperationResult<ScalarType> {
  // We will sort the rows of an identity matrix according to the number
  // of leading zeros in the corresponding row of `matrix`
  const comparator = (iRow1: Vector<ScalarType>, iRow2: Vector<ScalarType>) => {
    const rowIndex1 = getNumberOfLeadingZeros(iRow1);
    const rowIndex2 = getNumberOfLeadingZeros(iRow2);
    const mRow1 = matrix.getRow(rowIndex1);
    const mRow2 = matrix.getRow(rowIndex2);
    return getNumberOfLeadingZeros(mRow1) - getNumberOfLeadingZeros(mRow2);
  };

  const I = matrix.builder().identity(matrix.getNumberOfRows());
  const P = matrix.builder().fromRowVectors(I.getRowVectors().sort(comparator));

  return {
    operator: P,
    result: P.multiply(matrix)
  };
}

function getNumberOfLeadingZeros<ScalarType>(v: Vector<ScalarType>) {
  const ops = v.ops();
  let zeros = 0;
  for (const item of v.getData()) {
    if (ops.equals(item, ops.zero())) {
      ++zeros;
    } else {
      break;
    }
  }
  return zeros;
}
