import { Matrix, MatrixData, MatrixEntryCallback } from './Matrix';
import { Vector, VectorData } from './Vector';
import { assertValidMatrixIndex } from '../utilities/ErrorAssertions';

/**
 * Implements `Matrix` with a 2-dimensional array of values.
 * Subclasses must specify the usual scalar operations on their contents.
 */
export abstract class ArrayMatrix<ScalarType> implements Matrix<ScalarType> {
  private readonly _data: MatrixData<ScalarType>;

  protected constructor(data: MatrixData<ScalarType>) {
    this._data = data;
  }

  protected abstract newFromData(data: MatrixData<ScalarType>): Matrix<ScalarType>;

  protected abstract newFromColumnVectors(vectors: Array<Vector<ScalarType>>): Matrix<ScalarType>;

  protected abstract makeVector(vectorData: VectorData<ScalarType>): Vector<ScalarType>;

  abstract addScalars(first: ScalarType, second: ScalarType): ScalarType;

  abstract scalarsEqual(first: ScalarType, second: ScalarType): boolean;

  abstract multiplyScalars(first: ScalarType, second: ScalarType): ScalarType;

  abstract conjugateScalar(scalar: ScalarType): ScalarType;

  abstract getAdditiveIdentity(): ScalarType;

  abstract getMultiplicativeIdentity(): ScalarType;

  add(other: Matrix<ScalarType>): Matrix<ScalarType> {
    return this.newFromColumnVectors(
      this.getColumnVectors().map((column, columnIndex) => column.add(other.getColumn(columnIndex)))
    );
  }

  adjoint(): Matrix<ScalarType> {
    const transposedData = this.transpose().getData();
    const adjointData: MatrixData<ScalarType> = [];
    transposedData.forEach((row, i) => {
      adjointData[i] = [];
      row.forEach((entry, j) => {
        adjointData[i][j] = this.conjugateScalar(entry);
      });
    });
    return this.newFromData(adjointData);
  }

  apply(vector: Vector<ScalarType>): Vector<ScalarType> {
    const vectorAsColumnMatrix = this.newFromColumnVectors([vector]);
    return this.multiply(vectorAsColumnMatrix).getColumn(0);
  }

  equals(other: Matrix<ScalarType>): boolean {
    if (this.getNumberOfColumns() !== other.getNumberOfColumns()) {
      return false;
    }

    if (this.getNumberOfRows() !== other.getNumberOfRows()) {
      return false;
    }

    return this.getColumnVectors()
      .map((column, i) => column.equals(other.getColumn(i)))
      .reduce((all, current) => all && current, true);
  }

  getColumn(columnIndex: number): Vector<ScalarType> {
    if (columnIndex > this.getNumberOfColumns() - 1 || columnIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getColumnVectors()[columnIndex];
  }

  getColumnVectors(): Array<Vector<ScalarType>> {
    return this.transpose().getRowVectors();
  }

  getData(): MatrixData<ScalarType> {
    return this.getRowVectors().map(row => row.getData());
  }

  getEntry(rowIndex: number, columnIndex: number): ScalarType {
    assertValidMatrixIndex(this, rowIndex, columnIndex);
    return this.getRow(rowIndex).getEntry(columnIndex);
  }

  getNumberOfColumns(): number {
    return this.getColumnVectors().length;
  }

  getNumberOfRows(): number {
    return this.getRowVectors().length;
  }

  getRow(rowIndex: number): Vector<ScalarType> {
    if (rowIndex > this.getNumberOfRows() - 1 || rowIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getRowVectors()[rowIndex];
  }

  getRowVectors(): Array<Vector<ScalarType>> {
    return this._data.map(this.makeVector);
  }

  multiply(other: Matrix<ScalarType>): Matrix<ScalarType> {
    if (this.getNumberOfColumns() !== other.getNumberOfRows()) {
      throw new Error('Dimension mismatch');
    }

    return this.newFromData(
      this.getRowVectors().map(row =>
        other.getColumnVectors().map(column => row.innerProduct(column))
      )
    );
  }

  scalarMultiply(scalar: ScalarType): Matrix<ScalarType> {
    return this.newFromColumnVectors(
      this.getColumnVectors().map(column => column.scalarMultiply(scalar))
    );
  }

  set(rowIndex: number, columnIndex: number, value: ScalarType): Matrix<ScalarType> {
    const copy = this.getData();
    copy[rowIndex][columnIndex] = value;
    return this.newFromData(copy);
  }

  transpose(): Matrix<ScalarType> {
    return this.newFromColumnVectors(this.getRowVectors());
  }

  forEachEntry(cb: MatrixEntryCallback<ScalarType>) {
    this.getRowVectors().forEach((row, i) => {
      row.getData().forEach((entry, j) => {
        cb(entry, i, j);
      });
    });
  }
}
