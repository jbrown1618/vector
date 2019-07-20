import { Matrix } from '../types/matrix/Matrix';

/**
 * Tests if a matrix is square.
 *
 * @remarks
 * A matrix is square if it has the same number of rows as columns.
 *
 * @param matrix - The matrix to check
 * @returns `true` if `matrix` is square
 * @public
 */
export function isSquare(matrix: Matrix<any>): boolean {
  return matrix.getNumberOfColumns() === matrix.getNumberOfRows();
}

/**
 * Tests if a matrix is upper-triangular.
 *
 * @remarks
 * A matrix is upper-triangular if all entries below the primary diagonal
 * (those where `i > j`) are zero.
 *
 * @public
 */
export function isUpperTriangular<S>(matrix: Matrix<S>): boolean {
  const ops = matrix.ops();
  let isUT = true;
  matrix.forEachEntry((entry, i, j) => {
    if (i > j && !ops.equals(ops.zero(), entry)) {
      isUT = false;
    }
  });
  return isUT;
}
