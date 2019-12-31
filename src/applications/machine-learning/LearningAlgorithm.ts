import { Vector } from '../../types/vector/Vector';

/**
 * The output of a cost function
 * @public
 */
export interface Cost {
  cost: number;
  gradient: Vector<number>;
}

/**
 * A function that evaluates the cost of a set of parameters `theta`
 * @public
 */
export type CostFunction = (theta: Vector<number>) => Cost;

/**
 * An function which, given an initial value of `theta` and a CostFunction,
 * will compute the optimal value of `theta`
 * @public
 */
export type LearningAlgorithm = (
  initialTheta: Vector<number>,
  costFn: CostFunction
) => Vector<number>;
