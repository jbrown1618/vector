import { Vector } from '../../src/types/vector/Vector';
import { Matrix } from '../../src/types/matrix/Matrix';

export function roundMatrix(M: Matrix, decimals: number): Matrix {
  return M.map((x) => round(x, decimals));
}

export function roundVector(v: Vector, decimals: number): Vector {
  return v.map((x) => round(x, decimals));
}

export function round(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}
