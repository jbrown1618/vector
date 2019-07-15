import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexMatrix } from '../matrix/ComplexMatrix';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';
import { MatrixBuilder } from '../matrix/MatrixBuilder';

/**
 * Implements `Vector` as an array of `ComplexNumber`s
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

  constructor(data: VectorData<ComplexNumber>) {
    super(data);
  }

  /**
   * {@inheritDoc TODO}
   */
  public ops(): ComplexNumberOperations {
    return ComplexVector.ops();
  }

  /**
   * {@inheritDoc TODO}
   */
  public builder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexVector.builder();
  }

  /**
   * {@inheritDoc TODO}
   */
  public matrixBuilder(): MatrixBuilder<ComplexNumber, ComplexVector, ComplexMatrix> {
    return ComplexMatrix.builder();
  }
}
