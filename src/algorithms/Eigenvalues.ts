import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { isUpperTriangular } from '../utilities/MatrixProperties';
import { solveByGaussianElimination } from './GaussJordan';
import { SolutionType } from './LinearSolution';
import { calculateQRDecomposition } from './QRDecomposition';

// TODO - convert to an upper Hessenberg matrix to improve rate of convergence

export interface EigenPair<ScalarType> {
  eigenvalue: ScalarType;
  eigenvector: Vector<ScalarType>;
}

/**
 * Uses the QR algorithm to compute the eigenvalues and eigenvectors of a matrix `A`
 *
 * @param A - The matrix for which to compute eigenvalues
 * @param numIterations - The number of iterations to take
 * @param throwOnFailure - If true, an error will be thrown on a failure to converge.
 *     Otherwise, the result of the last iteration will be returned.
 * @returns An array of eigenvalue-eigenvalue pairs
 */
export function eig<ScalarType>(
  A: Matrix<ScalarType>,
  numIterations: number = 30,
  throwOnFailure: boolean = true
): EigenPair<ScalarType>[] {
  const eigenvalues = calculateEigenvalues(A, numIterations, throwOnFailure);
  return eigenvalues.getData().map(eigenvalue => {
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
 */
export function calculateEigenvalues<ScalarType>(
  A: Matrix<ScalarType>,
  numIterations: number = 30,
  throwOnFailure: boolean = true
): Vector<ScalarType> {
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
 */
export function getEigenvectorForEigenvalue<ScalarType>(
  A: Matrix<ScalarType>,
  lambda: ScalarType
): Vector<ScalarType> {
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
