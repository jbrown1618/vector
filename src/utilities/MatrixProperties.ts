import { Matrix } from '../types/matrix/Matrix';

/**
 * @param matrix - The matrix to check
 * @returns `true` if `matrix` is square
 * @public
 */
export function isSquare(matrix: Matrix<any>): boolean {
  return matrix.getNumberOfColumns() === matrix.getNumberOfRows();
}

/**
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
