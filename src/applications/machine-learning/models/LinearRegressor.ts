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
   * {@inheritDoc GradientDescentRegressor.makePredictions}
   */
  protected makePredictions(data: Matrix<number>, theta: Vector<number>): Vector<number> {
    return this.augmentData(data).apply(theta);
  }

  /**
   * {@inheritDoc GradientDescentRegressor.calculateCost}
   */
  protected calculateCost(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): number {
    const { lambda } = this.getHyperParameters();
    const predictions = this.makePredictions(data, theta);
    const residuals = target.scalarMultiply(-1).add(predictions);
    const squaredResiduals = target.builder().map(residuals, entry => entry ** 2);
    const meanSquaredError =
      squaredResiduals.toArray().reduce((prev, curr) => prev + curr, 0) / data.getNumberOfRows();

    const penalty: (x: number) => number = x => x * x;
    const paramSum = theta.toArray().reduce((prev, curr) => penalty(prev) + curr, 0);
    const regularizationTerm = (paramSum - theta.getEntry(0)) * lambda;

    return meanSquaredError + regularizationTerm;
  }

  /**
   * {@inheritDoc GradientDescentRegressor.calculateGradient}
   */
  protected calculateGradient(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): Vector<number> {
    const { lambda } = this.getHyperParameters();
    const m = data.getNumberOfRows();

    const predictions = this.makePredictions(data, theta);
    const residuals = target.scalarMultiply(-1).add(predictions);

    const gradientTerm = this.augmentData(data)
      .transpose()
      .apply(residuals)
      .scalarMultiply(1 / m);

    const regularizationTerm = theta.scalarMultiply(lambda / m).set(0, 0);

    return gradientTerm.add(regularizationTerm);
  }

  private augmentData(data: Matrix<number>): Matrix<number> {
    const m = data.getNumberOfRows();
    const ones = data.builder().ones([m, 1]);
    return data.builder().augment(ones, data);
  }

  protected getDefaultHyperParameters(): LinearRegressorHyperparams {
    return {
      lambda: 0
    };
  }
}
