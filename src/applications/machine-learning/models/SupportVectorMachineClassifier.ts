// import { Matrix } from '@lib/types/matrix/Matrix';
// import { Vector } from '@lib/types/vector/Vector';
// import { sigmoid } from '@lib/utilities/NumberUtilities';
// import { GradientDescentClassifier } from '@lib/applications/machine-learning/models/GradientDescentClassifier';

// /**
//  * The set of hyperparameters for a {@link SupportVectorMachineClassifier}
//  * @public
//  */
// export interface SupportVectorMachineHyperparams {
//   /**
//    * A number whose value influences the penalty for large coefficients.
//    * Small values of `C` correspond to highly regularized models,
//    * and correct for overfitting.
//    * Large values of `C` correspond to highly biased models,
//    * and correct for underfitting.
//    */
//   C: number;
// }

// /**
//  * A {@link Classifier} model which uses logistic regression to predict a discrete target.
//  * The optimal set of parameters is computed with gradient descent.
//  * @public
//  */
// export class SupportVectorMachineClassifier extends GradientDescentClassifier<
//   SupportVectorMachineHyperparams
// > {
//   /**
//    * Computes the predictions of a model with parameters `theta`
//    *
//    * @param data - The input data
//    * @param theta - The model parameters
//    *
//    * @internal
//    */
//   protected makePredictions(data: Matrix<number>, theta: Vector<number>): Vector<number> {
//     const vb = data.vectorBuilder();
//     return vb.map(this.augmentData(data).apply(theta), sigmoid);
//   }

//   /**
//    * Computes the value of the cost function - in this case, a regularized log loss.
//    *
//    * @param data - The input data
//    * @param target - The true target values
//    * @param theta - The model parameters
//    *
//    * @internal
//    */
//   protected calculateCost(
//     data: Matrix<number>,
//     target: Vector<number>,
//     theta: Vector<number>
//   ): number {
//     const { lambda } = this.getHyperParameters();
//     const predictions = this.makePredictions(data, theta);

//     const costs = predictions.builder().map(predictions, (pred, i) => {
//       const actual = target.getEntry(i);
//       if (actual > 0.5) {
//         // Event
//         return -1 * Math.log(pred);
//       } else {
//         // Nonevent
//         return -1 * Math.log(1 - pred);
//       }
//     });

//     const meanCost =
//       costs.toArray().reduce((prev, curr) => prev + curr, 0) / data.getNumberOfRows();

//     const penalty: (x: number) => number = x => x * x;
//     const paramSum = theta.toArray().reduce((prev, curr) => penalty(prev) + curr, 0);
//     const regularizationTerm = (paramSum - penalty(theta.getEntry(0))) * lambda;

//     return meanCost + regularizationTerm;
//   }

//   /**
//    * Computes the gradient of the cost function with respect to the parameters `theta`.
//    *
//    * @param data - The input data
//    * @param target - The true target values
//    * @param theta - The model parameters
//    *
//    * @internal
//    */
//   protected calculateGradient(
//     data: Matrix<number>,
//     target: Vector<number>,
//     theta: Vector<number>
//   ): Vector<number> {
//     const m = data.getNumberOfRows();
//     const { lambda } = this.getHyperParameters();

//     const predictions = this.makePredictions(data, theta);
//     const diff = predictions.add(target.scalarMultiply(-1));

//     const gradientTerm = this.augmentData(data)
//       .transpose()
//       .apply(diff)
//       .scalarMultiply(1 / m);

//     const regularizationTerm = theta.scalarMultiply(lambda / m).set(0, 0);

//     return gradientTerm.add(regularizationTerm);
//   }

//   private augmentData(data: Matrix<number>): Matrix<number> {
//     const m = data.getNumberOfRows();
//     const ones = data.builder().ones([m, 1]);
//     return data.builder().augment(ones, data);
//   }

//   protected getDefaultHyperParameters(): SupportVectorMachineHyperparams {
//     return {
//       C: 0
//     };
//   }
// }
