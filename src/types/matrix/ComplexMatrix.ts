import { StaticImplements } from '@lib/utilities/StaticImplements';
import { ComplexNumber } from '@lib/types/scalar/ComplexNumber';
import { ComplexNumberOperations } from '@lib/types/scalar/ComplexNumberOperations';
import { ComplexVector } from '@lib/types/vector/ComplexVector';
import { VectorBuilder } from '@lib/types/vector/VectorBuilder';
import { ArrayMatrix } from '@lib/types/matrix/ArrayMatrix';
import { MatrixConstructor, MatrixData } from '@lib/types/matrix/Matrix';
import { MatrixBuilder } from '@lib/types/matrix/MatrixBuilder';
import { ScalarOperations } from '@lib/types/scalar/ScalarOperations';

/**
 * A dense {@link Matrix} of {@link ComplexNumber}s, implemented as an {@link ArrayMatrix}
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
