import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { ComplexVector } from '../vector/ComplexVector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { ArrayMatrix } from './ArrayMatrix';
import { MatrixConstructor, MatrixData } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';

/**
 * Implements `Matrix` as a 2-dimensional array of `ComplexNumber`s
 */
@StaticImplements<MatrixConstructor<ComplexNumber, ComplexVector, ComplexMatrix>>()
export class ComplexMatrix extends ArrayMatrix<ComplexNumber> {
  public static ops() {
    return new ComplexNumberOperations();
  }

  public static builder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return new MatrixBuilder(ComplexMatrix);
  }

  public static vectorBuilder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return new VectorBuilder(ComplexVector);
  }

  constructor(data: MatrixData<ComplexNumber>) {
    super(data);
  }

  /**
   * @inheritdoc
   */
  public ops() {
    return ComplexMatrix.ops();
  }

  /**
   * @inheritdoc
   */
  public builder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return ComplexMatrix.builder();
  }

  /**
   * @inheritdoc
   */
  public vectorBuilder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexMatrix.vectorBuilder();
  }
}
