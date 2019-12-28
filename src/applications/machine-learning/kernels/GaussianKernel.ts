import { euclideanNorm } from '@lib/operations/Norms';
import { RadialBasisFunction } from '@lib/applications/machine-learning/kernels//RadialBasisFunction';
import { Kernel } from '@lib/applications/machine-learning/kernels/Kernel';

export function GaussianKernel(sigmaSquared: number): Kernel {
  return RadialBasisFunction((v1, v2) => {
    const diff = euclideanNorm(v1.add(v2.scalarMultiply(-1)));
    const exponent = -(diff * diff) / (2 * sigmaSquared);
    return Math.exp(exponent);
  });
}
