import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';
import { Kernel } from '@lib/applications/machine-learning/kernels/Kernel';
import { LinearKernel } from '@lib/applications/machine-learning/kernels/LinearKernel';
import {
  GradientDescentParameters,
  gradientDescent
} from '@lib/applications/machine-learning/GradientDescent';
import { FloatVector } from '@lib/types/vector/FloatVector';
import { Classifier } from '@lib/applications/machine-learning/models/Classifier';

/**
 * The set of hyperparameters for a {@link SupportVectorMachineClassifier}
 * @public
 */
export type SupportVectorMachineHyperparams = GradientDescentParameters & {
  /**
   * A number whose value influences the penalty for large coefficients.
   * Small values of `C` correspond to highly regularized models,
   * and correct for overfitting.
   * Large values of `C` correspond to highly biased models,
   * and correct for underfitting.
   */
  C: number;

  /**
   * TODO: docs
   */
  kernel: Kernel;
};

/**
 * A {@link Classifier} model which uses logistic regression to predict a discrete target.
 * The optimal set of parameters is computed with gradient descent.
 * @public
 */
export class SupportVectorMachineClassifier implements Classifier<SupportVectorMachineHyperparams> {
  private readonly _hyperParameters: Readonly<Partial<SupportVectorMachineHyperparams>>;
  private _weights: Vector<number> | undefined;
  private _trainingData: Matrix<number> | undefined;

  constructor(hyperParameters: Partial<SupportVectorMachineHyperparams>) {
    this._hyperParameters = Object.freeze(hyperParameters);
  }

  public getParameters(): Vector<number> | undefined {
    return this._weights;
  }

  public train(data: Matrix<number>, target: Vector<number>): void {
    const { kernel } = this.getHyperParameters();

    this._trainingData = data;
    const X = kernel(data, this._trainingData);

    const initialWeights = FloatVector.builder().random(X.getNumberOfColumns(), -0.01, 0.01);
    this._weights = gradientDescent(this._hyperParameters)(initialWeights, weights => ({
      cost: this.calculateCost(X, target, weights),
      gradient: this.calculateGradient(X, target, weights)
    }));
  }

  public predictProbabilities(_data: Matrix<number>): Vector<number> {
    throw Error(`Probability predictions not implemented for SVM Classifier`);
  }

  public predict(data: Matrix<number>): Vector<number> {
    if (!this._weights) throw new Error(`Cannot call predict before train`);

    const { kernel } = this.getHyperParameters();
    const X = kernel(data, this._trainingData);

    return this.makePredictions(X, this._weights);
  }

  public getHyperParameters(): SupportVectorMachineHyperparams {
    return {
      ...this.getDefaultHyperParameters(),
      ...this._hyperParameters
    };
  }

  private makePredictions(X: Matrix<number>, weights: Vector<number>): Vector<number> {
    const scores = this.calculateScores(X, weights);
    return scores.builder().map(scores, score => (score > 0 ? 1 : 0));
  }

  private calculateCost(
    X: Matrix<number>,
    target: Vector<number>,
    weights: Vector<number>
  ): number {
    const [m] = X.getShape();
    const scores = this.calculateScores(X, weights);
    const costs = scores.toArray().map((score, i) => {
      return cost(score, target.getEntry(i));
    });
    const totalCost = costs.reduce((prev, curr) => prev + curr, 0);
    return totalCost / m;
  }

  private calculateGradient(
    X: Matrix<number>,
    target: Vector<number>,
    weights: Vector<number>
  ): Vector<number> {
    const [m] = X.getShape();

    const scores = this.calculateScores(X, weights);
    const failsMarginCondition = scores.builder().fromArray(
      scores.toArray().map((score, i) => {
        return cost(score, target.getEntry(i)) > 0 ? 1 : 0;
      })
    );

    const unscaledGradient = X.transpose().apply(failsMarginCondition);
    return unscaledGradient.scalarMultiply(1 / m);
  }

  private calculateScores(X: Matrix<number>, weights: Vector<number>): Vector<number> {
    return X.apply(weights);
  }

  private getDefaultHyperParameters(): SupportVectorMachineHyperparams {
    return {
      C: 0,
      kernel: LinearKernel,
      alpha: 0.01
    };
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
