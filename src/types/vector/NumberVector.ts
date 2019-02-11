import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberMatrix } from '../matrix/NumberMatrix';
import { NumberOperations } from '../scalar/NumberOperations';
import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';

/**
 * A `Vector` implemented as an array of JS `number` primitives.
 */
@StaticImplements<VectorConstructor<number, NumberVector>>()
export class NumberVector extends ArrayVector<number> {
  public static ops(): NumberOperations {
    return new NumberOperations();
  }

  public static builder(): VectorBuilder<number, NumberVector> {
    return new VectorBuilder(NumberVector);
  }

  constructor(data: VectorData<number>) {
    super(data);
  }

  /**
   * @inheritdoc
   */
  public ops(): NumberOperations {
    return NumberVector.ops();
  }

  /**
   * @inheritdoc
   */
  public builder(): VectorBuilder<number, NumberVector> {
    return NumberVector.builder();
  }

  /**
   * @inheritdoc
   */
  public matrixBuilder() {
    return NumberMatrix.builder();
  }
}
