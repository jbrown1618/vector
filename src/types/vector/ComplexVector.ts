import { ArrayVector } from './ArrayVector';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { VectorConstructor, VectorData } from './Vector';
import { ComplexMatrix, VectorBuilder } from '../../index';
import { StaticImplements } from '../../utilities/StaticImplements';
import { ComplexNumberOperations } from '../scalar/ComplexNumberOperations';

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

  ops(): ComplexNumberOperations {
    return ComplexVector.ops();
  }

  builder(): VectorBuilder<ComplexNumber, ComplexVector> {
    return ComplexVector.builder();
  }

  matrixBuilder() {
    return ComplexMatrix.builder();
  }

  constructor(data: VectorData<ComplexNumber>) {
    super(data);
  }
}
