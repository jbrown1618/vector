import { ArrayVector } from './ArrayVector';
import { VectorData } from './Vector';
import { Matrix, MatrixData } from './Matrix';
import { NumberMatrix } from './NumberMatrix';

/**
 * A `Vector` implemented as an array of JS `number` primitives.
 */
export class NumberVector extends ArrayVector<number> {
  static fromData(data: VectorData<number>): NumberVector {
    return new NumberVector(data);
  }

  static fromValues(...args: VectorData<number>): NumberVector {
    return new NumberVector(args);
  }

  protected constructor(data: VectorData<number>) {
    super(data);
  }

  protected newFromData(data: VectorData<number>): ArrayVector<number> {
    return NumberVector.fromData(data);
  }

  protected makeMatrix(data: MatrixData<number>): Matrix<number> {
    return NumberMatrix.fromData(data);
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
