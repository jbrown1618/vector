import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { normalize, euclideanNorm } from '../operations/Norms';
import { rank } from '../operations/GaussJordan';

/**
 * The result of a Singular Value Decomposition
 * @public
 */
export interface SingularValueDecomposition<S> {
  U: Matrix<S>;
  Sigma: Matrix<S>;
  V: Matrix<S>;
}

interface SingularValueAndVectors<S> {
  u: Vector<S>;
  sigma: S;
  v: Vector<S>;
}

/**
 * Uses the Power Method to calculate the Singular Value Decomposition of a matrix `A`
 *
 * @remarks
 * A Singular Value Decomposition consists of orthogonal matrices `U` and `V`
 * and a diagonal matrix `Sigma` such that _USigmaV* = A_
 *
 * @param A - the matrix to decompose
 * @public
 */
export function calculateSingularValueDecomposition<S>(
  A: Matrix<S>
): SingularValueDecomposition<S> {
  const ops = A.ops();
  const builder = A.builder();
  const vectorBuilder = A.vectorBuilder();
  const r = rank(A);
  const uColumns: Vector<S>[] = [];
  const vColumns: Vector<S>[] = [];
  const singularValues: S[] = [];

  for (let i = 0; i < r; i++) {
    const { u, sigma, v } = getFirstSingularValue(A);
    uColumns.push(u);
    singularValues.push(sigma);
    vColumns.push(v);

    const delta = u
      .outerProduct(v)
      .scalarMultiply(sigma)
      .scalarMultiply(ops.negativeOne());
    A = A.add(delta);
  }

  const U = builder.fromColumnVectors(uColumns);
  const Sigma = builder.diagonal(vectorBuilder.fromArray(singularValues));
  const V = builder.fromColumnVectors(vColumns);

  return { U, Sigma, V };
}

function getFirstSingularValue<S>(A: Matrix<S>): SingularValueAndVectors<S> {
  const ops = A.ops();
  const vectorBuilder = A.vectorBuilder();

  const x0 = vectorBuilder.ones(A.getNumberOfColumns());
  const x = applyBToTheK(A, x0, 15); // TODO - what should k be?

  const v = normalize(x);
  if (v === undefined) throw new Error('Unexpectedly encountered 0-vector');

  const Av = A.apply(v);
  const sigma = ops.fromNumber(euclideanNorm(Av));
  const sigmaInverse = ops.getMultiplicativeInverse(sigma);
  if (sigmaInverse === undefined) throw new Error('Unexpectedly encountered singular value of 0');
  const u = Av.scalarMultiply(sigmaInverse);

  return { u, sigma, v };
}

function applyBToTheK<S>(A: Matrix<S>, x0: Vector<S>, k: number): Vector<S> {
  const At = A.adjoint();
  let x = x0;
  for (let i = 0; i < k; i++) {
    x = A.apply(x);
    x = At.apply(x);
  }
  return x;
}
