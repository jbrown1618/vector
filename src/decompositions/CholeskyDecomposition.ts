import { Matrix } from '../types/matrix/Matrix';
import { isHermitian } from '../utilities/MatrixProperties';

/**
 * The result of a Cholesky Decomposition
 * @public
 */
export interface CholeskyDecomposition<S> {
  L: Matrix<S>;
}

/**
 * Uses the serial version of the Cholesky algorith to calculate the Cholesky
 * decomposition of a matrix `A`.
 *
 * @remarks
 * A Cholesky decomposition of a matrix `A` consists of a lower-triangular
 * matrix `L` such that _LL* = A_.
 *
 * A Cholesky decomposition only exists if `A` is symmetric and positive-definite.
 * @param A - The matrix to decompose
 * @public
 */
export function calculateCholeskyDecomposition<S>(
  A: Matrix<S>
): CholeskyDecomposition<S> | undefined {
  if (!isHermitian(A)) return undefined;

  const ops = A.ops();
  const builder = A.builder();
  const dim = A.getNumberOfColumns();

  let L = builder.zeros([dim, dim]);

  for (let j = 0; j < dim; j++) {
    const Ajj = A.getEntry(j, j);
    let entrySquared = Ajj;
    for (let p = 0; p < j; p++) {
      const Ljp = L.getEntry(j, p);
      entrySquared = ops.subtract(entrySquared, ops.multiply(Ljp, ops.conjugate(Ljp)));
    }
    const Ljj = ops.getPrincipalSquareRoot(entrySquared);
    if (Ljj === undefined) return undefined;
    L = L.set(j, j, Ljj);

    for (let i = j + 1; i < dim; i++) {
      let difference = A.getEntry(i, j);
      for (let p = 0; p < j; p++) {
        const Lip = L.getEntry(i, p);
        const Ljp = L.getEntry(j, p);
        difference = ops.subtract(difference, ops.multiply(Lip, ops.conjugate(Ljp)));
      }
      const Lij = ops.divide(difference, Ljj);
      if (Lij === undefined) return undefined;

      L = L.set(i, j, Lij);
    }
  }
  return { L };
}
