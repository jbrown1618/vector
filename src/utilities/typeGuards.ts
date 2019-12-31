import { Vector } from '../types/vector/Vector';
import { Matrix } from '../types/matrix/Matrix';

export function isVector<S>(xOrA: Matrix<S> | Vector<S>): xOrA is Vector<S> {
  return !(xOrA as any).vectorBuilder;
}
