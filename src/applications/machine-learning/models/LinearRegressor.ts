import { GradientDescentRegressor } from '@lib/applications/machine-learning/models/GradientDescentRegressor';
import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';

/**
 * The set of hyperparameters for a {@link LinearRegressor}
 * @public
 */
export interface LinearRegressorHyperparams {
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
 * A {@link Regressor} model which uses an ordinary least squares model with regularization to
 * predict a continuous target.
 * The optimal set of parameters is computed with gradient descent.
 * @public
 */
export class LinearRegressor extends GradientDescentRegressor<LinearRegressorHyperparams> {
  /**
   * Computes the predictions of a model with parameters `theta`
   *
   * @param data - The input data
   * @param theta - The model parameters
   *
   * @internal
   */
  protected makePredictions(data: Matrix<number>, theta: Vector<number>): Vector<number> {
    return this.augmentData(data).apply(theta);
  }

  /**
   * Computes the value of the cost function - in this case, a regularized mean squared error
   * with regularization.
   *
   * @param data - The input data
   * @param target - The true target values
   * @param theta - The model parameters
   *
   * @internal
   */
  protected calculateCost(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): number {
    const predictions = this.makePredictions(data, theta);
    const residuals = target.scalarMultiply(-1).add(predictions);
    const squaredResiduals = target.builder().map(residuals, entry => entry ** 2);
    const meanSquaredError =
      squaredResiduals.toArray().reduce((prev, curr) => prev + curr, 0) / data.getNumberOfRows();

    const paramSum = theta.toArray().reduce((prev, curr) => prev + curr, 0);
    const regularizationTerm = (paramSum - theta.getEntry(0)) * this._hyperParameters.lambda;

    return meanSquaredError + regularizationTerm;
  }

  /**
   * Computes the gradient of the cost function with respect to the parameters `theta`.
   *
   * @param data - The input data
   * @param target - The true target values
   * @param theta - The model parameters
   *
   * @internal
   */
  protected calculateGradient(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): Vector<number> {
    const m = data.getNumberOfRows();

    const predictions = this.makePredictions(data, theta);
    const residuals = target.scalarMultiply(-1).add(predictions);

    const gradientTerm = this.augmentData(data)
      .transpose()
      .apply(residuals)
      .scalarMultiply(1 / m);

    const regularizationTerm = theta.scalarMultiply(this._hyperParameters.lambda / m).set(0, 0);

    return gradientTerm.add(regularizationTerm);
  }

  private augmentData(data: Matrix<number>): Matrix<number> {
    const m = data.getNumberOfRows();
    const ones = data.builder().ones([m, 1]);
    return data.builder().augment(ones, data);
  }
}
