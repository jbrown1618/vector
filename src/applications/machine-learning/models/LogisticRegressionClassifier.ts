import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';
import { sigmoid } from '@lib/utilities/NumberUtilities';
import { GradientDescentClassifier } from '@lib/applications/machine-learning/models/GradientDescentClassifier';

/**
 * The set of hyperparameters for a {@link LogisticRegressionClassifier}
 * @public
 */
export interface LogisticRegressionHyperparams {
  /**
   * A number whose value influences the penalty for large coefficients.
   * Large values of `lambda` correspond to highly regularized models,
   * and correct for overfitting.
   * Small values of `lambda` correspond to highly biased models,
   * and correct for underfitting.
   */
  lambda: number;
}

/**
 * A {@link Classifier} model which uses logistic regression to predict a discrete target.
 * The optimal set of parameters is computed with gradient descent.
 * @public
 */
export class LogisticRegressionClassifier extends GradientDescentClassifier<
  LogisticRegressionHyperparams
> {
  /**
   * {@inheritDoc GradientDescentClassifier.makePredictions}
   */
  protected makePredictions(
    data: Matrix<number>,
    theta: Vector<number>,
    threshold?: number
  ): Vector<number> {
    const probabilities = this.makeProbabilityPredictions(data, theta);
    const vb = data.vectorBuilder();
    return vb.map(probabilities, p => (p > (threshold || 0.5) ? 1 : 0));
  }

  /**
   * {@inheritDoc GradientDescentClassifier.makeProbabilityPredictions}
   */
  protected makeProbabilityPredictions(
    data: Matrix<number>,
    theta: Vector<number>
  ): Vector<number> {
    const vb = data.vectorBuilder();
    return vb.map(this.augmentData(data).apply(theta), sigmoid);
  }

  /**
   * {@inheritDoc GradientDescentClassifier.calculateCost}
   */
  protected calculateCost(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): number {
    const { lambda } = this.getHyperParameters();
    const probabilities = this.makeProbabilityPredictions(data, theta);

    const costs = probabilities.builder().map(probabilities, (pred, i) => {
      const actual = target.getEntry(i);
      if (actual > 0.5) {
        // Event; actual === 1
        return -1 * Math.log(pred);
      } else {
        // Nonevent; actual === 0
        return -1 * Math.log(1 - pred);
      }
    });

    const meanCost =
      costs.toArray().reduce((prev, curr) => prev + curr, 0) / data.getNumberOfRows();

    const penalty: (x: number) => number = x => x * x;
    const paramSum = theta.toArray().reduce((prev, curr) => penalty(prev) + curr, 0);
    const regularizationTerm = (paramSum - penalty(theta.getEntry(0))) * lambda;

    return meanCost + regularizationTerm;
  }

  /**
   * {@inheritDoc GradientDescentClassifier.calculateGradient}
   */
  protected calculateGradient(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): Vector<number> {
    const m = data.getNumberOfRows();
    const { lambda } = this.getHyperParameters();

    const predictions = this.makeProbabilityPredictions(data, theta);
    const diff = predictions.add(target.scalarMultiply(-1));

    const gradientTerm = this.augmentData(data)
      .transpose()
      .apply(diff)
      .scalarMultiply(1 / m);

    const regularizationTerm = theta.scalarMultiply(lambda / m).set(0, 0);

    return gradientTerm.add(regularizationTerm);
  }

  private augmentData(data: Matrix<number>): Matrix<number> {
    const m = data.getNumberOfRows();
    const ones = data.builder().ones([m, 1]);
    return data.builder().augment(ones, data);
  }

  protected getDefaultHyperParameters(): LogisticRegressionHyperparams {
    return {
      lambda: 0
    };
  }
}
