import { StaticImplements } from '@lib/utilities/StaticImplements';
import { NumberOperations } from '@lib/types/scalar/NumberOperations';
import { SparseVector } from '@lib/types/vector/SparseVector';
import { VectorConstructor, VectorData } from '@lib/types/vector/Vector';
import { VectorBuilder } from '@lib/types/vector/VectorBuilder';
import { SparseNumberMatrix } from '@lib/types/matrix/SparseNumberMatrix';
import { MatrixBuilder } from '@lib/types/matrix/MatrixBuilder';
import { ScalarOperations } from '@lib/types/scalar/ScalarOperations';

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
