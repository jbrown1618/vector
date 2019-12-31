import { StaticImplements } from '../../utilities/StaticImplements';
import { NumberOperations } from '../scalar/NumberOperations';
import { FloatVector } from '../vector/FloatVector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { Matrix, MatrixShape, MatrixConstructor, MatrixData } from './Matrix';
import { MatrixBuilder } from './MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';
import {
  assertRectangular,
  assertValidMatrixIndex,
  assertDimensionMatch,
  assertMultiplicable
} from '../../utilities/ErrorAssertions';
import { Vector } from '../vector/Vector';

/**
 * A dense matrix of JavaScript `number` primitives, implemented as a column-major `Float64Array`
 * @public
 */
@StaticImplements<MatrixConstructor<number, FloatVector, FloatMatrix>>()
export class FloatMatrix implements Matrix<number> {
  public static ops(): ScalarOperations<number> {
    return new NumberOperations();
  }

  public static builder(): MatrixBuilder<number, FloatVector, FloatMatrix> {
    return new MatrixBuilder(FloatMatrix);
  }

  public static vectorBuilder(): VectorBuilder<number, FloatVector> {
    return new VectorBuilder(FloatVector);
  }

  private _data: Float64Array;
  private _shape: MatrixShape;

  /**
   * @internal
   */
  constructor(data: MatrixData<number>);
  constructor(data: Float64Array, shape: MatrixShape);
  constructor(data: MatrixData<number> | Float64Array, shape?: MatrixShape) {
    if (data instanceof Float64Array && Array.isArray(shape)) {
      if (data.length !== shape[0] * shape[1]) throw new Error(`Dimension mismatch`);
      this._data = data;
      this._shape = shape;
      return this;
    }

    data = data as MatrixData<number>; // TODO: Why is this needed?
    assertRectangular(data);
    const m = data.length;
    const n = m ? data[0].length : 0;

    if (!m || !n) {
      this._data = new Float64Array(0);
      this._shape = [0, 0];
      return this;
    }

    const columnMajorData = [];
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) {
        columnMajorData.push(data[i][j]);
      }
    }
    this._data = Float64Array.from(columnMajorData);
    this._shape = [m, n];
  }

  /**
   * {@inheritDoc ArrayMatrix.ops}
   */
  public ops(): ScalarOperations<number> {
    return FloatMatrix.ops();
  }

  /**
   * {@inheritDoc ArrayMatrix.builder}
   */
  public builder(): MatrixBuilder<number, FloatVector, FloatMatrix> {
    return FloatMatrix.builder();
  }

  /**
   * {@inheritDoc ArrayMatrix.vectorBuilder}
   */
  public vectorBuilder(): VectorBuilder<number, FloatVector> {
    return FloatMatrix.vectorBuilder();
  }

  /**
   * {@inheritDoc Matrix.add}
   */
  public add(other: Matrix<number>): Matrix<number> {
    assertDimensionMatch(this, other);
    const dataCopy = new Float64Array(this._data);
    for (let i = 0; i < this._data.length; i++) {
      dataCopy[i] = this._data[i] + other.getEntry(...this.getIndices(i));
    }
    return new FloatMatrix(dataCopy, this._shape);
  }

  /**
   * {@inheritDoc Matrix.adjoint}
   */
  public adjoint(): Matrix<number> {
    return this.transpose(); // This implementation is real-valued
  }

  /**
   * {@inheritDoc Matrix.trace}
   */
  public trace(): number {
    const ops = this.ops();
    let trace = ops.zero();
    const n = Math.min(this.getNumberOfColumns(), this.getNumberOfRows());
    for (let i = 0; i < n; i++) {
      trace = ops.add(trace, this.getEntry(i, i));
    }
    return trace;
  }

  /**
   * {@inheritDoc Matrix.apply}
   */
  public apply(vector: Vector<number>): Vector<number> {
    const colShape = [vector.getDimension(), 1] as MatrixShape;
    const vectorAsColumnMatrix = new FloatMatrix(Float64Array.from(vector.toArray()), colShape);
    return this.multiply(vectorAsColumnMatrix).getColumn(0);
  }

  /**
   * {@inheritDoc Matrix.equals}
   */
  public equals(other: Matrix<number>): boolean {
    const [m, n] = this._shape;

    if (n !== other.getNumberOfColumns()) {
      return false;
    }

    if (m !== other.getNumberOfRows()) {
      return false;
    }

    const ops = this.ops();
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) {
        if (!ops.equals(this.getEntry(i, j), other.getEntry(i, j))) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * {@inheritDoc Matrix.getColumn}
   */
  public getColumn(j: number): Vector<number> {
    const columnData = new Float64Array(this.getNumberOfRows());
    for (let i = 0; i < this.getNumberOfRows(); i++) {
      columnData[i] = this.getEntry(i, j);
    }
    return new FloatVector(columnData);
  }

  /**
   * {@inheritDoc Matrix.getColumnVectors}
   */
  public getColumnVectors(): Vector<number>[] {
    const [m, n] = this._shape;
    const columnArrays: Float64Array[] = [];

    // Initialize the row arrays
    for (let j = 0; j < n; j++) {
      columnArrays.push(new Float64Array(m));
    }
    // Fill in the data
    for (let index = 0; index < this._data.length; index++) {
      const [i, j] = this.getIndices(index);
      columnArrays[j][i] = this._data[index];
    }

    return columnArrays.map(columnData => new FloatVector(columnData));
  }

  /**
   * {@inheritDoc Matrix.getDiagonal}
   */
  public getDiagonal(): Vector<number> {
    const numDiagonalElements = Math.min(this.getNumberOfRows(), this.getNumberOfColumns());
    const vectorData = new Float64Array(numDiagonalElements);
    for (let i = 0; i < numDiagonalElements; i++) {
      vectorData[i] = this.getEntry(i, i);
    }
    return new FloatVector(vectorData);
  }

  /**
   * {@inheritDoc Matrix.toArray}
   */
  public toArray(): number[][] {
    const arr = [];
    // Initialize the arrays
    for (let i = 0; i < this.getNumberOfRows(); i++) {
      arr[i] = new Array(this.getNumberOfColumns());
    }
    // Fill in the data
    for (let index = 0; index < this._data.length; index++) {
      const [i, j] = this.getIndices(index);
      arr[i][j] = this._data[index];
    }
    return arr;
  }

  /**
   * {@inheritdoc Matrix.getSparseData}
   */
  public getSparseData(): Map<number, Map<number, number>> {
    const ops = this.ops();
    const zero = ops.zero();
    const sparseData: Map<number, Map<number, number>> = new Map();
    this.forEach((value, rowIndex, colIndex) => {
      if (ops.equals(zero, value)) {
        return;
      }
      const rowData = sparseData.get(rowIndex);
      if (rowData) {
        rowData.set(colIndex, value);
      } else {
        const newRowData: Map<number, number> = new Map();
        newRowData.set(colIndex, value);
        sparseData.set(rowIndex, newRowData);
      }
    });
    return sparseData;
  }

  /**
   * {@inheritDoc Matrix.getEntry}
   */
  public getEntry(i: number, j: number): number {
    assertValidMatrixIndex(this, i, j);
    return this._data[this.getArrayIndex(i, j)];
  }

  /**
   * {@inheritDoc Matrix.getShape}
   */
  public getShape(): MatrixShape {
    return [...this._shape] as MatrixShape;
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
  public getRow(i: number): Vector<number> {
    const rowData = new Float64Array(this.getNumberOfColumns());
    for (let j = 0; j < this.getNumberOfColumns(); j++) {
      rowData[j] = this.getEntry(i, j);
    }
    return new FloatVector(rowData);
  }

  /**
   * {@inheritDoc Matrix.getRowVectors}
   */
  public getRowVectors(): Vector<number>[] {
    const [m, n] = this._shape;
    const rowArrays: Float64Array[] = [];

    // Initialize the row arrays
    for (let i = 0; i < m; i++) {
      rowArrays.push(new Float64Array(n));
    }
    // Fill in the data
    for (let index = 0; index < this._data.length; index++) {
      const [i, j] = this.getIndices(index);
      rowArrays[i][j] = this._data[index];
    }

    return rowArrays.map(rowData => new FloatVector(rowData));
  }

  /**
   * {@inheritDoc Matrix.multiply}
   */
  public multiply(other: Matrix<number>): Matrix<number> {
    assertMultiplicable(this, other);

    const thisRows = this.getRowVectors();
    const otherColumns = other.getColumnVectors();

    const newData = new Float64Array(this.getNumberOfRows() * other.getNumberOfColumns());

    for (let j = 0; j < other.getNumberOfColumns(); j++) {
      for (let i = 0; i < this.getNumberOfRows(); i++) {
        newData[j * this.getNumberOfRows() + i] = thisRows[i].innerProduct(otherColumns[j]);
      }
    }

    return new FloatMatrix(newData, [this.getNumberOfRows(), other.getNumberOfColumns()]);
  }

  /**
   * {@inheritDoc Matrix.scalarMultiply}
   */
  public scalarMultiply(scalar: number): Matrix<number> {
    const newData = new Float64Array(this._data).map(entry => entry * scalar);
    return new FloatMatrix(newData, this._shape);
  }

  /**
   * {@inheritDoc Matrix.set}
   */
  public set(i: number, j: number, value: number): Matrix<number> {
    assertValidMatrixIndex(this, i, j);
    const dataCopy = new Float64Array(this._data);
    dataCopy[this.getArrayIndex(i, j)] = value;
    return new FloatMatrix(dataCopy, this._shape);
  }

  /**
   * {@inheritDoc Matrix.transpose}
   */
  public transpose(): Matrix<number> {
    // TODO - if we also had a row-major implementation then this operation could be free.
    const [m, n] = this._shape;
    const copy = new Float64Array(this._data.length);
    for (let index = 0; index < this._data.length; index++) {
      const [i, j] = this.getIndices(index);
      copy[i * n + j] = this.getEntry(i, j);
    }
    return new FloatMatrix(copy, [n, m]);
  }

  /**
   * {@inheritDoc Matrix.forEach}
   */
  public forEach(cb: (entry: number, rowIndex: number, columnIndex: number) => void): void {
    this._data.forEach((value, index) => {
      const [i, j] = this.getIndices(index);
      cb(value, i, j);
    });
  }

  /**
   * {@inheritDoc Matrix.map}
   */
  public map(
    entryFunction: (entry: number, rowIndex: number, columnIndex: number) => number
  ): Matrix<number> {
    const newData = this._data.map((value, arrIndex) => {
      const [i, j] = this.getIndices(arrIndex);
      return entryFunction(value, i, j);
    });
    return new FloatMatrix(newData, this.getShape());
  }

  private getArrayIndex(i: number, j: number): number {
    const [m] = this._shape;
    return j * m + i;
  }

  private getIndices(arrayIndex: number): MatrixShape {
    const [m] = this._shape;
    const i = arrayIndex % m;
    const j = Math.floor(arrayIndex / m);
    return [i, j];
  }
}
