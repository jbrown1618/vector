import { random, randomNormal } from '../../utilities/NumberUtilities';
import { ComplexNumber } from './ComplexNumber';
import { ScalarOperations } from './ScalarOperations';

export class ComplexNumberOperations extends ScalarOperations<ComplexNumber> {
  public fromNumber(num: number): ComplexNumber {
    return new ComplexNumber(num, 0);
  }

  public conjugate(scalar: ComplexNumber): ComplexNumber {
    return scalar.conjugate();
  }

  public getAdditiveIdentity(): ComplexNumber {
    return ComplexNumber.ZERO;
  }

  public getAdditiveInverse(scalar: ComplexNumber): ComplexNumber {
    return scalar.getAdditiveInverse();
  }

  public getMultiplicativeIdentity(): ComplexNumber {
    return ComplexNumber.ONE;
  }

  public getMultiplicativeInverse(scalar: ComplexNumber): ComplexNumber | undefined {
    return scalar.getMultiplicativeInverse();
  }

  public multiply(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.multiply(second);
  }

  public getPrincipalSquareRoot(x: ComplexNumber): ComplexNumber {
    if (x.equals(ComplexNumber.ZERO)) {
      return ComplexNumber.ZERO;
    }

    const r = Math.sqrt(Math.pow(x.getRealPart(), 2) + Math.pow(x.getImaginaryPart(), 2));
    let theta = Math.atan(x.getImaginaryPart() / x.getRealPart());
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

  public norm(x: ComplexNumber): number {
    const r = x.getRealPart();
    const i = x.getImaginaryPart();
    return Math.sqrt(r * r + i * i);
  }

  public equals(first: ComplexNumber, second: ComplexNumber): boolean {
    return first.equals(second);
  }

  public add(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.add(second);
  }

  public random(min: number = 0, max: number = 1): ComplexNumber {
    return new ComplexNumber(random(min, max), random(min, max));
  }

  public randomNormal(mean: number = 0, standardDeviation: number = 1): ComplexNumber {
    return new ComplexNumber(
      randomNormal(mean, standardDeviation),
      randomNormal(mean, standardDeviation)
    );
  }
}
