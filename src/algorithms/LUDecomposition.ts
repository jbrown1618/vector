import { Matrix } from '../types/matrix/Matrix';
import { assertSquare } from '../utilities/ErrorAssertions';
import { inverse } from './GaussJordan';

/**
 * The result of an LU Decomposition
 */
export interface LUDecomposition<ScalarType> {
  L: Matrix<ScalarType>;
  U: Matrix<ScalarType>;
  P: Matrix<ScalarType>;
}

/**
 * An intermediate step in the Doolittle algorithm, representing successive approximations of L and U
 */
interface DoolittleIteration<ScalarType> {
  ln: Matrix<ScalarType>;
  un: Matrix<ScalarType>;
}

/**
 * Uses the Doolittle algorithm to calculate the LU Decomposition of a matrix A.
 * That is, a lower-triangular matrix L, an upper-triangular matrix U, and a row
 * permutation matrix P such that _PA = LU_
 *
 * @param A - The matrix to decompose
 */
export function calculateLUDecomposition<ScalarType>(
  A: Matrix<ScalarType>
): LUDecomposition<ScalarType> {
  assertSquare(A);

  const N = A.getNumberOfColumns();
  const P = A.builder().identity(N);

  // U will eventually be the last U_n
  let U = A;
  // L will eventually be the product of all L_n
  let L = A.builder().identity(N);

  for (let n = 0; n < N; n++) {
    const nthIteration = getNextDoolittleIteration(n, U);
    const lnInverse = inverse(nthIteration.ln);
    if (!lnInverse) {
      throw Error('TODO - unable to proceed');
    }
    L = L.multiply(lnInverse);
    U = nthIteration.un;
  }

  return { L, U, P };
}

function getNextDoolittleIteration<ScalarType>(
  columnIndex: number,
  previousU: Matrix<ScalarType>
): DoolittleIteration<ScalarType> {
  const ln = getNthLowerTriangularMatrix(columnIndex, previousU);
  const un = ln.multiply(previousU);
  return { ln, un };
}

function getNthLowerTriangularMatrix<ScalarType>(
  columnIndex: number,
  previousU: Matrix<ScalarType>
): Matrix<ScalarType> {
  const ops = previousU.ops();

  return previousU
    .builder()
    .fromIndexFunction(previousU.getNumberOfRows(), previousU.getNumberOfColumns(), (i, j) => {
      if (i === j) {
        return ops.one();
      } else if (i > j && j === columnIndex) {
        const numerator = previousU.getEntry(i, columnIndex);
        const denominator = previousU.getEntry(columnIndex, columnIndex);
        const quotient = ops.divide(numerator, denominator);
        if (!quotient) {
          throw Error('TODO - One of the diagonal entries was 0!');
        }
        return ops.multiply(quotient, ops.negativeOne());
      } else {
        return ops.zero();
      }
    });
}
