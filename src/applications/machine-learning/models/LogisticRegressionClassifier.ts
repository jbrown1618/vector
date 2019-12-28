import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';
import { sigmoid } from '@lib/utilities/NumberUtilities';
import {
  GradientDescentParameters,
  gradientDescent
} from '@lib/applications/machine-learning/GradientDescent';
import { Classifier } from '@lib/applications/machine-learning/models/Classifier';
import { FloatVector } from '@lib/types/vector/FloatVector';

/**
 * The set of hyperparameters for a {@link LogisticRegressionClassifier}
 * @public
 */
export type LogisticRegressionHyperparams = GradientDescentParameters & {
  /**
   * A number whose value influences the penalty for large coefficients.
   * Large values of `lambda` correspond to highly regularized models,
   * and correct for overfitting.
   * Small values of `lambda` correspond to highly biased models,
   * and correct for underfitting.
   */
  lambda: number;
};

/**
 * A {@link Classifier} model which uses logistic regression to predict a discrete target.
 * The optimal set of parameters is computed with gradient descent.
 * @public
 */
export class LogisticRegressionClassifier implements Classifier<LogisticRegressionHyperparams> {
  private readonly _hyperParameters: Readonly<Partial<LogisticRegressionHyperparams>>;
  private _theta: Vector<number> | undefined;

  constructor(hyperParameters: Partial<LogisticRegressionHyperparams>) {
    this._hyperParameters = Object.freeze(hyperParameters);
    this._theta = undefined;
  }

  public getParameters(): Vector<number> | undefined {
    return this._theta;
  }

  public getHyperParameters(): LogisticRegressionHyperparams {
    return {
      ...this.getDefaultHyperParameters(),
      ...this._hyperParameters
    };
  }

  public train(data: Matrix<number>, target: Vector<number>): void {
    const initialTheta = FloatVector.builder().random(data.getNumberOfColumns() + 1, -0.01, 0.01);
    this._theta = gradientDescent(this._hyperParameters)(initialTheta, theta => ({
      cost: this.calculateCost(data, target, theta),
      gradient: this.calculateGradient(data, target, theta)
    }));
  }

  public predictProbabilities(data: Matrix<number>): Vector<number> {
    if (!this._theta) throw new Error(`Cannot call predictProbabilities before train`);
    return this.makeProbabilityPredictions(data, this._theta);
  }

  public predict(data: Matrix<number>): Vector<number> {
    if (!this._theta) throw new Error(`Cannot call predict before train`);
    return this.makePredictions(data, this._theta);
  }

  private makePredictions(
    data: Matrix<number>,
    theta: Vector<number>,
    threshold?: number
  ): Vector<number> {
    const probabilities = this.makeProbabilityPredictions(data, theta);
    const vb = data.vectorBuilder();
    return vb.map(probabilities, p => (p > (threshold || 0.5) ? 1 : 0));
  }

  private makeProbabilityPredictions(data: Matrix<number>, theta: Vector<number>): Vector<number> {
    const vb = data.vectorBuilder();
    return vb.map(this.augmentData(data).apply(theta), sigmoid);
  }

  private calculateCost(
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
  private calculateGradient(
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

  private getDefaultHyperParameters(): LogisticRegressionHyperparams {
    return {
      lambda: 0,
      alpha: 0.01
    };
  }
}
