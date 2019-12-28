import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';
import { Kernel } from '@lib/applications/machine-learning/kernels/Kernel';
import { LinearKernel } from '@lib/applications/machine-learning/kernels/LinearKernel';
import { GradientDescentClassifier } from '@lib/applications/machine-learning/models/GradientDescentClassifier';

/**
 * The set of hyperparameters for a {@link SupportVectorMachineClassifier}
 * @public
 */
export interface SupportVectorMachineHyperparams {
  /**
   * A number whose value influences the penalty for large coefficients.
   * Small values of `C` correspond to highly regularized models,
   * and correct for overfitting.
   * Large values of `C` correspond to highly biased models,
   * and correct for underfitting.
   */
  C: number;

  kernel: Kernel;
}

/**
 * A {@link Classifier} model which uses logistic regression to predict a discrete target.
 * The optimal set of parameters is computed with gradient descent.
 * @public
 */
export class SupportVectorMachineClassifier extends GradientDescentClassifier<
  SupportVectorMachineHyperparams
> {
  /**
   * {@inheritDoc GradientDescentClassifier.makePredictions}
   */
  protected makePredictions(data: Matrix<number>, theta: Vector<number>): Vector<number> {
    const xTheta = this.calculateScores(data, theta);
    return xTheta.builder().map(xTheta, val => (val > 0 ? 1 : 0));
  }

  /**
   * {@inheritDoc GradientDescentClassifier.makeProbabilityPredictions}
   */
  protected makeProbabilityPredictions(
    _data: Matrix<number>,
    _theta: Vector<number>
  ): Vector<number> {
    throw Error(`Probability predictions not implemented for SVM Classifier`);
  }

  /**
   * {@inheritDoc GradientDescentClassifier.calculateCost}
   */
  protected calculateCost(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): number {
    const [m] = data.getShape();
    const scores = this.calculateScores(data, theta);
    const costs = scores.toArray().map((dist, i) => {
      return cost(dist, target.getEntry(i));
    });
    const totalCost = costs.reduce((prev, curr) => prev + curr, 0);
    return totalCost / m;
  }

  /**
   * {@inheritDoc GradientDescentClassifier.calculateGradient}
   */
  protected calculateGradient(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): Vector<number> {
    const [m] = data.getShape();
    const { kernel } = this.getDefaultHyperParameters();
    const X = kernel(data);

    const scores = this.calculateScores(data, theta);
    const correct = scores.builder().fromArray(
      scores.toArray().map((dist, i) => {
        return cost(dist, target.getEntry(i)) > 0 ? 1 : 0;
      })
    );

    const unscaledGradient = X.transpose().apply(correct);
    return unscaledGradient.scalarMultiply(1 / m);
  }

  protected getDefaultHyperParameters(): SupportVectorMachineHyperparams {
    return {
      C: 0,
      kernel: LinearKernel
    };
  }

  private calculateScores(data: Matrix<number>, theta: Vector<number>): Vector<number> {
    const { kernel } = this.getDefaultHyperParameters();
    const X = kernel(data);
    return X.apply(theta);
  }
}

function cost(score: number, y: number): number {
  if (y > 0.5) {
    // y = 1
    return cost1(score);
  } else {
    return cost0(score);
  }
}

function cost0(score: number): number {
  if (score < -1) {
    // Decision is very correct
    return 0;
  } else {
    return 1 + score;
  }
}

function cost1(score: number): number {
  if (score > 1) {
    // Decision is very correct
    return 0;
  } else {
    return 1 - score;
  }
}
