import {
  assertRectangular,
  assertValidMatrixIndex,
  assertValidIndex,
  assertMultiplicable
} from '../../utilities/ErrorAssertions';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector } from '../vector/Vector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { Matrix, MatrixData, MatrixShape } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';

/**
 * The data stored in a {@link Matrix} represented as a map
 * @public
 */
export type SparseMatrixData<S> = ReadonlyMap<number, ReadonlyMap<number, S>>;

type MutableSparseMatrixData<S> = Map<number, Map<number, S>>;

// TODO - implement sparse vector/matrix as:
// [number, S][]
// [number, number, S][]

/**
 * Implements {@link Matrix} with a map of indices to nonzero values.
 *
 * @remarks
 * Subclasses must specify the usual scalar operations on their contents.
 *
 * @public
 */
export abstract class SparseMatrix<S> implements Matrix<S> {
  private readonly _shape: MatrixShape;
  private readonly _sparseData: SparseMatrixData<S>;

  /**
   * @internal
   */
  protected constructor(data: MatrixData<S>) {
    assertRectangular(data);
    if (data.length === 0 || data[0].length === 0) {
      data = [];
    }

    const m = data.length;
    const n = data.length > 0 ? data[0].length : 0;
    this._shape = [m, n];

    const sparseData: MutableSparseMatrixData<S> = new Map();
    if (m === 0 || n === 0) {
      this._sparseData = sparseData;
      return;
    }

    data.forEach((rowData, rowIndex) => {
      rowData.forEach((entry, colIndex) => {
        const existingRowMap = sparseData.get(rowIndex);
        if (existingRowMap) {
          existingRowMap.set(colIndex, entry);
        } else {
          const rowMap: Map<number, S> = new Map();
          rowMap.set(colIndex, entry);
          sparseData.set(rowIndex, rowMap);
        }
      });
    });
    this._sparseData = sparseData;
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
    return this.builder().fromColumnVectors(
      this.getColumnVectors().map((column, columnIndex) => column.add(other.getColumn(columnIndex)))
    );
  }

  /**
   * {@inheritDoc Matrix.adjoint}
   */
  public adjoint(): Matrix<S> {
    const adjointData = this.transpose().getSparseData();
    adjointData.forEach(rd => {
      rd.forEach((value, colIndex) => {
        rd.set(colIndex, this.ops().conjugate(value));
      });
    });
    const [m, n] = this._shape;
    return this.builder().fromSparseData([n, m], adjointData);
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

    // TODO - can probably be optimized for the case of two sparse matrices
    return this.getColumnVectors()
      .map((column, i) => column.equals(other.getColumn(i)))
      .reduce((all, current) => all && current, true);
  }

  /**
   * {@inheritDoc Matrix.getColumn}
   */
  public getColumn(j: number): Vector<S> {
    assertValidIndex(j, this.getNumberOfColumns());
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
    const numDiagonalElements = Math.min(this.getNumberOfRows(), this.getNumberOfColumns());
    return this.vectorBuilder().fromIndexFunction(numDiagonalElements, i => this.getEntry(i, i));
  }

  /**
   * {@inheritDoc Matrix.toArray}
   */
  public toArray(): S[][] {
    return this.getRowVectors().map(row => [...row.toArray()]);
  }

  /**
   * {@inheritDoc Matrix.getSparseData}
   */
  public getSparseData(): Map<number, Map<number, S>> {
    const ops = this.ops();
    const zero = ops.zero();

    const sparseData = new Map();
    this._sparseData.forEach((oldRowData, rowIndex) => {
      oldRowData.forEach((value, colIndex) => {
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
    });
    return sparseData;
  }

  /**
   * {@inheritDoc Matrix.getEntry}
   */
  public getEntry(i: number, j: number): S {
    assertValidMatrixIndex(this, i, j);
    const rowData = this._sparseData.get(i);
    if (!rowData) {
      return this.ops().zero();
    }
    return rowData.get(j) || this.ops().zero();
  }

  /**
   * {@inheritDoc Matrix.getShape}
   */
  public getShape(): MatrixShape {
    const [m, n] = this._shape;
    return [m, n];
  }

  /**
   * {@inheritDoc Matrix.getNumberOfColumns}
   */
  public getNumberOfColumns(): number {
    return this._shape[1];
  }

  /**
   * {@inheritDoc Matrix.getNumberOfRows}
   */
  public getNumberOfRows(): number {
    return this._shape[0];
  }

  /**
   * {@inheritDoc Matrix.getRow}
   */
  public getRow(i: number): Vector<S> {
    const [m, n] = this._shape;
    assertValidIndex(i, m);
    return this.vectorBuilder().fromSparseData(n, this._sparseData.get(i) || new Map());
  }

  /**
   * {@inheritDoc Matrix.getRowVectors}
   */
  public getRowVectors(): Vector<S>[] {
    const [m] = this._shape;
    const rowVectors: Vector<S>[] = [];
    for (let i = 0; i < m; i++) {
      rowVectors.push(this.getRow(i));
    }
    return rowVectors;
  }

  /**
   * {@inheritDoc Matrix.multiply}
   */
  public multiply(other: Matrix<S>): Matrix<S> {
    assertMultiplicable(this, other);

    // TODO - can probably be optimized for the case of two sparse matrices
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
    const sd = this.getSparseData();
    sd.forEach(rd => {
      rd.forEach((value, colIndex) => {
        rd.set(colIndex, this.ops().multiply(value, scalar));
      });
    });
    return this.builder().fromSparseData(this._shape, sd);
  }

  /**
   * {@inheritDoc Matrix.set}
   */
  public set(i: number, j: number, value: S): Matrix<S> {
    assertValidMatrixIndex(this, i, j);
    const copy = this.getSparseData();
    const row = copy.get(i);
    if (row) {
      row.set(j, value);
    } else {
      const newRow = new Map();
      newRow.set(j, value);
      copy.set(i, newRow);
    }
    return this.builder().fromSparseData(this._shape, copy);
  }

  /**
   * {@inheritDoc Matrix.transpose}
   */
  public transpose(): Matrix<S> {
    const transposeData: MutableSparseMatrixData<S> = new Map();
    this._sparseData.forEach((sparseRowData, rowIndex) => {
      sparseRowData.forEach((value, colIndex) => {
        const transposeRowData = transposeData.get(colIndex);
        if (transposeRowData) {
          transposeRowData.set(rowIndex, value);
        } else {
          const newTransposeRowData: Map<number, S> = new Map();
          newTransposeRowData.set(rowIndex, value);
          transposeData.set(colIndex, newTransposeRowData);
        }
      });
    });
    const [m, n] = this._shape;
    return this.builder().fromSparseData([n, m], transposeData);
  }

  /**
   * {@inheritDoc Matrix.forEach}
   */
  public forEach(cb: (entry: S, rowIndex: number, columnIndex: number) => void): void {
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
