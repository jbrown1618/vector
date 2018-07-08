import { ArrayVector } from './ArrayVector';
import { ComplexNumber } from './ComplexNumber';
import { VectorData } from './Vector';

export class ComplexVector extends ArrayVector<ComplexNumber> {
  constructor(data: VectorData<ComplexNumber>) {
    super(data);
  }

  protected newFromData(data: VectorData<ComplexNumber>): ArrayVector<ComplexNumber> {
    return new ComplexVector(data);
  }

  addScalars(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.add(second);
  }

  conjugateScalar(scalar: ComplexNumber): ComplexNumber {
    return scalar.conjugate();
  }

  getAdditiveIdentity(): ComplexNumber {
    return ComplexNumber.ZERO;
  }

  getMultiplicativeIdentity(): ComplexNumber {
    return ComplexNumber.ONE;
  }

  multiplyScalars(first: ComplexNumber, second: ComplexNumber): ComplexNumber {
    return first.multiply(second);
  }

  scalarsEqual(first: ComplexNumber, second: ComplexNumber): boolean {
    return first.equals(second);
  }
}
