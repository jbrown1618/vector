import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { isSquare } from '../utilities/MatrixProperties';
import { solveByGaussianElimination } from '../operations/GaussJordan';
import { SolutionType } from '../solvers/LinearSolution';
import { calculateQRDecomposition } from '../decompositions/QRDecomposition';

// TODO - convert to an upper Hessenberg matrix to improve rate of convergence

const defaultIterations = 100;

/**
 * An eigenvector and its corresponding eigenvalue
 * @public
 */
export interface EigenPair<S> {
  eigenvalue: S;
  eigenvector: Vector<S>;
}

/**
 * Uses the QR algorithm to compute the eigenvalues and eigenvectors of a matrix `A`
 *
 * @param A - The matrix for which to compute eigenvalues
 * @param numIterations - The number of iterations to take
 * @returns An array of eigenvalue-eigenvalue pairs
 * @public
 */
export function eig<S>(A: Matrix<S>, numIterations: number = defaultIterations): EigenPair<S>[] {
  const eigenvalues = calculateEigenvalues(A, numIterations);
  return eigenvalues.toArray().map(eigenvalue => {
    const eigenvector = getEigenvectorForEigenvalue(A, eigenvalue);
    return { eigenvalue, eigenvector };
  });
}

/**
 * Uses the QR algorithm to compute the eigenvalues of a matrix `A`
 *
 * @param A - The matrix for which to compute eigenvalues
 * @param numIterations - The number of iterations to take
 * @public
 */
export function calculateEigenvalues<S>(
  A: Matrix<S>,
  numIterations: number = defaultIterations
): Vector<S> {
  if (!isSquare(A)) throw Error('Eigenvalues are only defined for square matrices');
  const ops = A.ops();
  const m = A.getNumberOfRows();
  if (m === 1) return A.getColumnVectors()[0];
  if (m === 2) return getTwoByTwoEigenvalues(A);

  let n = 0;
  let nthA = A;

  while (n < numIterations) {
    const { Q, R } = calculateQRDecomposition(nthA);
    n++;
    nthA = R.multiply(Q);

    // TODO - this early return causes us to have worse accuracy than we otherwise
    // would.  If we want to be able to return early, we need to be able to pass
    // equality tolerances around.
    // if (isUpperTriangular(nthA)) {
    //   return nthA.getDiagonal();
    // }
  }

  const eigenvalues: S[] = [];
  for (let i = 0; i < m; i++) {
    const diagonalEntry = nthA.getEntry(i, i);

    if (i === m - 1) {
      eigenvalues.push(diagonalEntry);
      continue;
    }

    const subdiagonalEntry = nthA.getEntry(i + 1, i);
    if (ops.equals(ops.zero(), subdiagonalEntry)) {
      eigenvalues.push(diagonalEntry);
      continue;
    }

    // If we're here, then either we failed to converge, or we are looking at a pair of complex eigenvalues
    const subMatrix = A.builder().slice(nthA, i, i, i + 2, i + 2);
    const subEigenvalues = getTwoByTwoEigenvalues(subMatrix);
    eigenvalues.push(subEigenvalues.getEntry(0));
    eigenvalues.push(subEigenvalues.getEntry(1));
    i++; // We covered two eigenvalues, so jump ahead
  }
  return A.vectorBuilder().fromArray(eigenvalues);
}

function getTwoByTwoEigenvalues<S>(A: Matrix<S>): Vector<S> {
  const ops = A.ops();
  const data = A.toArray();
  const [a00, a01] = data[0];
  const [a10, a11] = data[1];

  // b, and c are the parameters of the quadratic formula.  a is one.
  const negativeB = ops.add(a00, a11);
  const c = ops.subtract(ops.multiply(a00, a11), ops.multiply(a10, a01));

  const overTwoA = ops.fromNumber(1 / 2);
  const fourAC = ops.multiply(c, ops.fromNumber(4));
  const bSquaredMinusFourAC = ops.subtract(ops.multiply(negativeB, negativeB), fourAC);
  const rootPart = ops.getPrincipalSquareRoot(bSquaredMinusFourAC);

  if (rootPart === undefined) throw Error('This scalar type does not support complex values');

  const firstEigenvalue = ops.multiply(ops.add(negativeB, rootPart), overTwoA);
  const secondEigenvalue = ops.multiply(ops.subtract(negativeB, rootPart), overTwoA);

  return A.vectorBuilder().fromValues(firstEigenvalue, secondEigenvalue);
}

/**
 * Given a matrix `A` and an eigenvalue `lambda` of that matrix, returns the
 * eigenvector of `A` corresponding to `lambda`
 *
 * @param A - The matrix with eigenvalue `lambda`
 * @param lambda - The eigenvalue for which to find an eigenvector
 * @public
 */
export function getEigenvectorForEigenvalue<S>(A: Matrix<S>, lambda: S): Vector<S> {
  const builder = A.builder();
  const ops = A.ops();
  const minusLambda = ops.multiply(lambda, ops.negativeOne());
  const minusLambdaI = builder.identity(A.getNumberOfColumns()).scalarMultiply(minusLambda);
  const aMinusLambdaI = A.add(minusLambdaI);

  const eigenvectorSolution = solveByGaussianElimination(
    aMinusLambdaI,
    A.vectorBuilder().zeros(A.getNumberOfRows())
  );

  if (
    eigenvectorSolution.solutionType === SolutionType.UNIQUE ||
    eigenvectorSolution.solutionType === SolutionType.UNDERDETERMINED
  ) {
    return eigenvectorSolution.solution;
  } else {
    // If lambda is an eigenvalue of A, then it must correspond to at least one eigenvector.
    throw Error(
      `Cannot find an eigenvector; ${lambda} is not an eigenvalue of the provided matrix`
    );
  }
}
