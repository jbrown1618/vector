import { Vector } from '../../types/vector/Vector';
import { CostFunction, LearningAlgorithm } from './LearningAlgorithm';

export interface GradientDescentParameters {
  alpha: number;
  maxIterations?: number;
}

export function gradientDescent(parameters: GradientDescentParameters): LearningAlgorithm {
  const { alpha, maxIterations = 10000 } = parameters;

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
