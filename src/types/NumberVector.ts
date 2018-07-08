import { ArrayVector } from './ArrayVector';
import { VectorData } from './Vector';

export class NumberVector extends ArrayVector<number> {
  constructor(data: VectorData<number>) {
    super(data);
  }

  protected newFromData(data: VectorData<number>): ArrayVector<number> {
    return new NumberVector(data);
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
