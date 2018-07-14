import { ArrayMatrix } from './ArrayMatrix';
import { Matrix, MatrixData } from './Matrix';
import { Vector, VectorData } from './Vector';
import { NumberVector } from './NumberVector';
import { assertHomogeneous, assertRectangular } from '../utilities/ErrorAssertions';

/**
 * A `Matrix` implemented as a 2-dimensional array of JS `number` primitives
 */
export class NumberMatrix extends ArrayMatrix<number> {
  static fromData(data: MatrixData<number>): NumberMatrix {
    return new NumberMatrix(data);
  }

  static fromColumnVectors(vectors: Array<Vector<number>>): NumberMatrix {
    assertHomogeneous(vectors);
    const data: MatrixData<number> = [];
    vectors.forEach((vector, j) => {
      vector.getData().forEach((value, i) => {
        data[i] = data[i] || [];
        data[i][j] = value;
      });
    });
    return new NumberMatrix(data);
  }

  static fromRowVectors(vectors: Array<Vector<number>>): NumberMatrix {
    assertHomogeneous(vectors);
    return new NumberMatrix(vectors.map(v => v.getData()));
  }

  protected constructor(data: MatrixData<number>) {
    let allRowsEmpty = true;
    data.forEach(row => {
      if (row.length !== 0) {
        allRowsEmpty = false;
      }
    });
    if (allRowsEmpty) {
      data = [];
    }

    assertRectangular(data);
    super(data);
  }

  protected newFromData(data: MatrixData<number>): Matrix<number> {
    return new NumberMatrix(data);
  }

  protected makeVector(vectorData: VectorData<number>): Vector<number> {
    return NumberVector.fromData(vectorData);
  }

  protected newFromColumnVectors(vectors: Array<Vector<number>>): Matrix<number> {
    return NumberMatrix.fromColumnVectors(vectors);
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
