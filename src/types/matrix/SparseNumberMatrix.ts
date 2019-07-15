import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberOperations } from '../scalar/NumberOperations';
import { SparseNumberVector } from '../vector/SparseNumberVector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { MatrixConstructor, MatrixData } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';
import { SparseMatrix } from './SparseMatrix';
import { ScalarOperations } from '../scalar/ScalarOperations';

/**
 * A `Matrix` implemented as a sparse set of JS `number` primitives keyed by their indices.
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

  constructor(data: MatrixData<number>) {
    super(data);
  }

  /**
   * {@inheritDoc TODO}
   */
  public ops(): ScalarOperations<number> {
    return SparseNumberMatrix.ops();
  }

  /**
   * {@inheritDoc TODO}
   */
  public builder(): MatrixBuilder<number, SparseNumberVector, SparseNumberMatrix> {
    return SparseNumberMatrix.builder();
  }

  /**
   * {@inheritDoc TODO}
   */
  public vectorBuilder(): VectorBuilder<number, SparseNumberVector> {
    return SparseNumberMatrix.vectorBuilder();
  }
}
