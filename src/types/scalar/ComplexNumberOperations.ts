import { random, randomNormal } from '../../utilities/NumberUtilities';
import { ComplexNumber } from './ComplexNumber';
import { ScalarOperations } from './ScalarOperations';
import { prettyPrint } from '../../utilities/prettyPrint';

/**
 * Implements the basic {@link ScalarOperations} on {@link ComplexNumber}s
 * @public
 */
export class ComplexNumberOperations extends ScalarOperations<ComplexNumber> {
  /**
   * {@inheritdoc ScalarOperations.fromNumber}
   */
  public fromNumber(num: number): ComplexNumber {
    return new ComplexNumber(num, 0);
  }

  /**
   * {@inheritdoc ScalarOperations.fromComplex}
   */
  public fromComplex(real: number, imag: number): ComplexNumber {
    return new ComplexNumber(real, imag);
  }

  /**
   * {@inheritdoc ScalarOperations.conjugate}
   */
  public conjugate(scalar: ComplexNumber): ComplexNumber {
    return scalar.conjugate();
  }

  /**
   * {@inheritdoc ScalarOperations.getAdditiveIdentity}
   */
  public getAdditiveIdentity(): ComplexNumber {
    return ComplexNumber.ZERO;
  }

  /**
   * {@inheritdoc ScalarOperations.getAdditiveInverse}
   */
  public getAdditiveInverse(scalar: ComplexNumber): ComplexNumber {
    return scalar.getAdditiveInverse();
  }

  /**
   * {@inheritdoc ScalarOperations.getMultiplicativeIdentity}
   */
  public getMultiplicativeIdentity(): ComplexNumber {
    return ComplexNumber.ONE;
  }

  /**
   * {@inheritdoc ScalarOperations.getMultiplicativeInverse}
   */
  public getMultiplicativeInverse(scalar: ComplexNumber): ComplexNumber | undefined {
    return scalar.getMultiplicativeInverse();
  }

  /**
   * {@inheritdoc ScalarOperations.multiply}
   */
  public multiply(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.multiply(second);
  }

  /**
   * {@inheritdoc ScalarOperations.getPrincipalSquareRoot}
   */
  public getPrincipalSquareRoot(x: ComplexNumber): ComplexNumber {
    if (x.equals(ComplexNumber.ZERO)) {
      return ComplexNumber.ZERO;
    }

    const im = x.getImaginaryPart();
    const re = x.getRealPart();

    if (im === 0 && re >= 0) {
      return new ComplexNumber(Math.sqrt(re), 0);
    } else if (im === 0 && re < 0) {
      return new ComplexNumber(0, Math.sqrt(-re));
    }

    const r = Math.sqrt(Math.pow(re, 2) + Math.pow(im, 2));
    let theta = Math.atan(im / re);
    if (theta < 0) {
      theta = 2 * Math.PI + theta;
    }
    const rootR = Math.sqrt(r);

    const real = rootR * Math.cos(theta / 2);
    const imag = rootR * Math.sin(theta / 2);

    // As with real numbers, x^2 = y has two solutions for all complex y.
    // Unlike with real numbers, there is not really a standard for which
    // value we accept as the principal value for the square root function.
    // However, for our purposes (calculating vector norms), it is useful
    // to choose the value for which the real part is positive.
    if (real > 0) {
      return new ComplexNumber(real, imag);
    } else {
      return new ComplexNumber(-real, -imag);
    }
  }

  /**
   * {@inheritdoc ScalarOperations.norm}
   */
  public norm(x: ComplexNumber): number {
    const r = x.getRealPart();
    const i = x.getImaginaryPart();
    return Math.sqrt(r * r + i * i);
  }

  /**
   * {@inheritdoc ScalarOperations.equals}
   */
  public equals(first: ComplexNumber, second: ComplexNumber): boolean {
    return first.equals(second);
  }

  /**
   * {@inheritdoc ScalarOperations.add}
   */
  public add(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.add(second);
  }

  /**
   * {@inheritdoc ScalarOperations.random}
   */
  public random(min = 0, max = 1): ComplexNumber {
    return new ComplexNumber(random(min, max), random(min, max));
  }

  /**
   * {@inheritdoc ScalarOperations.randomNormal}
   */
  public randomNormal(mean = 0, standardDeviation = 1): ComplexNumber {
    return new ComplexNumber(
      randomNormal(mean, standardDeviation),
      randomNormal(mean, standardDeviation)
    );
  }

  /**
   * {@inheritdoc ScalarOperations.prettyPrint}
   */
  public prettyPrint(x: ComplexNumber): string {
    return `${prettyPrint(x.getRealPart())} + ${prettyPrint(x.getImaginaryPart())}i`;
  }
}
