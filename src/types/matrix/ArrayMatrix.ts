import {
  assertRectangular,
  assertValidMatrixIndex,
  assertDimensionMatch,
  assertMultiplicable
} from '../../utilities/ErrorAssertions';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector, VectorData } from '../vector/Vector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { Matrix, MatrixData, MatrixShape } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';

/**
 * Implements {@link Matrix} with a 2-dimensional array of values.
 *
 * @remarks
 * Subclasses must specify the usual scalar operations on their contents.
 *
 * @public
 */
export abstract class ArrayMatrix<S> implements Matrix<S> {
  private readonly _data: MatrixData<S>;

  /**
   * @internal
   */
  protected constructor(data: MatrixData<S>) {
    assertRectangular(data);
    if (data.length !== 0 && data[0].length === 0) {
      data = [];
    }
    this._data = Object.freeze(data);
  }

  /**
   * {@inheritdoc Matrix.ops}
   */
  public abstract ops(): ScalarOperations<S>;

  /**
   * {@inheritdoc Matrix.builder}
   */
  public abstract builder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * {@inheritdoc Matrix.vectorBuilder}
   */
  public abstract vectorBuilder(): VectorBuilder<S, Vector<S>>;

  /**
   * {@inheritDoc Matrix.add}
   */
  public add(other: Matrix<S>): Matrix<S> {
    assertDimensionMatch(this, other);
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map((column, columnIndex) => column.add(other.getColumn(columnIndex)))
    );
  }

  /**
   * {@inheritDoc Matrix.adjoint}
   */
  public adjoint(): Matrix<S> {
    const ops = this.ops();
    return this.transpose().map(e => ops.conjugate(e));
  }

  /**
   * {@inheritDoc Matrix.trace}
   */
  public trace(): S {
    const ops = this.ops();
    let trace = ops.zero();
    const n = Math.min(...this.getShape());
    for (let i = 0; i < n; i++) {
      trace = ops.add(trace, this.getEntry(i, i));
    }
    return trace;
  }

  /**
   * {@inheritDoc Matrix.apply}
   */
  public apply(vector: Vector<S>): Vector<S> {
    const vectorAsColumnMatrix = this.builder().fromColumnVectors([vector]);
    return this.multiply(vectorAsColumnMatrix).getColumn(0);
  }

  /**
   * {@inheritDoc Matrix.equals}
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
   * {@inheritDoc Matrix.getColumn}
   */
  public getColumn(j: number): Vector<S> {
    if (j > this.getNumberOfColumns() - 1 || j < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getColumnVectors()[j];
  }

  /**
   * {@inheritDoc Matrix.getColumnVectors}
   */
  public getColumnVectors(): Vector<S>[] {
    return this.transpose().getRowVectors();
  }

  /**
   * {@inheritDoc Matrix.getDiagonal}
   */
  public getDiagonal(): Vector<S> {
    const numDiagonalElements = Math.min(...this.getShape());
    return this.vectorBuilder().fromIndexFunction(numDiagonalElements, i => this.getEntry(i, i));
  }

  /**
   * {@inheritDoc Matrix.toArray}
   */
  public toArray(): S[][] {
    return this.getRowVectors().map(row => [...row.toArray()]);
  }

  /**
   * {@inheritdoc Matrix.getSparseData}
   */
  public getSparseData(): Map<number, Map<number, S>> {
    const ops = this.ops();
    const zero = ops.zero();
    const sparseData: Map<number, Map<number, S>> = new Map();
    this.forEach((value, rowIndex, colIndex) => {
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
   * {@inheritDoc Matrix.getEntry}
   */
  public getEntry(i: number, j: number): S {
    assertValidMatrixIndex(this, i, j);
    return this.getRow(i).getEntry(j);
  }

  /**
   * {@inheritDoc Matrix.getShape}
   */
  public getShape(): MatrixShape {
    return [this.getNumberOfRows(), this.getNumberOfColumns()];
  }

  /**
   * {@inheritDoc Matrix.getNumberOfColumns}
   */
  public getNumberOfColumns(): number {
    return (this._data[0] && this._data[0].length) || 0;
  }

  /**
   * {@inheritDoc Matrix.getNumberOfRows}
   */
  public getNumberOfRows(): number {
    return this._data.length;
  }

  /**
   * {@inheritDoc Matrix.getRow}
   */
  public getRow(i: number): Vector<S> {
    if (i > this.getNumberOfRows() - 1 || i < 0) {
      throw new Error('Index out of bounds');
    }
    return this.getRowVectors()[i];
  }

  /**
   * {@inheritDoc Matrix.getRowVectors}
   */
  public getRowVectors(): Vector<S>[] {
    return this._data.map((dataRow: VectorData<S>) => this.vectorBuilder().fromArray(dataRow));
  }

  /**
   * {@inheritDoc Matrix.multiply}
   */
  public multiply(other: Matrix<S>): Matrix<S> {
    assertMultiplicable(this, other);

    return this.builder().fromArray(
      this.getRowVectors().map(row =>
        other.getColumnVectors().map(column => row.innerProduct(column))
      )
    );
  }

  /**
   * {@inheritDoc Matrix.scalarMultiply}
   */
  public scalarMultiply(scalar: S): Matrix<S> {
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map(column => column.scalarMultiply(scalar))
    );
  }

  /**
   * {@inheritDoc Matrix.set}
   */
  public set(i: number, j: number, value: S): Matrix<S> {
    assertValidMatrixIndex(this, i, j);
    const copy = this.toArray();
    copy[i][j] = value;
    return this.builder().fromArray(copy);
  }

  /**
   * {@inheritDoc Matrix.transpose}
   */
  public transpose(): Matrix<S> {
    return this.builder().fromColumnVectors(this.getRowVectors());
  }

  /**
   * {@inheritDoc Matrix.forEach}
   */
  public forEach(cb: (value: S, i: number, j: number) => void): void {
    this.getRowVectors().forEach((row, i) => {
      row.forEach((entry, j) => {
        cb(entry, i, j);
      });
    });
  }

  /**
   * {@inheritDoc Matrix.map}
   */
  public map(entryFunction: (entry: S, rowIndex: number, columnIndex: number) => S): Matrix<S> {
    const newRows = this.getRowVectors().map((row, rowIndex) =>
      row.map((entry, colIndex) => entryFunction(entry, rowIndex, colIndex))
    );
    return this.builder().fromRowVectors(newRows);
  }
}
