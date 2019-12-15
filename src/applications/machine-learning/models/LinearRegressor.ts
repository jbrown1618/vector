import { GradientDescentRegressor } from './GradientDescentRegressor';
import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';

export interface LinearRegressorHyperparams {
  lambda: number;
}

export class LinearRegressor extends GradientDescentRegressor<LinearRegressorHyperparams> {
  protected makePredictions(data: Matrix<number>, theta: Vector<number>): Vector<number> {
    return this.augmentData(data).apply(theta);
  }

  protected calculateCost(
    data: Matrix<number>,
    target: Vector<number>,
    theta: Vector<number>
  ): number {
    const predictions = this.makePredictions(data, theta);
    const residuals = target.scalarMultiply(-1).add(predictions);
    const squaredResiduals = target.builder().map(residuals, entry => entry ** 2);
    const meanSquaredError = squaredResiduals.toArray().reduce((prev, curr) => prev + curr, 0);

    const paramSum = theta.toArray().reduce((prev, curr) => prev + curr, 0);
    const regularizationTerm = (paramSum - theta.getEntry(0)) * this._hyperParameters.lambda;

    return meanSquaredError / data.getNumberOfRows() + regularizationTerm;
  }

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
    const ones = data.builder().ones(m, 1);
    return data.builder().augment(ones, data);
  }
}
