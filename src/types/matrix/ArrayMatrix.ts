import { assertRectangular, assertValidMatrixIndex } from '../../utilities/ErrorAssertions';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector, VectorData } from '../vector/Vector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { Matrix, MatrixData, MatrixEntryCallback } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';

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

  public abstract ops(): ScalarOperations<ScalarType>;
  public abstract builder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;
  public abstract vectorBuilder(): VectorBuilder<ScalarType, Vector<ScalarType>>;

  /**
   * @inheritdoc
   */
  public add(other: Matrix<ScalarType>): Matrix<ScalarType> {
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map((column, columnIndex) => column.add(other.getColumn(columnIndex)))
    );
  }

  /**
   * @inheritdoc
   */
  public adjoint(): Matrix<ScalarType> {
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
  public apply(vector: Vector<ScalarType>): Vector<ScalarType> {
    const vectorAsColumnMatrix = this.builder().fromColumnVectors([vector]);
    return this.multiply(vectorAsColumnMatrix).getColumn(0);
  }

  /**
   * @inheritdoc
   */
  public equals(other: Matrix<ScalarType>): boolean {
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
  public getColumn(columnIndex: number): Vector<ScalarType> {
    if (columnIndex > this.getNumberOfColumns() - 1 || columnIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getColumnVectors()[columnIndex];
  }

  /**
   * @inheritdoc
   */
  public getColumnVectors(): Vector<ScalarType>[] {
    return this.transpose().getRowVectors();
  }

  /**
   * @inheritdoc
   */
  public getData(): MatrixData<ScalarType> {
    return this.getRowVectors().map(row => row.getData());
  }

  /**
   * @inheritdoc
   */
  public getEntry(rowIndex: number, columnIndex: number): ScalarType {
    assertValidMatrixIndex(this, rowIndex, columnIndex);
    return this.getRow(rowIndex).getEntry(columnIndex);
  }

  /**
   * @inheritdoc
   */
  public getNumberOfColumns(): number {
    return this.getColumnVectors().length;
  }

  /**
   * @inheritdoc
   */
  public getNumberOfRows(): number {
    return this.getRowVectors().length;
  }

  /**
   * @inheritdoc
   */
  public getRow(rowIndex: number): Vector<ScalarType> {
    if (rowIndex > this.getNumberOfRows() - 1 || rowIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getRowVectors()[rowIndex];
  }

  /**
   * @inheritdoc
   */
  public getRowVectors(): Vector<ScalarType>[] {
    return this._data.map((dataRow: VectorData<ScalarType>) =>
      this.vectorBuilder().fromData(dataRow)
    );
  }

  /**
   * @inheritdoc
   */
  public multiply(other: Matrix<ScalarType>): Matrix<ScalarType> {
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
  public scalarMultiply(scalar: ScalarType): Matrix<ScalarType> {
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map(column => column.scalarMultiply(scalar))
    );
  }

  /**
   * @inheritdoc
   */
  public set(rowIndex: number, columnIndex: number, value: ScalarType): Matrix<ScalarType> {
    const copy = this.getData();
    copy[rowIndex][columnIndex] = value;
    return this.builder().fromData(copy);
  }

  /**
   * @inheritdoc
   */
  public transpose(): Matrix<ScalarType> {
    return this.builder().fromColumnVectors(this.getRowVectors());
  }

  /**
   * @inheritdoc
   */
  public forEachEntry(cb: MatrixEntryCallback<ScalarType>) {
    this.getRowVectors().forEach((row, i) => {
      row.getData().forEach((entry, j) => {
        cb(entry, i, j);
      });
    });
  }
}
