import { Matrix } from '../../../types/matrix/Matrix';
import { Vector } from '../../../types/vector/Vector';
import { FloatVector } from '../../../types/vector/FloatVector';
import { Kernel } from '../kernels/Kernel';
import { LinearKernel } from '../kernels/LinearKernel';
import { GradientDescentParameters, gradientDescent } from '../GradientDescent';
import { Classifier } from './Classifier';

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
   * A {@link Kernel} which preprocess the data and enables nonlinear decision
   * boundaries.
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

  /**
   * Get the weights of the trained SVM, or
   * `undefined` if the model has not been trained.
   * @public
   */
  public getParameters(): Vector<number> | undefined {
    return this._weights;
  }

  /**
   * {@inheritDoc Classifier.train}
   */
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

  /**
   * {@inheritDoc Classifier.predictProbabilities}
   */
  public predictProbabilities(_data: Matrix<number>): Vector<number> {
    throw Error(`Probability predictions not implemented for SVM Classifier`);
  }

  /**
   * {@inheritDoc Classifier.predict}
   */
  public predict(data: Matrix<number>): Vector<number> {
    if (!this._weights) throw new Error(`Cannot call predict before train`);

    const { kernel } = this.getHyperParameters();
    const X = kernel(data, this._trainingData);

    return this.makePredictions(X, this._weights);
  }

  /**
   * {@inheritDoc Classifier.getHyperParameters}
   */
  public getHyperParameters(): SupportVectorMachineHyperparams {
    return {
      ...this.getDefaultHyperParameters(),
      ...this._hyperParameters
    };
  }

  private makePredictions(X: Matrix<number>, weights: Vector<number>): Vector<number> {
    const scores = this.calculateScores(X, weights);
    return scores.map(score => (score > 0 ? 1 : 0));
  }

  private calculateCost(
    X: Matrix<number>,
    target: Vector<number>,
    weights: Vector<number>
  ): number {
    const [m] = X.getShape();
    const scores = this.calculateScores(X, weights);
    const costs = scores.map((score, i) => {
      return cost(score, target.getEntry(i));
    });
    const totalCost = costs.toArray().reduce((prev, curr) => prev + curr, 0);
    return totalCost / m;
  }

  private calculateGradient(
    X: Matrix<number>,
    target: Vector<number>,
    weights: Vector<number>
  ): Vector<number> {
    const [m] = X.getShape();

    const scores = this.calculateScores(X, weights);

    // 0 indicates 0-cost; we exceed the margin on the correct side
    // 1 indicates a negative example which fails the margin condition
    // -1 indicates a positive example fails the margin condition
    //
    // TODO: This can be solved a lot more elegantly with a generic rather than
    // binary classifier.  This would allow us to have only 0 or 1 instead of this mess.
    const failsMarginCondition = scores.builder().fromArray(
      scores.toArray().map((score, i) => {
        const y = target.getEntry(i);
        const rowCost = cost(score, target.getEntry(i));

        if (rowCost === 0) return 0;

        return y === 0 ? 1 : -1;
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
