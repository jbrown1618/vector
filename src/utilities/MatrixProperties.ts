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
 * @returns `true` if the matrix is upper-triangular
 * @public
 */
export function isUpperTriangular<S>(matrix: Matrix<S>): boolean {
  const ops = matrix.ops();
  let isUT = true;
  matrix.forEach((entry, i, j) => {
    if (i > j && !ops.equals(ops.zero(), entry)) {
      isUT = false;
    }
  });
  return isUT;
}

/**
 * Tests if a matrix is lower-triangular.
 *
 * @remarks
 * A matrix is lower-triangular if all entries above the primary diagonal
 * (those where `i < j`) are zero.
 *
 * @returns `true` if the matrix is lower-triangular
 * @public
 */
export function isLowerTriangular<S>(matrix: Matrix<S>): boolean {
  const ops = matrix.ops();
  let isLT = true;
  matrix.forEach((entry, i, j) => {
    if (i < j && !ops.equals(ops.zero(), entry)) {
      isLT = false;
    }
  });
  return isLT;
}

/**
 * Tests if a matrix is symmetric.
 *
 * @remarks
 * A matrix A is symmetric if it is square and if A[i,j] = A[j,i] for all i and j
 *
 * @returns `true` if the matrix is symmetric
 * @public
 */
export function isSymmetric<S>(matrix: Matrix<S>): boolean {
  if (!isSquare(matrix)) return false;

  const ops = matrix.ops();
  const dim = matrix.getNumberOfColumns();

  for (let i = 0; i < dim; i++) {
    for (let j = i; j < dim; j++) {
      if (!ops.equals(matrix.getEntry(i, j), matrix.getEntry(j, i))) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Tests if a matrix is Hermitian.
 *
 * @remarks
 * A matrix A is Hermitian if it is equal to its conjugate transpose
 *
 * @returns `true` if the matrix is Hermitian
 * @public
 */
export function isHermitian<S>(matrix: Matrix<S>): boolean {
  if (!isSquare(matrix)) return false;

  const ops = matrix.ops();
  const dim = matrix.getNumberOfColumns();

  for (let i = 0; i < dim; i++) {
    for (let j = i; j < dim; j++) {
      if (!ops.equals(matrix.getEntry(i, j), ops.conjugate(matrix.getEntry(j, i)))) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Tests if a matrix is an identity matrix
 *
 * @returns `true` if the matrix is an identity
 * @public
 */
export function isIdentity<S>(matrix: Matrix<S>): boolean {
  // Constructing an identity matrix and calling .equals would
  // be easier to code, but would use much more memory

  if (!isSquare(matrix)) return false;

  const ops = matrix.ops();
  const dim = matrix.getNumberOfColumns();

  for (let i = 0; i < dim; i++) {
    for (let j = i; j < dim; j++) {
      if (i === j) {
        if (!ops.equals(matrix.getEntry(i, j), ops.one())) {
          return false; // Diagonal entries must be 1
        }
      } else {
        if (!ops.equals(matrix.getEntry(i, j), ops.zero())) {
          return false; // Non-diagonal entries must be 0
        }
      }
    }
  }

  return true;
}

/**
 * Tests if a matrix is orthogonal
 *
 * @remarks
 * A matrix is orthogonal if each column is orthogonal to each other column.
 * That is, if for each pair of columns, their inner product is 0.
 *
 * @returns `true` if the matrix is orthogonal.
 * @public
 */
export function isOrthogonal<S>(matrix: Matrix<S>): boolean {
  const ops = matrix.ops();
  const cols = matrix.getColumnVectors();

  for (const col of cols) {
    for (const other of cols) {
      if (col === other) continue;

      if (!ops.equals(col.innerProduct(other), ops.zero())) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Tests if a matrix is orthonormal
 *
 * @remarks
 * A matrix is orthonormal if is {@link isOrthogonal | orthogonal} and
 * if its columns all have norm 1.
 * An orthonormal matrix multiplied by its transpose is an identity.
 *
 * @returns `true` if the matrix is orthonormal
 * @public
 */
export function isOrthonormal<S>(matrix: Matrix<S>): boolean {
  const multipliedByOwnTranspose = matrix.multiply(matrix.transpose());
  return isIdentity(multipliedByOwnTranspose);
}
