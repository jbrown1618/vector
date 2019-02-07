import { Matrix, MatrixData, MatrixEntryCallback } from './Matrix';
import { assertRectangular, assertValidMatrixIndex } from '../../utilities/ErrorAssertions';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { MatrixBuilder } from './MatrixBuilder';
import { Vector, VectorData } from '../vector/Vector';
import { VectorBuilder } from '../vector/VectorBuilder';

/**
 * Implements `Matrix` with a 2-dimensional array of values.
 * Subclasses must specify the usual scalar operations on their contents.
 */
export abstract class ArrayMatrix<ScalarType> implements Matrix<ScalarType> {
  private readonly _data: MatrixData<ScalarType>;

  protected constructor(data: MatrixData<ScalarType>) {
    assertRectangular(data);
    if (data.length !== 0 && data[0].length === 0) {
      data = [];
    }
    this._data = data;
  }

  abstract ops(): ScalarOperations<ScalarType>;
  abstract builder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;
  abstract vectorBuilder(): VectorBuilder<ScalarType, Vector<ScalarType>>;

  /**
   * @inheritdoc
   */
  add(other: Matrix<ScalarType>): Matrix<ScalarType> {
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map((column, columnIndex) => column.add(other.getColumn(columnIndex)))
    );
  }

  /**
   * @inheritdoc
   */
  adjoint(): Matrix<ScalarType> {
    const transposedData = this.transpose().getData();
    const adjointData: MatrixData<ScalarType> = [];
    transposedData.forEach((row, i) => {
      adjointData[i] = [];
      row.forEach((entry: ScalarType, j: number) => {
        adjointData[i][j] = this.ops().conjugate(entry);
      });
    });
    return this.builder().fromData(adjointData);
  }

  /**
   * @inheritdoc
   */
  apply(vector: Vector<ScalarType>): Vector<ScalarType> {
    const vectorAsColumnMatrix = this.builder().fromColumnVectors([vector]);
    return this.multiply(vectorAsColumnMatrix).getColumn(0);
  }

  /**
   * @inheritdoc
   */
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

  /**
   * @inheritdoc
   */
  getColumn(columnIndex: number): Vector<ScalarType> {
    if (columnIndex > this.getNumberOfColumns() - 1 || columnIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getColumnVectors()[columnIndex];
  }

  /**
   * @inheritdoc
   */
  getColumnVectors(): Array<Vector<ScalarType>> {
    return this.transpose().getRowVectors();
  }

  /**
   * @inheritdoc
   */
  getData(): MatrixData<ScalarType> {
    return this.getRowVectors().map(row => row.getData());
  }

  /**
   * @inheritdoc
   */
  getEntry(rowIndex: number, columnIndex: number): ScalarType {
    assertValidMatrixIndex(this, rowIndex, columnIndex);
    return this.getRow(rowIndex).getEntry(columnIndex);
  }

  /**
   * @inheritdoc
   */
  getNumberOfColumns(): number {
    return this.getColumnVectors().length;
  }

  /**
   * @inheritdoc
   */
  getNumberOfRows(): number {
    return this.getRowVectors().length;
  }

  /**
   * @inheritdoc
   */
  getRow(rowIndex: number): Vector<ScalarType> {
    if (rowIndex > this.getNumberOfRows() - 1 || rowIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getRowVectors()[rowIndex];
  }

  /**
   * @inheritdoc
   */
  getRowVectors(): Array<Vector<ScalarType>> {
    return this._data.map((dataRow: VectorData<ScalarType>) =>
      this.vectorBuilder().fromData(dataRow)
    );
  }

  /**
   * @inheritdoc
   */
  multiply(other: Matrix<ScalarType>): Matrix<ScalarType> {
    if (this.getNumberOfColumns() !== other.getNumberOfRows()) {
      throw new Error('Dimension mismatch');
    }

    return this.builder().fromData(
      this.getRowVectors().map(row =>
        other.getColumnVectors().map(column => row.innerProduct(column))
      )
    );
  }

  /**
   * @inheritdoc
   */
  scalarMultiply(scalar: ScalarType): Matrix<ScalarType> {
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map(column => column.scalarMultiply(scalar))
    );
  }

  /**
   * @inheritdoc
   */
  set(rowIndex: number, columnIndex: number, value: ScalarType): Matrix<ScalarType> {
    const copy = this.getData();
    copy[rowIndex][columnIndex] = value;
    return this.builder().fromData(copy);
  }

  /**
   * @inheritdoc
   */
  transpose(): Matrix<ScalarType> {
    return this.builder().fromColumnVectors(this.getRowVectors());
  }

  /**
   * @inheritdoc
   */
  forEachEntry(cb: MatrixEntryCallback<ScalarType>) {
    this.getRowVectors().forEach((row, i) => {
      row.getData().forEach((entry, j) => {
        cb(entry, i, j);
      });
    });
  }
}
