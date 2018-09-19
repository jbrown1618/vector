import { ArrayMatrix } from './ArrayMatrix';
import { MatrixConstructor, MatrixData } from './Matrix';
import { NumberOperations } from './NumberOperations';
import { StaticImplements } from '../utilities/StaticImplements';
import { MatrixBuilder, NumberVector, VectorBuilder } from '..';

/**
 * A `Matrix` implemented as a 2-dimensional array of JS `number` primitives
 */
@StaticImplements<MatrixConstructor<number, NumberVector, NumberMatrix>>()
export class NumberMatrix extends ArrayMatrix<number> {
  static ops() {
    return new NumberOperations();
  }

  static builder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return new MatrixBuilder(NumberMatrix);
  }

  static vectorBuilder(): VectorBuilder<number, NumberVector> {
    return new VectorBuilder(NumberVector);
  }

  ops() {
    return NumberMatrix.ops();
  }

  builder(): MatrixBuilder<number, NumberVector, NumberMatrix> {
    return NumberMatrix.builder();
  }

  vectorBuilder(): VectorBuilder<number, NumberVector> {
    return NumberMatrix.vectorBuilder();
  }

  constructor(data: MatrixData<number>) {
    super(data);
  }
}
