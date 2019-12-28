import { Matrix } from '@lib/types/matrix/Matrix';

export type Kernel = (data: Matrix<number>) => Matrix<number>;
