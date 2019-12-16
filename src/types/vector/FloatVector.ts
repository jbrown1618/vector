import { StaticImplements } from '@lib/utilities/StaticImplements';
import { NumberOperations } from '@lib/types/scalar/NumberOperations';
import { Vector, VectorConstructor, VectorData } from '@lib/types/vector/Vector';
import { VectorBuilder } from '@lib/types/vector/VectorBuilder';
import { MatrixBuilder } from '@lib/types/matrix/MatrixBuilder';
import { assertValidVectorIndex, assertHomogeneous } from '@lib/utilities/ErrorAssertions';
import { Matrix } from '@lib/types/matrix/Matrix';
import { FloatMatrix } from '@lib/types/matrix/FloatMatrix';

/**
 * A dense {@link Vector} of `number`s implemented as a `Float64Array`
 * @public
 */
@StaticImplements<VectorConstructor<number, FloatVector>>()
export class FloatVector implements Vector<number> {
  public static ops(): NumberOperations {
    return new NumberOperations();
  }

  public static builder(): VectorBuilder<number, FloatVector> {
    return new VectorBuilder(FloatVector);
  }

  private _data: Float64Array;

  /**
   * @internal
   */
  constructor(data: VectorData<number> | Float64Array) {
    if (data instanceof Float64Array) {
      this._data = data;
    } else {
      this._data = Float64Array.from(data);
    }
  }

  /**
   * {@inheritDoc ArrayVector.ops}
   */
  public ops(): NumberOperations {
    return FloatVector.ops();
  }

  /**
   * {@inheritDoc ArrayVector.builder}
   */
  public builder(): VectorBuilder<number, FloatVector> {
    return FloatVector.builder();
  }

  /**
   * {@inheritDoc ArrayVector.matrixBuilder}
   */
  public matrixBuilder(): MatrixBuilder<number, FloatVector, FloatMatrix> {
    return FloatMatrix.builder();
  }

  /**
   * {@inheritDoc Vector.getEntry}
   */
  public getEntry(index: number): number {
    assertValidVectorIndex(this, index);
    return this._data[index];
  }

  /**
   * {@inheritDoc Vector.set}
   */
  public set(index: number, value: number): Vector<number> {
    assertValidVectorIndex(this, index);

    const newData = this.toArray();
    newData[index] = value;

    return new FloatVector(newData);
  }

  /**
   * {@inheritDoc Vector.add}
   */
  public add(other: Vector<number>): Vector<number> {
    assertHomogeneous([this, other]);

    const newData = new Float64Array(this._data);
    for (let i = 0; i < this.getDimension(); i++) {
      newData[i] = this._data[i] + other.getEntry(i);
    }

    return new FloatVector(newData);
  }

  /**
   * {@inheritDoc Vector.equals}
   */
  public equals(other: Vector<number>): boolean {
    if (this.getDimension() !== other.getDimension()) {
      return false;
    }

    const ops = this.ops();
    for (let i = 0; i < this.getDimension(); i++) {
      if (!ops.equals(this._data[i], other.getEntry(i))) return false;
    }

    return true;
  }

  /**
   * {@inheritDoc Vector.innerProduct}
   */
  public innerProduct(other: Vector<number>): number {
    assertHomogeneous([this, other]);

    let sum = 0;
    for (let i = 0; i < this.getDimension(); i++) {
      sum += this._data[i] * other.getEntry(i);
    }

    return sum;
  }

  /**
   * {@inheritDoc Vector.outerProduct}
   */
  public outerProduct(other: Vector<number>): Matrix<number> {
    const m = this.getDimension();
    const n = other.getDimension();

    if (!m || !n) return new FloatMatrix(new Float64Array(0), 0, 0);

    const matrixData = new Float64Array(m * n);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) {
        matrixData[j * m + i] = this._data[i] * other.getEntry(j);
      }
    }

    return new FloatMatrix(matrixData, m, n);
  }

  /**
   * {@inheritDoc Vector.projectOnto}
   */
  public projectOnto(u: Vector<number>): Vector<number> {
    const uDotU = u.innerProduct(u);
    if (uDotU === 0) throw new Error(`Cannot project onto the 0-vector`);
    const oneOverUDotU = 1 / uDotU;

    const uDotV = u.innerProduct(this);
    const magnitudeOfProjection = uDotV * oneOverUDotU;
    return u.scalarMultiply(magnitudeOfProjection);
  }

  /**
   * {@inheritDoc Vector.scalarMultiply}
   */
  public scalarMultiply(scalar: number): Vector<number> {
    return new FloatVector(this._data.map(v => v * scalar));
  }

  /**
   * {@inheritDoc Vector.toArray}
   */
  public toArray(): number[] {
    return Array.from(this._data);
  }

  /**
   * {@inheritDoc Vector.getSparseData}
   */
  public getSparseData(): Map<number, number> {
    const sparseData: Map<number, number> = new Map();
    this._data.forEach((value, index) => {
      if (value !== 0) {
        sparseData.set(index, value);
      }
    });
    return sparseData;
  }

  /**
   * {@inheritDoc Vector.getDimension}
   */
  public getDimension(): number {
    return this._data.length;
  }
}
