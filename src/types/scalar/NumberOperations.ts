import { ScalarOperations } from './ScalarOperations';
import { approximatelyEqual } from '../../utilities/NumberUtilities';

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

  getMultiplicativeInverse(x: number): number | undefined {
    if (x === 0) {
      return undefined;
    }
    return 1 / x;
  }

  getPrincipalSquareRoot(x: number): number {
    return Math.sqrt(x);
  }

  multiply(first: number, second: number): number {
    return first * second;
  }

  equals(first: number, second: number): boolean {
    return approximatelyEqual(first, second);
  }
}
