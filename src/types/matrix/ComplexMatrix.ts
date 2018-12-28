import { ArrayMatrix } from './ArrayMatrix';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { ComplexVector } from '../vector/ComplexVector';
import { MatrixBuilder } from './MatrixBuilder';
import { MatrixConstructor, MatrixData } from './Matrix';
import { StaticImplements } from '../../utilities/StaticImplements';
import { VectorBuilder } from '../vector/VectorBuilder';

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
