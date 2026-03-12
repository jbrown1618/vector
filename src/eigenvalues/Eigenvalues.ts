import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { isSquare } from '../utilities/MatrixProperties';
import { solveByGaussianElimination } from '../operations/GaussJordan';
import { SolutionType } from '../solvers/LinearSolution';
import { calculateQRDecomposition } from '../decompositions/QRDecomposition';

const defaultIterations = 100;
const convergenceThreshold = 1e-10;

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
  return eigenvalues.toArray().map((eigenvalue) => {
    const eigenvector = getEigenvectorForEigenvalue(A, eigenvalue);
    return { eigenvalue, eigenvector };
  });
}

/**
 * Uses the QR algorithm to compute the eigenvalues of a matrix `A`.
 *
 * @remarks
 * The QR algorithm iterates A_{k+1} = R_k * Q_k and terminates early
 * when all subdiagonal elements converge below a threshold.
 *
 * @param A - The matrix for which to compute eigenvalues
 * @param numIterations - The maximum number of QR iterations to take
 * @public
 */
export function calculateEigenvalues<S>(
  A: Matrix<S>,
  numIterations: number = defaultIterations,
): Vector<S> {
  if (!isSquare(A)) throw Error('Eigenvalues are only defined for square matrices');
  const ops = A.ops();
  const m = A.getNumberOfRows();
  if (m === 1) return A.getColumnVectors()[0];
  if (m === 2) return getTwoByTwoEigenvalues(A);

  let nthA = A;

  let n = 0;
  while (n < numIterations) {
    // Check convergence: all subdiagonal elements below threshold
    let converged = true;
    for (let i = 1; i < m; i++) {
      if (ops.norm(nthA.getEntry(i, i - 1)) > convergenceThreshold) {
        converged = false;
        break;
      }
    }
    if (converged) break;

    const { Q, R } = calculateQRDecomposition(nthA);
    nthA = R.multiply(Q);
    n++;
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

    // Either we failed to converge, or we are looking at a pair of complex eigenvalues
    const subMatrix = A.builder().slice(nthA, i, i, i + 2, i + 2);
    const subEigenvalues = getTwoByTwoEigenvalues(subMatrix);
    eigenvalues.push(subEigenvalues.getEntry(0));
    eigenvalues.push(subEigenvalues.getEntry(1));
    i++;
  }
  return A.vectorBuilder().fromArray(eigenvalues);
}

/**
 * Reduces a matrix to upper Hessenberg form using Householder reflections.
 * A matrix H is upper Hessenberg if H[i][j] = 0 for all i \> j + 1.
 * This is a similarity transformation (H = Q^T A Q), so eigenvalues are preserved.
 * @public
 */
export function reduceToHessenberg<S>(A: Matrix<S>): Matrix<S> {
  const ops = A.ops();
  const builder = A.builder();
  const n = A.getNumberOfRows();

  if (n <= 2) return A;

  // Work with a mutable copy for efficiency
  const H: S[][] = A.toArray().map((row) => [...row]);

  for (let k = 0; k < n - 2; k++) {
    const subLen = n - k - 1;

    // Extract x = H[k+1:n, k]
    const x: S[] = new Array(subLen);
    for (let i = 0; i < subLen; i++) {
      x[i] = H[k + 1 + i][k];
    }

    // Compute sigma = ||x||₂
    let sigmaSq = 0;
    for (let i = 0; i < subLen; i++) {
      const ni = ops.norm(x[i]);
      sigmaSq += ni * ni;
    }
    const sigma = Math.sqrt(sigmaSq);

    if (sigma === 0) continue;

    // Compute alpha = -(x₀/|x₀|)·σ to avoid catastrophic cancellation
    const x0Norm = ops.norm(x[0]);
    let alpha: S;
    if (x0Norm === 0) {
      alpha = ops.fromNumber(-sigma);
    } else {
      alpha = ops.multiply(x[0], ops.fromNumber(-sigma / x0Norm));
    }

    // v = x - alpha·e₁
    const v: S[] = new Array(subLen);
    v[0] = ops.subtract(x[0], alpha);
    for (let i = 1; i < subLen; i++) {
      v[i] = x[i];
    }

    // Compute v^H·v
    let vTv: S = ops.zero();
    for (let i = 0; i < subLen; i++) {
      vTv = ops.add(vTv, ops.multiply(ops.conjugate(v[i]), v[i]));
    }

    if (ops.norm(vTv) === 0) continue;

    const factor = ops.divide(ops.fromNumber(2), vTv);
    if (factor === undefined) continue;

    // Left multiply: H[k+1:n, :] -= factor·v·(v^H·H[k+1:n, :])
    for (let j = 0; j < n; j++) {
      let dot: S = ops.zero();
      for (let i = 0; i < subLen; i++) {
        dot = ops.add(dot, ops.multiply(ops.conjugate(v[i]), H[k + 1 + i][j]));
      }
      const scaled = ops.multiply(factor, dot);
      for (let i = 0; i < subLen; i++) {
        H[k + 1 + i][j] = ops.subtract(H[k + 1 + i][j], ops.multiply(v[i], scaled));
      }
    }

    // Right multiply: H[:, k+1:n] -= factor·(H[:, k+1:n]·v)·v^H
    for (let i = 0; i < n; i++) {
      let dot: S = ops.zero();
      for (let j = 0; j < subLen; j++) {
        dot = ops.add(dot, ops.multiply(H[i][k + 1 + j], v[j]));
      }
      const scaled = ops.multiply(factor, dot);
      for (let j = 0; j < subLen; j++) {
        H[i][k + 1 + j] = ops.subtract(H[i][k + 1 + j], ops.multiply(scaled, ops.conjugate(v[j])));
      }
    }
  }

  return builder.fromArray(H);
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
  const vectorBuilder = A.vectorBuilder();
  const ops = A.ops();
  const m = A.getNumberOfRows();

  const minusLambda = ops.multiply(lambda, ops.negativeOne());
  const minusLambdaI = builder.identity(A.getNumberOfColumns()).scalarMultiply(minusLambda);
  const aMinusLambdaI = A.add(minusLambdaI);
  const zero = vectorBuilder.zeros(m);

  const eigenvectorSolution = solveByGaussianElimination(aMinusLambdaI, zero);

  if (eigenvectorSolution.solutionType === SolutionType.OVERDETERMINED) {
    // Should never happen, since 0 is always a solution
    throw new Error(`Unexpected error: unable to find a solution to the eigenvector equation`);
  }

  // If zero is the only solution to the eigenvector equation,
  // then lambda was not an eigenvalue to begin with.
  if (
    eigenvectorSolution.solutionType === SolutionType.UNIQUE &&
    eigenvectorSolution.solution.equals(zero)
  ) {
    throw new Error(
      `Cannot find an eigenvector; ${lambda} is not an eigenvalue of the provided matrix`,
    );
  }

  return eigenvectorSolution.solution;
}
