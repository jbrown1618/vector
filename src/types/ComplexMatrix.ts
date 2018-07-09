import { ArrayMatrix } from './ArrayMatrix';
import { ComplexNumber } from './ComplexNumber';
import { Matrix, MatrixData } from './Matrix';
import { Vector, VectorData } from './Vector';
import { ComplexVector } from './ComplexVector';

export class ComplexMatrix extends ArrayMatrix<ComplexNumber> {
  constructor(data: MatrixData<ComplexNumber>) {
    super(data);
  }

  protected newFromData(data: MatrixData<ComplexNumber>): Matrix<ComplexNumber> {
    return new ComplexMatrix(data);
  }

  protected makeVector(vectorData: VectorData<ComplexNumber>): Vector<ComplexNumber> {
    return new ComplexVector(vectorData);
  }

  protected newFromColumnVectors(vectors: Array<Vector<ComplexNumber>>): Matrix<ComplexNumber> {
    const data: MatrixData<ComplexNumber> = [];
    vectors.forEach((vector, j) => {
      vector.getData().forEach((value, i) => {
        data[i] = data[i] || [];
        data[i][j] = value;
      });
    });
    return this.newFromData([]);
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
