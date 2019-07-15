import { approximatelyEqual, random, randomNormal } from '../../utilities/NumberUtilities';
import { ScalarOperations } from './ScalarOperations';
import { prettyPrint } from '../../utilities/prettyPrint';

/**
 * @public
 */
export class NumberOperations extends ScalarOperations<number> {
  public fromNumber(num: number): number {
    return num;
  }

  public add(first: number, second: number): number {
    return first + second;
  }

  public conjugate(scalar: number): number {
    return scalar;
  }

  public getAdditiveIdentity(): number {
    return 0;
  }

  public getAdditiveInverse(x: number): number {
    return -1 * x;
  }

  public getMultiplicativeIdentity(): number {
    return 1;
  }

  public getMultiplicativeInverse(x: number): number | undefined {
    if (x === 0) {
      return undefined;
    }
    return 1 / x;
  }

  public getPrincipalSquareRoot(x: number): number {
    return Math.sqrt(x);
  }

  public norm(x: number): number {
    return Math.abs(x);
  }

  public multiply(first: number, second: number): number {
    return first * second;
  }

  public equals(first: number, second: number): boolean {
    return approximatelyEqual(first, second);
  }

  public random(min: number = 0, max: number = 1): number {
    return random(min, max);
  }

  public randomNormal(mean: number = 0, standardDeviation: number = 1): number {
    return randomNormal(mean, standardDeviation);
  }

  public prettyPrint(x: number): string {
    return prettyPrint(x);
  }
}
