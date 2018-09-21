import { ScalarOperations } from './ScalarOperations';
import { ComplexNumber } from './ComplexNumber';

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

  getMultiplicativeInverse(scalar: ComplexNumber): ComplexNumber {
    return scalar.getMultiplicativeInverse();
  }

  multiply(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.multiply(second);
  }

  equals(first: ComplexNumber, second: ComplexNumber): boolean {
    return first.equals(second);
  }

  add(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.add(second);
  }
}
