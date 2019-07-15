import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { ComplexVector } from '../vector/ComplexVector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { ArrayMatrix } from './ArrayMatrix';
import { MatrixConstructor, MatrixData } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';

/**
 * Implements {@link Matrix} as a 2-dimensional array of {@link ComplexNumber}s
 * @public
 */
@StaticImplements<MatrixConstructor<ComplexNumber, ComplexVector, ComplexMatrix>>()
export class ComplexMatrix extends ArrayMatrix<ComplexNumber> {
  public static ops(): ScalarOperations<ComplexNumber> {
    return new ComplexNumberOperations();
  }

  public static builder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return new MatrixBuilder(ComplexMatrix);
  }

  public static vectorBuilder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return new VectorBuilder(ComplexVector);
  }

  /**
   * @internal
   */
  constructor(data: MatrixData<ComplexNumber>) {
    super(data);
  }

  /**
   * {@inheritDoc ArrayMatrix.ops}
   */
  public ops(): ScalarOperations<ComplexNumber> {
    return ComplexMatrix.ops();
  }

  /**
   * {@inheritDoc ArrayMatrix.builder}
   */
  public builder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return ComplexMatrix.builder();
  }

  /**
   * {@inheritDoc ArrayMatrix.vectorBuilder}
   */
  public vectorBuilder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexMatrix.vectorBuilder();
  }
}
