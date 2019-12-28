import { euclideanNorm } from '@lib/operations/Norms';
import { RadialBasisFunction } from '@lib/applications/machine-learning/kernels//RadialBasisFunction';
import { Kernel } from '@lib/applications/machine-learning/kernels/Kernel';
import { Vector } from '@lib/types/vector/Vector';

export function GaussianKernel(sigmaSquared: number): Kernel {
  return RadialBasisFunction((v1, v2) => gaussianSimilarity(sigmaSquared, v1, v2));
}

function gaussianSimilarity(sigmaSquared: number, v1: Vector<number>, v2: Vector<number>): number {
  const diff = euclideanNorm(v1.add(v2.scalarMultiply(-1)));
  const exponent = -(diff * diff) / (2 * sigmaSquared);
  return Math.exp(exponent);
}
