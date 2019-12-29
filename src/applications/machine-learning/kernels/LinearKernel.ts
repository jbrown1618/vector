import { Matrix } from '@lib/types/matrix/Matrix';

export function LinearKernel(data: Matrix<number>): Matrix<number> {
  const m = data.getNumberOfRows();
  const ones = data.builder().ones([m, 1]);
  return data.builder().augment(ones, data);
}
