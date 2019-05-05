import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberOperations } from '../scalar/NumberOperations';
import { SparseNumberVector } from '../vector/SparseNumberVector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { MatrixConstructor, MatrixData } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';
import { SparseMatrix } from './SparseMatrix';

/**
 * A `Matrix` implemented as a sparse set of JS `number` primitives keyed by their indices.
 */
@StaticImplements<MatrixConstructor<number, SparseNumberVector, SparseNumberMatrix>>()
export class SparseNumberMatrix extends SparseMatrix<number> {
  public static ops() {
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
   * @inheritdoc
   */
  public ops() {
    return SparseNumberMatrix.ops();
  }

  /**
   * @inheritdoc
   */
  public builder(): MatrixBuilder<number, SparseNumberVector, SparseNumberMatrix> {
    return SparseNumberMatrix.builder();
  }

  /**
   * @inheritdoc
   */
  public vectorBuilder(): VectorBuilder<number, SparseNumberVector> {
    return SparseNumberMatrix.vectorBuilder();
  }
}
