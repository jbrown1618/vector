import { StaticImplements } from '@lib/utilities/StaticImplements';
import { NumberOperations } from '@lib/types/scalar/NumberOperations';
import { Vector, VectorConstructor, VectorData } from '@lib/types/vector/Vector';
import { VectorBuilder } from '@lib/types/vector/VectorBuilder';
import { MatrixBuilder } from '@lib/types/matrix/MatrixBuilder';
import { assertValidVectorIndex, assertHomogeneous } from '@lib/utilities/ErrorAssertions';
import { Matrix } from '@lib/types/matrix/Matrix';
import { FloatMatrix } from '@lib/types/matrix/FloatMatrix';

// TODO: some of this is inefficient.

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
    this._data = Float64Array.from(data);
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

    return this.builder().fromArray(newData);
  }

  /**
   * {@inheritDoc Vector.add}
   */
  public add(other: Vector<number>): Vector<number> {
    assertHomogeneous([this, other]);

    const newData = this.toArray().map((entry, index) =>
      this.ops().add(entry, other.getEntry(index))
    );

    return this.builder().fromArray(newData);
  }

  /**
   * {@inheritDoc Vector.equals}
   */
  public equals(other: Vector<number>): boolean {
    if (this.getDimension() !== other.getDimension()) {
      return false;
    }

    return Array.from(this._data)
      .map((entry, i) => this.ops().equals(entry, other.getEntry(i)))
      .reduce((all, current) => all && current, true);
  }

  /**
   * {@inheritDoc Vector.innerProduct}
   */
  public innerProduct(other: Vector<number>): number {
    assertHomogeneous([this, other]);

    return this._data
      .map((entry, index) =>
        this.ops().multiply(entry, this.ops().conjugate(other.getEntry(index)))
      )
      .reduce(this.ops().add, this.ops().zero());
  }

  /**
   * {@inheritDoc Vector.outerProduct}
   */
  public outerProduct(other: Vector<number>): Matrix<number> {
    const matrixData: number[][] = [];

    if (this.getDimension() === 0 || other.getDimension() === 0) {
      return this.matrixBuilder().fromArray(matrixData);
    }

    this.toArray().forEach((thisValue, rowIndex) => {
      matrixData[rowIndex] = [];
      other.toArray().forEach((otherValue, columnIndex) => {
        matrixData[rowIndex][columnIndex] = this.ops().multiply(thisValue, otherValue);
      });
    });

    return this.matrixBuilder().fromArray(matrixData);
  }

  /**
   * {@inheritDoc Vector.projectOnto}
   */
  public projectOnto(u: Vector<number>): Vector<number> {
    const oneOverUDotU = this.ops().getMultiplicativeInverse(u.innerProduct(u));
    if (oneOverUDotU === undefined) {
      throw Error(`Cannot project onto the 0-vector`);
    }

    const uDotV = u.innerProduct(this);
    const magnitudeOfProjection = this.ops().multiply(uDotV, oneOverUDotU);
    return u.scalarMultiply(magnitudeOfProjection);
  }

  /**
   * {@inheritDoc Vector.scalarMultiply}
   */
  public scalarMultiply(scalar: number): Vector<number> {
    return this.builder().fromArray(
      this.toArray().map(entry => this.ops().multiply(entry, scalar))
    );
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
    const ops = this.ops();
    const zero = ops.zero();

    const sparseData: Map<number, number> = new Map();
    this.toArray().forEach((value, index) => {
      if (!ops.equals(zero, value)) {
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
