import { assertHomogeneous, assertValidVectorIndex } from '../../utilities/ErrorAssertions';
import { Matrix } from '../matrix/Matrix';
import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';

export type SparseVectorData<S> = ReadonlyMap<number, S>;

/**
 * A type guard which returns true if the input is an instance of `SparseVector`,
 * and functions as a type check in the compiler.
 */
export function isSparse<S>(vector: Vector<S>): vector is SparseVector<S> {
  return (vector as any)._sparseData !== undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * For large vectors with many entries equal to 0, some operations are
 * more efficient with a `Vector` implementation that only stores the non-zero values.
 */
export abstract class SparseVector<S> implements Vector<S> {
  private readonly _dimension: number;
  private readonly _sparseData: SparseVectorData<S>;

  protected constructor(data: VectorData<S>) {
    this._dimension = data.length;
    const sparseData: Map<number, S> = new Map();
    data.forEach((value: S, index: number) => {
      if (!this.ops().equals(this.ops().zero(), value)) {
        sparseData.set(index, value);
      }
    });
    this._sparseData = sparseData;
  }

  public abstract ops(): ScalarOperations<S>;

  public abstract builder(): VectorBuilder<S, Vector<S>>;

  public abstract matrixBuilder(): MatrixBuilder<S, Vector<S>, Matrix<S>>;

  /**
   * @inheritdoc
   */
  public getSparseData(): Map<number, S> {
    return new Map(this._sparseData);
  }

  /**
   * @inheritdoc
   */
  public getData(): S[] {
    const data: S[] = [];
    for (let i = 0; i < this.getDimension(); i++) {
      data[i] = this.getEntry(i);
    }
    return data;
  }

  /**
   * @inheritdoc
   */
  public getEntry(index: number): S {
    assertValidVectorIndex(this, index);
    return this._sparseData.get(index) || this.ops().zero();
  }

  /**
   * @inheritdoc
   */
  public innerProduct(other: Vector<S>): S {
    assertHomogeneous([this, other]);

    let innerProduct: S = this.ops().zero();
    this._sparseData.forEach((value, index) => {
      innerProduct = this.ops().add(
        innerProduct,
        this.ops().multiply(value, this.ops().conjugate(other.getEntry(index)))
      );
    });
    return innerProduct;
  }

  /**
   * @inheritdoc
   */
  public outerProduct(other: Vector<S>): Matrix<S> {
    if (isSparse(other)) {
      return this.outerProductWithSparse(other);
    }

    const matrixData: S[][] = [];
    if (this.getDimension() === 0 || other.getDimension() === 0) {
      return this.matrixBuilder().fromData(matrixData);
    }

    this.getData().forEach((thisValue, rowIndex) => {
      matrixData[rowIndex] = [];
      other.getData().forEach((otherValue, columnIndex) => {
        matrixData[rowIndex][columnIndex] = this.ops().multiply(thisValue, otherValue);
      });
    });

    return this.matrixBuilder().fromData(matrixData);
  }

  /**
   * @inheritdoc
   */
  public scalarMultiply(scalar: S): Vector<S> {
    const newSparseData = new Map();
    this._sparseData.forEach((value, index) => {
      newSparseData.set(index, this.ops().multiply(value, scalar));
    });
    return this.builder().fromSparseData(this._dimension, newSparseData);
  }

  /**
   * @inheritdoc
   */
  public add(other: Vector<S>): Vector<S> {
    assertHomogeneous([this, other]);

    return this.builder().fromIndexFunction(this._dimension, i => {
      return this.ops().add(this.getEntry(i), other.getEntry(i));
    });
  }

  /**
   * @inheritdoc
   */
  public equals(other: Vector<S>): boolean {
    if (isSparse(other)) {
      return this.equalsSparse(other);
    }

    return other
      .getData()
      .map((entry, i) => this.ops().equals(this.getEntry(i), entry))
      .reduce((all, current) => all && current, true);
  }

  /**
   * @inheritdoc
   */
  public getDimension(): number {
    return this._dimension;
  }

  /**
   * @inheritdoc
   */
  public projectOnto(u: Vector<S>) {
    const oneOverUDotU = this.ops().getMultiplicativeInverse(u.innerProduct(u));
    if (oneOverUDotU === undefined) {
      throw Error('TODO - cannot project onto the zero vector');
    }

    const uDotV = u.innerProduct(this);
    const magnitudeOfProjection = this.ops().multiply(uDotV, oneOverUDotU);
    return u.scalarMultiply(magnitudeOfProjection);
  }

  private equalsSparse(other: SparseVector<S>): boolean {
    if (this._sparseData.size !== other._sparseData.size) {
      return false;
    }

    let hasMismatch = false;
    this._sparseData.forEach((value, index) => {
      if (!this.ops().equals(other.getEntry(index), value)) {
        hasMismatch = true;
      }
    });
    // It is sufficient to check in one direction since they have the same number of elements.
    return !hasMismatch;
  }

  /**
   * If *both* vectors are sparse, then we can do some additional optimization.
   *
   * @param other - The vector with which to perform an outer product
   */
  private outerProductWithSparse(other: SparseVector<S>): Matrix<S> {
    // TODO - use a sparse matrix here
    let output = this.matrixBuilder().zeros(this.getDimension(), other.getDimension());
    this._sparseData.forEach((value, rowIndex) => {
      other.getSparseData().forEach((otherValue, colIndex) => {
        output = output.set(rowIndex, colIndex, this.ops().multiply(value, otherValue));
      });
    });
    return output;
  }
}
