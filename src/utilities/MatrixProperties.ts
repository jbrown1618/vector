import { Matrix } from '../types/matrix/Matrix';

/**
 * @param matrix - The matrix to check
 * @returns `true` if `matrix` is square
 */
export function isSquare(matrix: Matrix<any>): boolean {
  return matrix.getNumberOfColumns() === matrix.getNumberOfRows();
}
