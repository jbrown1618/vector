import { ArrayVector } from './ArrayVector';
import { ComplexNumber } from './ComplexNumber';
import { VectorData } from './Vector';
import { Matrix, MatrixData } from './Matrix';
import { ComplexMatrix } from './ComplexMatrix';

/**
 * Implements `Vector` as an array of `ComplexNumber`s
 */
export class ComplexVector extends ArrayVector<ComplexNumber> {
  constructor(data: VectorData<ComplexNumber>) {
    super(data);
  }

  protected newFromData(data: VectorData<ComplexNumber>): ArrayVector<ComplexNumber> {
    return new ComplexVector(data);
  }

  protected makeMatrix(data: MatrixData<ComplexNumber>): Matrix<ComplexNumber> {
    return new ComplexMatrix(data);
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
