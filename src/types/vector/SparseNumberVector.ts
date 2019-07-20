import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberOperations } from '../scalar/NumberOperations';
import { SparseVector } from './SparseVector';
import { VectorConstructor, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';
import { SparseNumberMatrix } from '../matrix/SparseNumberMatrix';
import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';

/**
 * A {@link Vector} implemented as a sparse set of JS `number` primitives keyed by their indices.
 * @public
 */
@StaticImplements<VectorConstructor<number, SparseNumberVector>>()
export class SparseNumberVector extends SparseVector<number> {
  public static ops(): ScalarOperations<number> {
    return new NumberOperations();
  }

  public static builder(): VectorBuilder<number, SparseNumberVector> {
    return new VectorBuilder(SparseNumberVector);
  }

  /**
   * @internal
   */
  constructor(data: VectorData<number>) {
    super(data);
  }

  /**
   * {@inheritDoc SparseVector.ops}
   */
  public ops(): ScalarOperations<number> {
    return SparseNumberVector.ops();
  }

  /**
   * {@inheritDoc SparseVector.builder}
   */
  public builder(): VectorBuilder<number, SparseNumberVector> {
    return SparseNumberVector.builder();
  }

  /**
   * {@inheritDoc SparseVector.matrixBuilder}
   */
  public matrixBuilder(): MatrixBuilder<number, SparseNumberVector, SparseNumberMatrix> {
    return SparseNumberMatrix.builder();
  }
}
