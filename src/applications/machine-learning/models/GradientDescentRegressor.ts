import { Regressor } from '@lib/applications/machine-learning/models/Regressor';
import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';
import { NumberVector } from '@lib/types/vector/NumberVector';
import {
  gradientDescent,
  GradientDescentParameters
} from '@lib/applications/machine-learning/GradientDescent';
import { CostFunction } from '@lib/applications/machine-learning//LearningAlgorithm';

/**
 * An abstract class which implements {@link Regressor} for any model which can use gradient descent.
 * Only the calculation of the cost function and gradient is left to subclasses.
 * @internal
 */
export abstract class GradientDescentRegressor<H extends object> implements Regressor {
  protected readonly _hyperParameters: Readonly<H & GradientDescentParameters>;
  protected _theta: Vector<number> | undefined;

  constructor(hyperParameters: H & GradientDescentParameters) {
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

  public predict(data: Matrix<number>): Vector<number> {
    if (!this._theta) throw new Error(`Cannot call predict before train`);
    return this.makePredictions(data, this._theta);
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
}
