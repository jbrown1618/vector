import { Vector } from '../../types/vector/Vector';
import { CostFunction, LearningAlgorithm } from './LearningAlgorithm';

/**
 * The parameters for {@link gradientDescent}
 * @public
 */
export type GradientDescentParameters = {
  alpha: number;
  maxIterations?: number;
};

/**
 * Learns an optimal set of parameters `theta` using gradient descent
 *
 * @param parameters - The {@link GradientDescentParameters} which determine how the learning will run
 *
 * @public
 */
export function gradientDescent(parameters: Partial<GradientDescentParameters>): LearningAlgorithm {
  const { alpha = 0.1, maxIterations = 10000 } = parameters;

  return function(initialTheta: Vector<number>, costFn: CostFunction) {
    let theta = initialTheta;
    let i = 0;
    const zeros = theta.builder().zeros(theta.getDimension());

    while (i < maxIterations) {
      const { gradient } = costFn(theta);
      theta = theta.add(gradient.scalarMultiply(-alpha));

      if (gradient.equals(zeros)) break;

      i++;
    }

    return theta;
  };
}
