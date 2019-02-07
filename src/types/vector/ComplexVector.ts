import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';
import { ComplexMatrix } from '../matrix/ComplexMatrix';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ArrayVector } from './ArrayVector';

/**
 * Implements `Vector` as an array of `ComplexNumber`s
 */
@StaticImplements<VectorConstructor<ComplexNumber, ComplexVector>>()
export class ComplexVector extends ArrayVector<ComplexNumber> {
  static ops(): ComplexNumberOperations {
    return new ComplexNumberOperations();
  }

  static builder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return new VectorBuilder(ComplexVector);
  }

  /**
   * @inheritdoc
   */
  ops(): ComplexNumberOperations {
    return ComplexVector.ops();
  }

  /**
   * @inheritdoc
   */
  builder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexVector.builder();
  }

  /**
   * @inheritdoc
   */
  matrixBuilder() {
    return ComplexMatrix.builder();
  }

  constructor(data: VectorData<ComplexNumber>) {
    super(data);
  }
}
