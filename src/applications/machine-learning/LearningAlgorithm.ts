import { Vector } from '../../types/vector/Vector';

export interface Cost {
  cost: number;
  gradient: Vector<number>;
}

export type CostFunction = (theta: Vector<number>) => Cost;

export type LearningAlgorithm = (
  initialTheta: Vector<number>,
  costFn: CostFunction
) => Vector<number>;
