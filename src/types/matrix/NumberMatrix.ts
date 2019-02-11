import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberOperations } from '../scalar/NumberOperations';
import { NumberVector } from '../vector/NumberVector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { ArrayMatrix } from './ArrayMatrix';
import { MatrixConstructor, MatrixData } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';

/**
 * A `Matrix` implemented as a 2-dimensional array of JS `number` primitives
 */
@StaticImplements<MatrixConstructor<number, NumberVector, NumberMatrix>>()
export class NumberMatrix extends ArrayMatrix<number> {
  public static ops() {
    return new NumberOperations();
  }

  public static builder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return new MatrixBuilder(NumberMatrix);
  }

  public static vectorBuilder(): VectorBuilder<number, NumberVector> {
    return new VectorBuilder(NumberVector);
  }

  constructor(data: MatrixData<number>) {
    super(data);
  }

  /**
   * @inheritdoc
   */
  public ops() {
    return NumberMatrix.ops();
  }

  /**
   * @inheritdoc
   */
  public builder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return NumberMatrix.builder();
  }

  /**
   * @inheritdoc
   */
  public vectorBuilder(): VectorBuilder<number, NumberVector> {
    return NumberMatrix.vectorBuilder();
  }
}
