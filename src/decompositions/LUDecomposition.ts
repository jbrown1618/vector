import { Matrix } from '../types/matrix/Matrix';
import { assertSquare } from '../utilities/ErrorAssertions';
import { RowOperations } from '../operations/RowOperations';

/**
 * The result of an LU Decomposition
 * @public
 */
export interface LUDecomposition<S> {
  L: Matrix<S>;
  U: Matrix<S>;
  P: Matrix<S>;
}

/**
 * An intermediate step in the Doolittle algorithm, representing successive approximations of L and U
 * @public
 */
interface DoolittleIteration<S> {
  ln: Matrix<S>;
  un: Matrix<S>;
}

/**
 * Uses the Doolittle algorithm to calculate the LU Decomposition of a matrix A.
 *
 * @remarks
 * An LU Decomposition of a matrix A is a lower-triangular matrix L, an upper-triangular
 * matrix U, and a row permutation matrix P such that _PA = LU_
 *
 * @param A - The matrix to decompose
 * @public
 */
export function calculateLUDecomposition<S>(A: Matrix<S>): LUDecomposition<S> {
  assertSquare(A);
  const ops = A.ops();

  const N = A.getNumberOfColumns();
  const sortingResult = RowOperations.pivot(A);
  const P = sortingResult.operator;
  A = sortingResult.result;

  // U will eventually be the last U_n
  let U = A;
  // L will eventually be derived from the entries of these matrices
  const lns: Matrix<S>[] = [];

  for (let n = 0; n < N; n++) {
    const nthIteration = getNextDoolittleIteration(n, U);
    lns.push(nthIteration.ln);
    U = nthIteration.un;
  }

  // L will be the product of all L_n inverses.
  // For the particular form of L_n, we can take the shortcut of keeping everything
  // above the diagonal and using the negative of the entries below the diagonal.
  // This saves us from performing lots of inverses and multiplications.
  const L = A.builder().fromIndexFunction(A.getShape(), (i, j) => {
    if (i === j) {
      return ops.one();
    } else if (i < j) {
      return ops.zero();
    } else {
      return ops.multiply(lns[j].getEntry(i, j), ops.negativeOne());
    }
  });

  return { L, U, P };
}

/**
 * Given the current approximation of the upper-triangular matrix U, return
 * the next approximation (`un`) and the matrix by which we multiplied to
 * arrive at this new approximation (`ln`)
 *
 * @param columnIndex - The index of the column from which we are trying
 *     to eliminate sub-diagonal entries
 * @param previousU - The matrix from which we are trying to eliminate entries
 */
function getNextDoolittleIteration<S>(
  columnIndex: number,
  previousU: Matrix<S>
): DoolittleIteration<S> {
  const ln = getNthLowerTriangularMatrix(columnIndex, previousU);
  const un = ln.multiply(previousU);
  return { ln, un };
}

/**
 * Produces a matrix that, when multiplied by the previous U matrix
 * (which is not yet upper-triangular), will eliminate the entries
 * below the diagonal for the specified column index
 *
 * @param columnIndex - The index of the column from which we are trying
 *     to eliminate sub-diagonal entries
 * @param previousU - The matrix from which we are trying to eliminate entries
 */
function getNthLowerTriangularMatrix<S>(columnIndex: number, previousU: Matrix<S>): Matrix<S> {
  const ops = previousU.ops();

  return previousU.builder().fromIndexFunction(previousU.getShape(), (i, j) => {
    if (i === j) {
      return ops.one();
    } else if (i > j && j === columnIndex) {
      const numerator = previousU.getEntry(i, columnIndex);
      const denominator = previousU.getEntry(columnIndex, columnIndex);
      const quotient = ops.divide(numerator, denominator);
      if (quotient === undefined) {
        throw Error('Unexpected division by 0');
      }
      return ops.multiply(quotient, ops.negativeOne());
    } else {
      return ops.zero();
    }
  });
}
