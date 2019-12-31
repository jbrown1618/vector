import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { assertSquare } from '../utilities/ErrorAssertions';
import { normalize } from '../operations/Norms';

/**
 * The result of a QR decomposition.
 * @public
 */
export interface QRDecomposition<S> {
  Q: Matrix<S>;
  R: Matrix<S>;
}

/**
 * Uses the Graham-Schmidt process to calculate the QR decomposition of the matrix A.
 *
 * @remarks
 * A QR Decomposition of a matrix A is a unitary matrix Q and upper-triangular
 * matrix R such that Q multiplied by R yields A
 *
 * @param A - The matrix to decompose
 * @public
 */
export function calculateQRDecomposition<S>(A: Matrix<S>): QRDecomposition<S> {
  assertSquare(A);

  const matrixBuilder = A.builder();
  const vectorBuilder = A.vectorBuilder();
  const ops = A.ops();
  const dim = A.getNumberOfColumns();

  // Construct a matrix U, whose columns form an orthogonal basis
  // for the column space of A, by subtracting the non-orthogonal
  // components for each column of A
  const uColumns: Vector<S>[] = [];
  for (let k = 0; k < dim; k++) {
    const columnK = A.getColumn(k);

    let nonOrthogonalPart = vectorBuilder.zeros(dim);
    for (let j = 0; j < k; j++) {
      // Add the part of Ak that is not orthogonal to the already-calculated jth column of U
      nonOrthogonalPart = nonOrthogonalPart.add(columnK.projectOnto(uColumns[j]));
    }
    uColumns.push(columnK.add(nonOrthogonalPart.scalarMultiply(ops.negativeOne())));
  }

  // The unitary matrix Q is just U with all of its columns normalized.
  // These columns are, then, an orthonormal basis for the column space of A.
  // If any columns are the zero vector, then A was not full-rank to begin with.
  const qColumns: Vector<S>[] = [];
  for (let i = 0; i < dim; i++) {
    const qi = normalize(uColumns[i]);
    if (qi === undefined) {
      throw Error('A is singular; no QR decomposition exists');
    }
    qColumns.push(qi);
  }
  const Q = matrixBuilder.fromColumnVectors(qColumns);

  // The upper-triangular matrix R is formed by computing inner
  // products of our new basis vectors with the columns of A.
  const R = matrixBuilder.fromIndexFunction([dim, dim], (i: number, j: number) => {
    if (i > j) {
      return ops.zero();
    }
    return A.getColumn(j).innerProduct(Q.getColumn(i));
  });

  return { Q, R };
}
