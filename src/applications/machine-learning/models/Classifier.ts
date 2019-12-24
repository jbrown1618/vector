import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';

/**
 * A machine learning model with a continuous numeric target
 * @public
 */
export interface Classifier {
  /**
   * Learns the optimal set of parameters for the model.
   *
   * @param data - A {@link Matrix} whose rows are the individual observations in the training set
   * @param target - A {@link Vector} whose entries are the target values in the training set
   * @public
   */
  train(data: Matrix<number>, target: Vector<number>): void;

  /**
   * Uses the learned parameters to make predictions for the probability of an event
   * based on a set of input data.
   *
   * @remarks
   * Must be called after {@link Classifier.train}
   *
   * @param data - A {@link Vector} whose rows are the observations in the test set
   * @public
   */
  predictProbabilities(data: Matrix<number>): Vector<number>;

  /**
   * Uses the learned parameters to make predictions based on a set of input data.
   *
   * @remarks
   * Must be called after {@link Classifier.train}
   *
   * @param data - A {@link Vector} whose rows are the observations in the test set
   * @param pThreshold - The probability threshold above which an event will be predicted
   * @public
   */
  predict(data: Matrix<number>, pThreshold: number): Vector<number>;
}
