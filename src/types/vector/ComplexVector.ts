import { StaticImplements } from '@lib/utilities/StaticImplements';
import { ComplexMatrix } from '@lib/types/matrix/ComplexMatrix';
import { ComplexNumber } from '@lib/types/scalar/ComplexNumber';
import { ComplexNumberOperations } from '@lib/types/scalar/ComplexNumberOperations';
import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';
import { MatrixBuilder } from '@lib/types/matrix/MatrixBuilder';

/**
 * A dense {@link Vector} of {@link ComplexNumber}s implemented as an {@link ArrayVector}
 * @public
 */
@StaticImplements<VectorConstructor<ComplexNumber, ComplexVector>>()
export class ComplexVector extends ArrayVector<ComplexNumber> {
  public static ops(): ComplexNumberOperations {
    return new ComplexNumberOperations();
  }

  public static builder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return new VectorBuilder(ComplexVector);
  }

  /**
   * @internal
   */
  constructor(data: VectorData<ComplexNumber>) {
    super(data);
  }

  /**
   * {@inheritDoc ArrayVector.ops}
   */
  public ops(): ComplexNumberOperations {
    return ComplexVector.ops();
  }

  /**
   * {@inheritDoc ArrayVector.builder}
   */
  public builder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexVector.builder();
  }

  /**
   * {@inheritDoc ArrayVector.matrixBuilder}
   */
  public matrixBuilder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return ComplexMatrix.builder();
  }
}
