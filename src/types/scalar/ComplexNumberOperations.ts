import { ScalarOperations } from './ScalarOperations';
import { ComplexNumber } from './ComplexNumber';
import { random, randomNormal } from '../../utilities/NumberUtilities';

export class ComplexNumberOperations extends ScalarOperations<ComplexNumber> {
  conjugate(scalar: ComplexNumber): ComplexNumber {
    return scalar.conjugate();
  }

  getAdditiveIdentity(): ComplexNumber {
    return ComplexNumber.ZERO;
  }

  getAdditiveInverse(scalar: ComplexNumber): ComplexNumber {
    return scalar.getAdditiveInverse();
  }

  getMultiplicativeIdentity(): ComplexNumber {
    return ComplexNumber.ONE;
  }

  getMultiplicativeInverse(scalar: ComplexNumber): ComplexNumber | undefined {
    return scalar.getMultiplicativeInverse();
  }

  multiply(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.multiply(second);
  }

  getPrincipalSquareRoot(x: ComplexNumber): ComplexNumber {
    const r = Math.sqrt(Math.pow(x.getRealPart(), 2) + Math.pow(x.getImaginaryPart(), 2));
    const theta = Math.atan(x.getImaginaryPart() / x.getRealPart());
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

  equals(first: ComplexNumber, second: ComplexNumber): boolean {
    return first.equals(second);
  }

  add(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.add(second);
  }

  random(min: number = 0, max: number = 1): ComplexNumber {
    return new ComplexNumber(random(min, max), random(min, max));
  }

  randomNormal(mean: number = 0, standardDeviation: number = 1): ComplexNumber {
    return new ComplexNumber(
      randomNormal(mean, standardDeviation),
      randomNormal(mean, standardDeviation)
    );
  }
}
