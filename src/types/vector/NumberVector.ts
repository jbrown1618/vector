import { StaticImplements } from '../../utilities/StaticImplements';
import { VectorConstructor, VectorData } from './Vector';
import { ArrayVector } from './ArrayVector';
import { NumberOperations } from '../scalar/NumberOperations';
import { VectorBuilder } from './VectorBuilder';
import { NumberMatrix } from '../matrix/NumberMatrix';

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

  /**
   * @inheritdoc
   */
  ops(): NumberOperations {
    return NumberVector.ops();
  }

  /**
   * @inheritdoc
   */
  builder(): VectorBuilder<number, NumberVector> {
    return NumberVector.builder();
  }

  /**
   * @inheritdoc
   */
  matrixBuilder() {
    return NumberMatrix.builder();
  }

  constructor(data: VectorData<number>) {
    super(data);
  }
}
