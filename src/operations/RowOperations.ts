import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { assertValidMatrixIndex } from '../utilities/ErrorAssertions';

/**
 * The result of a row operation (`result`), and the matrix that we multiply
 * by the original matrix to yield that result (`operator`)
 * @public
 */
export interface RowOperationResult<S> {
  result: Matrix<S>;
  operator: Matrix<S>;
}

/**
 * A wrapper for static methods representing the elementary row operations
 * @public
 */
export class RowOperations {
  /**
   * An elementary row operations which returns a new matrix whose row
   * at `rowIndex` is multiplied by `scalar`
   *
   * @param matrix - The original matrix
   * @param rowIndex - The index of the row to modify
   * @param scalar - The factor by which to scale the row
   * @returns The matrix with the transformation applied
   * @public
   */
  public static multiplyRowByScalar<S>(matrix: Matrix<S>, rowIndex: number, scalar: S): Matrix<S> {
    assertValidMatrixIndex(matrix, rowIndex, 0);
    const ops = matrix.ops();
    return RowOperations.addScalarMultipleOfRowToRow(
      matrix,
      rowIndex,
      rowIndex,
      ops.subtract(scalar, ops.one())
    );
  }

  /**
   * An elementary row operations which returns a new matrix whose row at `targetRow` has
   * had the row at `rowToAdd` added to it.
   *
   * @param matrix - The original matrix
   * @param targetRow - The index of the row to modify
   * @param rowToAdd - The index of the row to add
   * @returns The matrix with the transformation applied
   * @public
   */
  public static addRowToRow<S>(matrix: Matrix<S>, targetRow: number, rowToAdd: number): Matrix<S> {
    return RowOperations.addScalarMultipleOfRowToRow(
      matrix,
      targetRow,
      rowToAdd,
      matrix.ops().one()
    );
  }

  /**
   * An elementary row operations which returns a new matrix whose row at `targetRow` has
   * had a scalar multiple of `rowToAdd` added to it.
   *
   * @param matrix - The original matrix
   * @param targetRow - The index of the row to modify
   * @param rowToAdd - The index of the row to be scaled and added
   * @param scalar - The factor by which to scale the row
   * @returns The matrix with the transformation applied
   * @public
   */
  public static addScalarMultipleOfRowToRow<S>(
    matrix: Matrix<S>,
    targetRow: number,
    rowToAdd: number,
    scalar: S
  ): Matrix<S> {
    assertValidMatrixIndex(matrix, targetRow, 0);
    assertValidMatrixIndex(matrix, rowToAdd, 0);

    const ops = matrix.ops();
    const data = matrix.toArray();
    for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
      data[targetRow][j] = ops.add(data[targetRow][j], ops.multiply(scalar, data[rowToAdd][j]));
    }

    return matrix.builder().fromArray(data);
  }

  /**
   * An elementary row operations which returns a new matrix whose row at index `first` has
   * been exchanged with the row at index `second`
   *
   * @param matrix - The original matrix
   * @param first - The index of the first row to exchange
   * @param second - The index of the second row to exchange
   * @returns The matrix with the transformation applied
   * @public
   */
  public static exchangeRows<S>(matrix: Matrix<S>, first: number, second: number): Matrix<S> {
    assertValidMatrixIndex(matrix, first, 0);
    assertValidMatrixIndex(matrix, second, 0);

    const dataCopy = matrix.toArray();
    const data = matrix.toArray();

    data[second] = dataCopy[first];
    data[first] = dataCopy[second];

    return matrix.builder().fromArray(data);
  }

  /**
   * Sorts the rows of a matrix according to the number of leading zeros
   * and the magnitude of the first nonzero entry
   * @public
   */
  public static pivot<S>(matrix: Matrix<S>): RowOperationResult<S> {
    const ops = matrix.ops();
    // We will sort the rows of an identity matrix according to the number
    // of leading zeros in the corresponding row of `matrix`
    const comparator: (r1: Vector<S>, r2: Vector<S>) => number = (iRow1, iRow2) => {
      const rowIndex1 = getNumberOfLeadingZeros(iRow1);
      const rowIndex2 = getNumberOfLeadingZeros(iRow2);
      const mRow1 = matrix.getRow(rowIndex1);
      const mRow2 = matrix.getRow(rowIndex2);
      const leadingZeros1 = getNumberOfLeadingZeros(mRow1);
      const leadingZeros2 = getNumberOfLeadingZeros(mRow2);

      if (leadingZeros1 === leadingZeros2) {
        // If they have the same number of leading zeros, put
        // the entry with the greatest magnitude on top
        const firstEntry1 = mRow1.getEntry(leadingZeros1);
        const firstEntry2 = mRow2.getEntry(leadingZeros2);
        return ops.norm(firstEntry2) - ops.norm(firstEntry1);
      }
      return leadingZeros1 - leadingZeros2;
    };

    const I = matrix.builder().identity(matrix.getNumberOfRows());
    const P = matrix.builder().fromRowVectors(I.getRowVectors().sort(comparator));
    const permuted = P.multiply(matrix);

    return {
      operator: P,
      result: permuted
    };
  }
}

function getNumberOfLeadingZeros<S>(v: Vector<S>): number {
  const ops = v.ops();
  let zeros = 0;
  for (const item of v.toArray()) {
    if (ops.equals(item, ops.zero())) {
      ++zeros;
    } else {
      break;
    }
  }
  return zeros;
}
