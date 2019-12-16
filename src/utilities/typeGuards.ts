import { Vector } from '@lib/types/vector/Vector';
import { Matrix } from '@lib/types/matrix/Matrix';

export function isVector<S>(xOrA: Matrix<S> | Vector<S>): xOrA is Vector<S> {
  return !(xOrA as any).vectorBuilder;
}
