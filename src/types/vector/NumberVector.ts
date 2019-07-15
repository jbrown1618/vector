import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberMatrix } from '../matrix/NumberMatrix';
import { NumberOperations } from '../scalar/NumberOperations';
import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';
import { MatrixBuilder } from '../matrix/MatrixBuilder';

/**
 * A `Vector` implemented as an array of JS `number` primitives.
 * @public
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
   * {@inheritDoc TODO}
   */
  public ops(): NumberOperations {
    return NumberVector.ops();
  }

  /**
   * {@inheritDoc TODO}
   */
  public builder(): VectorBuilder<number, NumberVector> {
    return NumberVector.builder();
  }

  /**
   * {@inheritDoc TODO}
   */
  public matrixBuilder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return NumberMatrix.builder();
  }
}
