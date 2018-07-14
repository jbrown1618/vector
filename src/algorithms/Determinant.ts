import { Matrix, MatrixBuilder } from '..';
import { assertSquare } from '../utilities/ErrorAssertions';

/**
 * Uses expansion of minors to calculate the determinant of a matrix.
 * Throws an error if the input is not square.
 *
 * @param {Matrix<number>} matrix  a square matrix
 * @returns {number}  the determinant
 */
export function determinant(matrix: Matrix<number>): number {
  assertSquare(matrix);

  // Definition of a 2x2 determinant
  if (matrix.getNumberOfRows() === 2) {
    return (
      matrix.multiplyScalars(matrix.getEntry(0, 0), matrix.getEntry(1, 1)) -
      matrix.multiplyScalars(matrix.getEntry(0, 1), matrix.getEntry(1, 0))
    );
  }

  // Calculate NxN determinant by expansion of minors
  let det = 0;
  for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
    const sign = Math.pow(-1, j);
    det += matrix.getEntry(0, j) * determinant(MatrixBuilder.exclude(matrix, 0, j)) * sign;
  }
  return det;
}
