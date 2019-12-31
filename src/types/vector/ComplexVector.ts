import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexMatrix } from '../matrix/ComplexMatrix';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';
import { MatrixBuilder } from '../matrix/MatrixBuilder';

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
