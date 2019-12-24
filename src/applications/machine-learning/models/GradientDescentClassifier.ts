import { Classifier } from '@lib/applications/machine-learning/models/Classifier';
import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';
import { NumberVector } from '@lib/types/vector/NumberVector';
import {
  gradientDescent,
  GradientDescentParameters
} from '@lib/applications/machine-learning/GradientDescent';
import { CostFunction } from '@lib/applications/machine-learning//LearningAlgorithm';

/**
 * An abstract class which implements {@link Classifier} for any model which can use gradient descent.
 * Only the calculation of the cost function and gradient is left to subclasses.
 * @internal
 */
export abstract class GradientDescentClassifier<H extends object> implements Classifier {
  protected readonly _hyperParameters: Readonly<Partial<H & GradientDescentParameters>>;
  protected _theta: Vector<number> | undefined;

  constructor(hyperParameters: Partial<H & GradientDescentParameters>) {
    this._hyperParameters = Object.freeze(hyperParameters);
    this._theta = undefined;
  }

  public getParameters(): Vector<number> | undefined {
    return this._theta;
  }

  public train(data: Matrix<number>, target: Vector<number>): void {
    const initialTheta = NumberVector.builder().random(data.getNumberOfColumns() + 1, -0.01, 0.01);
    this._theta = gradientDescent(this._hyperParameters)(
      initialTheta,
      this.getCostFunction(data, target)
    );
  }

  public predictProbabilities(data: Matrix<number>): Vector<number> {
    if (!this._theta) throw new Error(`Cannot call predictProbabilities before train`);
    return this.makePredictions(data, this._theta);
  }

  public predict(data: Matrix<number>, pThreshold = 0.5): Vector<number> {
    if (!this._theta) throw new Error(`Cannot call predict before train`);
    const probabilities = this.predictProbabilities(data);
    return probabilities.builder().map(probabilities, x => (x > pThreshold ? 1 : 0));
  }

  private getCostFunction(data: Matrix<number>, target: Vector<number>): CostFunction {
    return (theta: Vector<number>) => ({
      cost: this.calculateCost(data, target, theta),
      gradient: this.calculateGradient(data, target, theta)
    });
  }

  protected abstract makePredictions(data: Matrix<number>, theta: Vector<number>): Vector<number>;

  protected abstract calculateCost(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): number;

  protected abstract calculateGradient(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): Vector<number>;

  protected abstract getDefaultHyperParameters(): H;

  protected getHyperParameters(): H {
    return {
      ...this.getDefaultHyperParameters(),
      ...this._hyperParameters
    };
  }
}
