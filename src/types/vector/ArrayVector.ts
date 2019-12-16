import { assertHomogeneous, assertValidVectorIndex } from '@lib/utilities/ErrorAssertions';
import { Matrix } from '@lib/types/matrix/Matrix';
import { MatrixBuilder } from '@lib/types/matrix/MatrixBuilder';
import { ScalarOperations } from '@lib/types/scalar/ScalarOperations';
import { Vector, VectorData } from '@lib/types/vector/Vector';
import { VectorBuilder } from '@lib/types/vector/VectorBuilder';

/**
 * Implements {@link Vector} with an array of values.
 *
 * @remarks
 * Subclasses must specify the usual scalar operations on their contents.
 *
 * @public
 */
export abstract class ArrayVector<S> implements Vector<S> {
  private readonly _data: VectorData<S>;

  /**
   * @internal
   */
  protected constructor(data: VectorData<S>) {
    this._data = Object.freeze(data);
  }

  /**
   * {@inheritdoc Vector.ops}
   */
  public abstract ops(): ScalarOperations<S>;

  /**
   * {@inheritdoc Vector.builder}
   */
  public abstract builder(): VectorBuilder<S, Vector<S>>;

  /**
   * {@inheritdoc Vector.matrixBuilder}
   */
  public abstract matrixBuilder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * {@inheritDoc Vector.getEntry}
   */
  public getEntry(index: number): S {
    assertValidVectorIndex(this, index);
    return this._data[index];
  }

  /**
   * {@inheritDoc Vector.set}
   */
  public set(index: number, value: S): Vector<S> {
    assertValidVectorIndex(this, index);

    const newData = this.toArray();
    newData[index] = value;

    return this.builder().fromArray(newData);
  }

  /**
   * {@inheritDoc Vector.add}
   */
  public add(other: Vector<S>): Vector<S> {
    assertHomogeneous([this, other]);

    const newData = this.toArray().map((entry, index) =>
      this.ops().add(entry, other.getEntry(index))
    );

    return this.builder().fromArray(newData);
  }

  /**
   * {@inheritDoc Vector.equals}
   */
  public equals(other: Vector<S>): boolean {
    if (this.getDimension() !== other.getDimension()) {
      return false;
    }

    return this._data
      .map((entry, i) => this.ops().equals(entry, other.getEntry(i)))
      .reduce((all, current) => all && current, true);
  }

  /**
   * {@inheritDoc Vector.innerProduct}
   */
  public innerProduct(other: Vector<S>): S {
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
  public outerProduct(other: Vector<S>): Matrix<S> {
    const matrixData: S[][] = [];

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
  public projectOnto(u: Vector<S>): Vector<S> {
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
  public scalarMultiply(scalar: S): Vector<S> {
    return this.builder().fromArray(
      this.toArray().map(entry => this.ops().multiply(entry, scalar))
    );
  }

  /**
   * {@inheritDoc Vector.toArray}
   */
  public toArray(): S[] {
    return [...this._data];
  }

  /**
   * {@inheritDoc Vector.getSparseData}
   */
  public getSparseData(): Map<number, S> {
    const ops = this.ops();
    const zero = ops.zero();

    const sparseData: Map<number, S> = new Map();
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
