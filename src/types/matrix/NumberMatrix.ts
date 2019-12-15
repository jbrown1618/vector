import { StaticImplements } from '@lib/utilities/StaticImplements';
import { NumberOperations } from '@lib/types/scalar/NumberOperations';
import { NumberVector } from '@lib/types/vector/NumberVector';
import { VectorBuilder } from '@lib/types/vector/VectorBuilder';
import { ArrayMatrix } from './ArrayMatrix';
import { MatrixConstructor, MatrixData } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';
import { ScalarOperations } from '@lib/types/scalar/ScalarOperations';

/**
 * A dense matrix of JavaScript `number` primitives, implemented as an {@link ArrayMatrix}
 * @public
 */
@StaticImplements<MatrixConstructor<number, NumberVector, NumberMatrix>>()
export class NumberMatrix extends ArrayMatrix<number> {
  public static ops(): ScalarOperations<number> {
    return new NumberOperations();
  }

  public static builder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return new MatrixBuilder(NumberMatrix);
  }

  public static vectorBuilder(): VectorBuilder<number, NumberVector> {
    return new VectorBuilder(NumberVector);
  }

  /**
   * @internal
   */
  constructor(data: MatrixData<number>) {
    super(data);
  }

  /**
   * {@inheritDoc ArrayMatrix.ops}
   */
  public ops(): ScalarOperations<number> {
    return NumberMatrix.ops();
  }

  /**
   * {@inheritDoc ArrayMatrix.builder}
   */
  public builder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return NumberMatrix.builder();
  }

  /**
   * {@inheritDoc ArrayMatrix.vectorBuilder}
   */
  public vectorBuilder(): VectorBuilder<number, NumberVector> {
    return NumberMatrix.vectorBuilder();
  }
}
