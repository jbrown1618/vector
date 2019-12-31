import { Matrix } from '../../../types/matrix/Matrix';
import { Vector } from '../../../types/vector/Vector';
import { FloatVector } from '../../../types/vector/FloatVector';
import { Regressor } from './Regressor';
import { GradientDescentParameters, gradientDescent } from '../GradientDescent';
import { LinearKernel } from '../kernels/LinearKernel';

/**
 * The set of hyperparameters for a {@link LinearRegressor}
 * @public
 */
export type LinearRegressorHyperparams = GradientDescentParameters & {
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
 * A {@link Regressor} model which uses an ordinary least squares model with regularization to
 * predict a continuous target.
 * The optimal set of parameters is computed with gradient descent.
 * @public
 */
export class LinearRegressor implements Regressor<LinearRegressorHyperparams> {
  private readonly _hyperParameters: Readonly<Partial<LinearRegressorHyperparams>>;
  private _theta: Vector<number> | undefined;

  constructor(hyperParameters: Partial<LinearRegressorHyperparams>) {
    this._hyperParameters = Object.freeze(hyperParameters);
    this._theta = undefined;
  }

  /**
   * Get the coefficients of the trained linear regression model, or
   * `undefined` if the model has not been trained.
   * @public
   */
  public getParameters(): Vector<number> | undefined {
    return this._theta;
  }

  /**
   * {@inheritDoc Regressor.getHyperParameters}
   */
  public getHyperParameters(): LinearRegressorHyperparams {
    return {
      ...this.getDefaultHyperParameters(),
      ...this._hyperParameters
    };
  }

  /**
   * {@inheritDoc Regressor.train}
   */
  public train(data: Matrix<number>, target: Vector<number>): void {
    const initialTheta = FloatVector.builder().random(data.getNumberOfColumns() + 1, -0.01, 0.01);
    this._theta = gradientDescent(this._hyperParameters)(initialTheta, theta => ({
      cost: this.calculateCost(data, target, theta),
      gradient: this.calculateGradient(data, target, theta)
    }));
  }

  /**
   * {@inheritDoc Regressor.predict}
   */
  public predict(data: Matrix<number>): Vector<number> {
    if (!this._theta) throw new Error(`Cannot call predict before train`);
    return this.makePredictions(data, this._theta);
  }

  private calculateCost(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): number {
    const { lambda } = this.getHyperParameters();
    const predictions = this.makePredictions(data, theta);
    const residuals = target.scalarMultiply(-1).add(predictions);
    const squaredResiduals = residuals.map(entry => entry ** 2);
    const meanSquaredError =
      squaredResiduals.toArray().reduce((prev, curr) => prev + curr, 0) / data.getNumberOfRows();

    const penalty: (x: number) => number = x => x * x;
    const paramSum = theta.toArray().reduce((prev, curr) => penalty(prev) + curr, 0);
    const regularizationTerm = (paramSum - theta.getEntry(0)) * lambda;

    return meanSquaredError + regularizationTerm;
  }

  private calculateGradient(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): Vector<number> {
    const { lambda } = this.getHyperParameters();
    const m = data.getNumberOfRows();

    const predictions = this.makePredictions(data, theta);
    const residuals = target.scalarMultiply(-1).add(predictions);

    const gradientTerm = LinearKernel(data)
      .transpose()
      .apply(residuals)
      .scalarMultiply(1 / m);

    const regularizationTerm = theta.scalarMultiply(lambda / m).set(0, 0);

    return gradientTerm.add(regularizationTerm);
  }

  private makePredictions(data: Matrix<number>, theta: Vector<number>): Vector<number> {
    return LinearKernel(data).apply(theta);
  }

  private getDefaultHyperParameters(): LinearRegressorHyperparams {
    return {
      lambda: 0,
      alpha: 0.01
    };
  }
}
