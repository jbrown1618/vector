import { StaticImplements } from '@lib/utilities/StaticImplements';
import { NumberOperations } from '@lib/types/scalar/NumberOperations';
import { SparseNumberVector } from '@lib/types/vector/SparseNumberVector';
import { VectorBuilder } from '@lib/types/vector/VectorBuilder';
import { MatrixConstructor, MatrixData } from '@lib/types/matrix/Matrix';
import { MatrixBuilder } from '@lib/types/matrix/MatrixBuilder';
import { SparseMatrix } from '@lib/types/matrix/SparseMatrix';
import { ScalarOperations } from '@lib/types/scalar/ScalarOperations';

/**
 * A {@link Matrix} implemented as a sparse set of JS `number` primitives keyed by their indices.
 * @public
 */
@StaticImplements<MatrixConstructor<number, SparseNumberVector, SparseNumberMatrix>>()
export class SparseNumberMatrix extends SparseMatrix<number> {
  public static ops(): ScalarOperations<number> {
    return new NumberOperations();
  }

  public static builder(): MatrixBuilder<number, SparseNumberVector, SparseNumberMatrix> {
    return new MatrixBuilder(SparseNumberMatrix);
  }

  public static vectorBuilder(): VectorBuilder<number, SparseNumberVector> {
    return new VectorBuilder(SparseNumberVector);
  }

  /**
   * @internal
   */
  constructor(data: MatrixData<number>) {
    super(data);
  }

  /**
   * {@inheritDoc SparseMatrix.ops}
   */
  public ops(): ScalarOperations<number> {
    return SparseNumberMatrix.ops();
  }

  /**
   * {@inheritDoc SparseMatrix.builder}
   */
  public builder(): MatrixBuilder<number, SparseNumberVector, SparseNumberMatrix> {
    return SparseNumberMatrix.builder();
  }

  /**
   * {@inheritDoc SparseMatrix.vectorBuilder}
   */
  public vectorBuilder(): VectorBuilder<number, SparseNumberVector> {
    return SparseNumberMatrix.vectorBuilder();
  }
}
