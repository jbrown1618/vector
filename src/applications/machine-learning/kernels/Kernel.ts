import { Matrix } from '../../../types/matrix/Matrix';

/**
 * A function which takes a {@link Matrix} of data
 * (and optionally another `Matrix` of data on which the kernel was trained)
 * and returns a new `Matrix` which will be used to train a machine learning model.
 *
 * Generally intended for use with a {@link SupportVectorMachineClassifier}.
 *
 * @public
 */
export type Kernel = (data: Matrix<number>, trainingData?: Matrix<number>) => Matrix<number>;
