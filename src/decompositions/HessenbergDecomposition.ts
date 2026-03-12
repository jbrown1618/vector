import { Matrix } from '../types/matrix/Matrix';

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
