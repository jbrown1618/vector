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
export abstract class ArrayMatrix<S> implements Matrix<S> {
  private readonly _data: MatrixData<S>;

  protected constructor(data: MatrixData<S>) {
    assertRectangular(data);
    if (data.length !== 0 && data[0].length === 0) {
      data = [];
    }
    this._data = Object.freeze(data);
  }

  public abstract ops(): ScalarOperations<S>;
  public abstract builder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;
  public abstract vectorBuilder(): VectorBuilder<S, Vector<S>>;

  /**
   * @inheritdoc
   */
  public add(other: Matrix<S>): Matrix<S> {
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map((column, columnIndex) => column.add(other.getColumn(columnIndex)))
    );
  }

  /**
   * @inheritdoc
   */
  public adjoint(): Matrix<S> {
    const transposedData = this.transpose().toArray();
    const adjointData: S[][] = [];
    transposedData.forEach((row, i) => {
      adjointData[i] = [];
      row.forEach((entry: S, j: number) => {
        adjointData[i][j] = this.ops().conjugate(entry);
      });
    });
    return this.builder().fromArray(adjointData);
  }

  /**
   * @inheritdoc
   */
  public trace(): S {
    const ops = this.ops();
    let trace = ops.zero();
    const n = Math.min(this.getNumberOfColumns(), this.getNumberOfRows());
    for (let i = 0; i < n; i++) {
      trace = ops.add(trace, this.getEntry(i, i));
    }
    return trace;
  }

  /**
   * @inheritdoc
   */
  public apply(vector: Vector<S>): Vector<S> {
    const vectorAsColumnMatrix = this.builder().fromColumnVectors([vector]);
    return this.multiply(vectorAsColumnMatrix).getColumn(0);
  }

  /**
   * @inheritdoc
   */
  public equals(other: Matrix<S>): boolean {
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
  public getColumn(columnIndex: number): Vector<S> {
    if (columnIndex > this.getNumberOfColumns() - 1 || columnIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getColumnVectors()[columnIndex];
  }

  /**
   * @inheritdoc
   */
  public getColumnVectors(): Vector<S>[] {
    return this.transpose().getRowVectors();
  }

  /**
   * @inheritdoc
   */
  public getDiagonal(): Vector<S> {
    const numDiagonalElements = Math.min(this.getNumberOfRows(), this.getNumberOfColumns());
    return this.vectorBuilder().fromIndexFunction(numDiagonalElements, i => this.getEntry(i, i));
  }

  /**
   * @inheritdoc
   */
  public toArray(): S[][] {
    return this.getRowVectors().map(row => [...row.toArray()]);
  }

  public getSparseData(): Map<number, Map<number, S>> {
    const ops = this.ops();
    const zero = ops.zero();
    const sparseData: Map<number, Map<number, S>> = new Map();
    this.forEachEntry((value, rowIndex, colIndex) => {
      if (ops.equals(zero, value)) {
        return;
      }
      const rowData = sparseData.get(rowIndex);
      if (rowData) {
        rowData.set(colIndex, value);
      } else {
        const newRowData: Map<number, S> = new Map();
        newRowData.set(colIndex, value);
        sparseData.set(rowIndex, newRowData);
      }
    });
    return sparseData;
  }

  /**
   * @inheritdoc
   */
  public getEntry(rowIndex: number, columnIndex: number): S {
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
  public getRow(rowIndex: number): Vector<S> {
    if (rowIndex > this.getNumberOfRows() - 1 || rowIndex < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getRowVectors()[rowIndex];
  }

  /**
   * @inheritdoc
   */
  public getRowVectors(): Vector<S>[] {
    return this._data.map((dataRow: VectorData<S>) => this.vectorBuilder().fromArray(dataRow));
  }

  /**
   * @inheritdoc
   */
  public multiply(other: Matrix<S>): Matrix<S> {
    if (this.getNumberOfColumns() !== other.getNumberOfRows()) {
      throw new Error('Dimension mismatch');
    }

    return this.builder().fromArray(
      this.getRowVectors().map(row =>
        other.getColumnVectors().map(column => row.innerProduct(column))
      )
    );
  }

  /**
   * @inheritdoc
   */
  public scalarMultiply(scalar: S): Matrix<S> {
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map(column => column.scalarMultiply(scalar))
    );
  }

  /**
   * @inheritdoc
   */
  public set(rowIndex: number, columnIndex: number, value: S): Matrix<S> {
    assertValidMatrixIndex(this, rowIndex, columnIndex);
    const copy = this.toArray();
    copy[rowIndex][columnIndex] = value;
    return this.builder().fromArray(copy);
  }

  /**
   * @inheritdoc
   */
  public transpose(): Matrix<S> {
    return this.builder().fromColumnVectors(this.getRowVectors());
  }

  /**
   * @inheritdoc
   */
  public forEachEntry(cb: MatrixEntryCallback<S>) {
    this.getRowVectors().forEach((row, i) => {
      row.toArray().forEach((entry, j) => {
        cb(entry, i, j);
      });
    });
  }
}
