import { Matrix } from '../Matrix';
import { VectorFactory } from './VectorFactory';
import { Vector } from '../Vector';

export class MatrixFactory {
  static identity(size: number): Matrix {
    if (size < 0) {
      throw Error();
    }

    const columns: Array<Vector> = [];
    for (let i = 0; i < size; i++) {
      columns.push(VectorFactory.elementaryVector(size, i));
    }
    return Matrix.fromColumnVectors(columns);
  }
}
