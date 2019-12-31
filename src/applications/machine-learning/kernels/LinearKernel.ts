import { Matrix } from '../../../types/matrix/Matrix';

/**
 * A linear kernel for use in a {@link SupportVectorMachineClassifier}.
 * The linear kernel converts a data {@link Matrix} into a matrix which
 * has been prepended with a column of all ones, representing the constant
 * term in a linear model, or the bias term in an SVM.
 *
 * @param data - The variance of the gaussian distribution used in the kernel
 *
 * @public
 */
export function LinearKernel(data: Matrix<number>): Matrix<number> {
  const m = data.getNumberOfRows();
  const ones = data.builder().ones([m, 1]);
  return data.builder().augment(ones, data);
}
