import { Vector } from '@lib/types/vector/Vector';
import { Matrix } from '@lib/types/matrix/Matrix';

export function roundMatrix(M: Matrix<number>, decimals: number): Matrix<number> {
  return M.map(x => round(x, decimals));
}

export function roundVector(v: Vector<number>, decimals: number): Vector<number> {
  return v.map(x => round(x, decimals));
}

export function round(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}
