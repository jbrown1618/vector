import { ArrayMatrix } from './ArrayMatrix';
import { Matrix, MatrixData } from './Matrix';
import { Vector, VectorData } from './Vector';
import { NumberVector } from './NumberVector';

export class NumberMatrix extends ArrayMatrix<number> {
  constructor(data: MatrixData<number>) {
    super(data);
  }

  protected newFromData(data: MatrixData<number>): Matrix<number> {
    return new NumberMatrix(data);
  }

  protected makeVector(vectorData: VectorData<number>): Vector<number> {
    return new NumberVector(vectorData);
  }

  protected newFromColumnVectors(vectors: Array<Vector<number>>): Matrix<number> {
    const data: MatrixData<number> = [];
    vectors.forEach((vector, j) => {
      vector.getData().forEach((value, i) => {
        data[i] = data[i] || [];
        data[i][j] = value;
      });
    });
    return this.newFromData([]);
  }

  addScalars(first: number, second: number): number {
    return first + second;
  }

  conjugateScalar(scalar: number): number {
    return scalar;
  }

  getAdditiveIdentity(): number {
    return 0;
  }

  getMultiplicativeIdentity(): number {
    return 1;
  }

  multiplyScalars(first: number, second: number): number {
    return first * second;
  }

  scalarsEqual(first: number, second: number): boolean {
    return Math.abs(first - second) < 0.0000001;
  }
}
