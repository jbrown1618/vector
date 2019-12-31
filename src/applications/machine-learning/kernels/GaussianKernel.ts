import { euclideanNorm } from '../../../operations/Norms';
import { Vector } from '../../../types/vector/Vector';
import { RadialBasisFunction } from './RadialBasisFunction';
import { Kernel } from './Kernel';

/**
 * Creates a gaussian {@link Kernel} for use in a {@link SupportVectorMachineClassifier}.
 * The gaussian kernel converts a data {@link Matrix} into a similarity `Matrix`
 * where the value of entry (i,j) expresses the similarity of rows i and j in
 * the original data set.
 *
 * @param sigmaSquared - The variance of the gaussian distribution used in the kernel
 *
 * @public
 */
export function GaussianKernel(sigmaSquared: number): Kernel {
  return RadialBasisFunction((v1, v2) => gaussianSimilarity(sigmaSquared, v1, v2));
}

/**
 * {@see SimilarityMetric}
 */
function gaussianSimilarity(sigmaSquared: number, v1: Vector<number>, v2: Vector<number>): number {
  const diff = euclideanNorm(v1.add(v2.scalarMultiply(-1)));
  return gaussian(diff, sigmaSquared);
}

function gaussian(x: number, variance: number): number {
  const exponent = -(x * x) / (2 * variance);
  return Math.exp(exponent);
}
