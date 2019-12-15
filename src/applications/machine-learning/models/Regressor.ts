import { Matrix } from '@lib/types/matrix/Matrix';
import { Vector } from '@lib/types/vector/Vector';

export interface Regressor {
  train(data: Matrix<number>, target: Vector<number>): void;
  predict(data: Matrix<number>): Vector<number>;
}
