import { approximatelyEqual, random, randomNormal } from '../../utilities/NumberUtilities';
import { ScalarOperations } from './ScalarOperations';
import { prettyPrint } from '../../utilities/prettyPrint';

/**
 * Implements the basic {@link ScalarOperations} on `number`s
 * @public
 */
export class NumberOperations extends ScalarOperations<number> {
  /**
   * {@inheritdoc ScalarOperations.fromNumber}
   */
  public fromNumber(num: number): number {
    return num;
  }

  /**
   * {@inheritdoc ScalarOperations.add}
   */
  public add(first: number, second: number): number {
    return first + second;
  }

  /**
   * {@inheritdoc ScalarOperations.conjugate}
   */
  public conjugate(scalar: number): number {
    return scalar;
  }

  /**
   * {@inheritdoc ScalarOperations.getAdditiveIdentity}
   */
  public getAdditiveIdentity(): number {
    return 0;
  }

  /**
   * {@inheritdoc ScalarOperations.getAdditiveInverse}
   */
  public getAdditiveInverse(x: number): number {
    return -1 * x;
  }

  /**
   * {@inheritdoc ScalarOperations.getMultiplicativeIdentity}
   */
  public getMultiplicativeIdentity(): number {
    return 1;
  }

  /**
   * {@inheritdoc ScalarOperations.getMultiplicativeInverse}
   */
  public getMultiplicativeInverse(x: number): number | undefined {
    if (x === 0) {
      return undefined;
    }
    return 1 / x;
  }

  /**
   * {@inheritdoc ScalarOperations.getPrincipalSquareRoot}
   */
  public getPrincipalSquareRoot(x: number): number | undefined {
    if (x < 0) return undefined;
    return Math.sqrt(x);
  }

  /**
   * {@inheritdoc ScalarOperations.norm}
   */
  public norm(x: number): number {
    return Math.abs(x);
  }

  /**
   * {@inheritdoc ScalarOperations.multiply}
   */
  public multiply(first: number, second: number): number {
    return first * second;
  }

  /**
   * {@inheritdoc ScalarOperations.equals}
   */
  public equals(first: number, second: number): boolean {
    return approximatelyEqual(first, second);
  }

  /**
   * {@inheritdoc ScalarOperations.random}
   */
  public random(min = 0, max = 1): number {
    return random(min, max);
  }

  /**
   * {@inheritdoc ScalarOperations.randomNormal}
   */
  public randomNormal(mean = 0, standardDeviation = 1): number {
    return randomNormal(mean, standardDeviation);
  }

  /**
   * {@inheritdoc ScalarOperations.prettyPrint}
   */
  public prettyPrint(x: number): string {
    return prettyPrint(x);
  }
}
