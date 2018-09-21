import { ArrayMatrix } from './ArrayMatrix';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { MatrixConstructor, MatrixData } from './Matrix';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexVector, MatrixBuilder, VectorBuilder } from '../../index';

/**
 * Implements `Matrix` as a 2-dimensional array of `ComplexNumber`s
 */
@StaticImplements<MatrixConstructor<ComplexNumber, ComplexVector, ComplexMatrix>>()
export class ComplexMatrix extends ArrayMatrix<ComplexNumber> {
  static ops() {
    return new ComplexNumberOperations();
  }

  static builder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return new MatrixBuilder(ComplexMatrix);
  }

  static vectorBuilder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return new VectorBuilder(ComplexVector);
  }

  ops() {
    return ComplexMatrix.ops();
  }

  builder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return ComplexMatrix.builder();
  }

  vectorBuilder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexMatrix.vectorBuilder();
  }

  constructor(data: MatrixData<ComplexNumber>) {
    super(data);
  }
}
