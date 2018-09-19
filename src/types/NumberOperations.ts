import { ScalarOperations } from './ScalarOperations';

export class NumberOperations extends ScalarOperations<number> {
  add(first: number, second: number): number {
    return first + second;
  }

  conjugate(scalar: number): number {
    return scalar;
  }

  getAdditiveIdentity(): number {
    return 0;
  }

  getAdditiveInverse(x: number): number {
    return -1 * x;
  }

  getMultiplicativeIdentity(): number {
    return 1;
  }

  getMultiplicativeInverse(x: number): number {
    return 1 / x;
  }

  multiply(first: number, second: number): number {
    return first * second;
  }

  equals(first: number, second: number): boolean {
    return Math.abs(first - second) < 0.000001;
  }
}
