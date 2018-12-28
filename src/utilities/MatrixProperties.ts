import { Matrix } from '../types/matrix/Matrix';

/**
 * @param {Matrix<any>} matrix
 * @returns {boolean} true if `matrix` is square
 */
export function isSquare(matrix: Matrix<any>): boolean {
  return matrix.getNumberOfColumns() === matrix.getNumberOfRows();
}
