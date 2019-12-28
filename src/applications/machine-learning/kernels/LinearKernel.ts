import { Matrix } from '@lib/types/matrix/Matrix';
import { Kernel } from '@lib/applications/machine-learning/kernels/Kernel';

export const LinearKernel: Kernel = (data: Matrix<number>) => data;
