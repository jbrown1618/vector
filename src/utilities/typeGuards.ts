import { Vector } from '../types/vector/Vector';
import { Matrix } from '../types/matrix/Matrix';

export function isVector<S>(vectorOrMatrix: Matrix<S> | Vector<S>): vectorOrMatrix is Vector<S> {
  return (vectorOrMatrix as any).matrixBuilder && !(vectorOrMatrix as any).vectorBuilder;
}
