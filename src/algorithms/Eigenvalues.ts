import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { isUpperTriangular } from '../utilities/MatrixProperties';
import { solveByGaussianElimination } from './GaussJordan';
import { SolutionType } from './LinearSolution';
import { calculateQRDecomposition } from './QRDecomposition';

// TODO - convert to an upper Hessenberg matrix to improve rate of convergence

/**
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
 * @param throwOnFailure - If true, an error will be thrown on a failure to converge.
 *     Otherwise, the result of the last iteration will be returned.
 * @returns An array of eigenvalue-eigenvalue pairs
 * @public
 */
export function eig<S>(
  A: Matrix<S>,
  numIterations: number = 30,
  throwOnFailure: boolean = true
): EigenPair<S>[] {
  const eigenvalues = calculateEigenvalues(A, numIterations, throwOnFailure);
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
 * @param throwOnFailure - If true, an error will be thrown on a failure to converge.
 *     Otherwise, the result of the last iteration will be returned.
 * @returns A vector whose entries are the eigenvalues of `A`
 * @public
 */
export function calculateEigenvalues<S>(
  A: Matrix<S>,
  numIterations: number = 30,
  throwOnFailure: boolean = true
): Vector<S> {
  let n = 0;
  let nthA = A;

  // TODO - check for earlier convergence
  while (n < numIterations) {
    const { Q, R } = calculateQRDecomposition(nthA);
    n++;
    nthA = R.multiply(Q);
  }

  if (throwOnFailure && !isUpperTriangular(nthA)) {
    throw Error('TODO - failed to converge');
  }

  return nthA.getDiagonal();
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
    throw Error('TODO - lambda is not an eigenvalue of A');
  }
}
