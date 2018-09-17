function StaticImplements<T>() {
  // @ts-ignore
  return (constructor: T) => {};
}

interface ScalarOperations<ScalarType> {
  add(a: ScalarType, b: ScalarType): ScalarType;
  one(): ScalarType;
  zero(): ScalarType;
}

class NumberOperations implements ScalarOperations<number> {
  add(a: number, b: number): number {
    return a + b;
  }

  one(): number {
    return 1;
  }

  zero(): number {
    return 0;
  }
}

interface MatrixConstructor<ScalarType, MatrixType> {
  new (data: ScalarType[][]): MatrixType;
  ops(): ScalarOperations<ScalarType>;
  builder(): MatrixBuilder<ScalarType, MatrixType>;
}

interface Matrix<ScalarType> {
  at(i: number, j: number): ScalarType;
}

abstract class ArrayMatrix<ScalarType> implements Matrix<ScalarType> {
  private readonly _data: ScalarType[][];

  protected constructor(data: ScalarType[][]) {
    this._data = data;
  }

  at(i: number, j: number): ScalarType {
    return this._data[i][j];
  }
}

@StaticImplements<MatrixConstructor<number, NumberMatrix>>()
class NumberMatrix extends ArrayMatrix<number> {
  static ops() {
    return new NumberOperations();
  }

  static builder(): MatrixBuilder<number, NumberMatrix> {
    return new MatrixBuilder(NumberMatrix);
  }

  constructor(data: number[][]) {
    super(data);
  }
}

class MatrixBuilder<ScalarType, MatrixType> {
  private readonly _matrixConstructor: MatrixConstructor<ScalarType, MatrixType>;

  constructor(matrixConstructor: MatrixConstructor<ScalarType, MatrixType>) {
    this._matrixConstructor = matrixConstructor;
  }

  identity(size: number): MatrixType {
    const data: ScalarType[][] = [];
    const ops = this._matrixConstructor.ops();
    for (let i = 0; i < size; i++) {
      data[i] = [];
      for (let j = 0; j < size; j++) {
        data[i][j] = i === j ? ops.one() : ops.zero();
      }
    }
    return new this._matrixConstructor(data);
  }
}

const numberIdentity: NumberMatrix = NumberMatrix.builder().identity(2);
