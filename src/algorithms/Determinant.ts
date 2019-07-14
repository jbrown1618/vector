import { Matrix } from '../types/matrix/Matrix';
import { assertSquare } from '../utilities/ErrorAssertions';

/**
 * Uses expansion of minors to calculate the determinant of a matrix.
 * Throws an error if the input is not square.
 *
 * @param matrix - A square matrix
 * @returns - The determinant
 * @public
 */
export function determinant<S>(matrix: Matrix<S>): S {
  assertSquare(matrix);
  const ops = matrix.ops();
  const builder = matrix.builder();

  // Definition of a 2x2 determinant
  if (matrix.getNumberOfRows() === 2) {
    return ops.subtract(
      ops.multiply(matrix.getEntry(0, 0), matrix.getEntry(1, 1)),
      ops.multiply(matrix.getEntry(0, 1), matrix.getEntry(1, 0))
    );
  }

  // Calculate NxN determinant by expansion of minors
  let det = ops.zero();
  for (let j = 0; j < matrix.getNumberOfColumns(); j++) {
    const signFlipped = j % 2 === 1;
    const determinantOfMinor: S = determinant(builder.exclude(matrix, 0, j));
    const weight = matrix.getEntry(0, j);

    let quantityToAdd = ops.multiply(determinantOfMinor, weight);
    if (signFlipped) {
      quantityToAdd = ops.multiply(quantityToAdd, ops.negativeOne());
    }

    det = ops.add(det, quantityToAdd);
  }
  return det;
}
