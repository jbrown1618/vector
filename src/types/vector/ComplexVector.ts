import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexMatrix } from '../matrix/ComplexMatrix';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';

/**
 * Implements `Vector` as an array of `ComplexNumber`s
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
   * @inheritdoc
   */
  public ops(): ComplexNumberOperations {
    return ComplexVector.ops();
  }

  /**
   * @inheritdoc
   */
  public builder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexVector.builder();
  }

  /**
   * @inheritdoc
   */
  public matrixBuilder() {
    return ComplexMatrix.builder();
  }
}
