import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberMatrix } from '../matrix/NumberMatrix';
import { NumberOperations } from '../scalar/NumberOperations';
import { SparseVector } from './SparseVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';

/**
 * A `Vector` implemented as a sparse set of JS `number` primitives keyed by their indices.
 * @public
 */
@StaticImplements<VectorConstructor<number, SparseNumberVector>>()
export class SparseNumberVector extends SparseVector<number> {
  public static ops(): NumberOperations {
    return new NumberOperations();
  }

  public static builder(): VectorBuilder<number, SparseNumberVector> {
    return new VectorBuilder(SparseNumberVector);
  }

  constructor(data: VectorData<number>) {
    super(data);
  }

  /**
   * {@inheritDoc TODO}
   */
  public ops(): NumberOperations {
    return SparseNumberVector.ops();
  }

  /**
   * {@inheritDoc TODO}
   */
  public builder(): VectorBuilder<number, SparseNumberVector> {
    return SparseNumberVector.builder();
  }

  /**
   * {@inheritDoc TODO}
   */
  public matrixBuilder() {
    return NumberMatrix.builder();
  }
}
