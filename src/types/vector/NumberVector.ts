import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { NumberMatrix } from '../matrix/NumberMatrix';
import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberOperations } from '../scalar/NumberOperations';
import { VectorBuilder } from '../../index';

/**
 * A `Vector` implemented as an array of JS `number` primitives.
 */
@StaticImplements<VectorConstructor<number, NumberVector>>()
export class NumberVector extends ArrayVector<number> {
  static ops(): NumberOperations {
    return new NumberOperations();
  }

  static builder(): VectorBuilder<number, NumberVector> {
    return new VectorBuilder(NumberVector);
  }

  ops(): NumberOperations {
    return NumberVector.ops();
  }

  builder(): VectorBuilder<number, NumberVector> {
    return NumberVector.builder();
  }

  matrixBuilder() {
    return NumberMatrix.builder();
  }

  constructor(data: VectorData<number>) {
    super(data);
  }
}
