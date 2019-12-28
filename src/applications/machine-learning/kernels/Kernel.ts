import { Matrix } from '@lib/types/matrix/Matrix';

export type Kernel = (data: Matrix<number>, trainingData?: Matrix<number>) => Matrix<number>;
