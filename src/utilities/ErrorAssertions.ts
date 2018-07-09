import { Matrix, MatrixData, Vector } from '..';

export function assertRectangular(data: MatrixData<any>): void {
  if (data.length === 0) {
    return;
  }
  const rowSize = data[0].length;
  for (let i = 0; i < data.length; i++) {
    if (data[i].length !== rowSize) {
      throw Error('TODO - message');
    }
  }
}

export function assertHomogeneous(vectors: Array<Vector<any>>): void {
  if (vectors.length === 0) {
    return;
  }
  const size = vectors[0].getDimension();
  for (let i = 0; i < vectors.length; i++) {
    if (vectors[i].getDimension() !== size) {
      throw Error('TODO - message');
    }
  }
}

export function assertValidVectorIndex(vector: Vector<any>, index: number): void {
  assertValidIndex(index, vector.getDimension());
}

export function assertValidMatrixIndex(
  matrix: Matrix<any>,
  rowIndex: number,
  colIndex: number
): void {
  assertValidIndex(rowIndex, matrix.getNumberOfRows());
  assertValidIndex(colIndex, matrix.getNumberOfColumns());
}

export function assertValidIndex(index: number, size: number): void {
  if (index < 0 || index >= size) {
    throw Error('TODO - message');
  }
}
