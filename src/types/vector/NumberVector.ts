import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberMatrix } from '../matrix/NumberMatrix';
import { NumberOperations } from '../scalar/NumberOperations';
import { ArrayVector } from './ArrayVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';
import { MatrixBuilder } from '../matrix/MatrixBuilder';

/**
 * A dense {@link Vector} of `number`s implemented as a {@link ArrayVector}
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

  /**
   * @internal
   */
  constructor(data: VectorData<number>) {
    super(data);
  }

  /**
   * {@inheritDoc ArrayVector.ops}
   */
  public ops(): NumberOperations {
    return NumberVector.ops();
  }

  /**
   * {@inheritDoc ArrayVector.builder}
   */
  public builder(): VectorBuilder<number, NumberVector> {
    return NumberVector.builder();
  }

  /**
   * {@inheritDoc ArrayVector.matrixBuilder}
   */
  public matrixBuilder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return NumberMatrix.builder();
  }
}
