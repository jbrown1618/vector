import { assertHomogeneous, assertValidVectorIndex } from '../../utilities/ErrorAssertions';
import { Matrix } from '../matrix/Matrix';
import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { Vector, VectorData } from './Vector';
import { VectorBuilder } from './VectorBuilder';

/**
 * The data stored in a {@link Vector} represented as a map
 * @public
 */
export type SparseVectorData<S> = ReadonlyMap<number, S>;

/**
 * A type guard which returns true if the input is an instance of `SparseVector`,
 * and functions as a type check in the compiler.
 *
 * @internal
 */
export function isSparse<S>(vector: Vector<S>): vector is SparseVector<S> {
  return (vector as any)._sparseData !== undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Implements {@link Vector} as a map of indices to nonzero values.
 *
 * @remarks
 * For large vectors with many entries equal to 0, some operations are
 * more efficient with a {@link Vector} implementation that only stores the non-zero values.
 *
 * Subclasses must specify the usual scalar operations on their contents.
 *
 * @public
 */
export abstract class SparseVector<S> implements Vector<S> {
  private readonly _dimension: number;
  private readonly _sparseData: SparseVectorData<S>;

  /**
   * @internal
   */
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
   * {@inheritDoc Vector.getSparseData}
   */
  public getSparseData(): Map<number, S> {
    return new Map(this._sparseData);
  }

  /**
   * {@inheritDoc Vector.toArray}
   */
  public toArray(): S[] {
    const data: S[] = [];
    for (let i = 0; i < this.getDimension(); i++) {
      data[i] = this.getEntry(i);
    }
    return data;
  }

  /**
   * {@inheritDoc Vector.getEntry}
   */
  public getEntry(index: number): S {
    assertValidVectorIndex(this, index);
    return this._sparseData.get(index) || this.ops().zero();
  }

  /**
   * {@inheritDoc Vector.set}
   */
  public set(index: number, value: S): Vector<S> {
    assertValidVectorIndex(this, index);
    const newData = this.getSparseData();
    newData.set(index, value);
    return this.builder().fromSparseData(this.getDimension(), newData);
  }

  /**
   * {@inheritDoc Vector.innerProduct}
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
   * {@inheritDoc Vector.outerProduct}
   */
  public outerProduct(other: Vector<S>): Matrix<S> {
    if (isSparse(other)) {
      return this.outerProductWithSparse(other);
    }

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
   * {@inheritDoc Vector.scalarMultiply}
   */
  public scalarMultiply(scalar: S): Vector<S> {
    const newSparseData = new Map();
    this._sparseData.forEach((value, index) => {
      newSparseData.set(index, this.ops().multiply(value, scalar));
    });
    return this.builder().fromSparseData(this._dimension, newSparseData);
  }

  /**
   * {@inheritDoc Vector.add}
   */
  public add(other: Vector<S>): Vector<S> {
    assertHomogeneous([this, other]);

    return this.builder().fromIndexFunction(this._dimension, i => {
      return this.ops().add(this.getEntry(i), other.getEntry(i));
    });
  }

  /**
   * {@inheritDoc Vector.equals}
   */
  public equals(other: Vector<S>): boolean {
    if (isSparse(other)) {
      return this.equalsSparse(other);
    }

    return other
      .toArray()
      .map((entry, i) => this.ops().equals(this.getEntry(i), entry))
      .reduce((all, current) => all && current, true);
  }

  /**
   * {@inheritDoc Vector.getDimension}
   */
  public getDimension(): number {
    return this._dimension;
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
    const m = this.getDimension();
    const n = other.getDimension();
    if (m === 0 || n === 0) return this.matrixBuilder().empty();

    const newData: Map<number, Map<number, S>> = new Map();

    this._sparseData.forEach((value, rowIndex) => {
      other.getSparseData().forEach((otherValue, colIndex) => {
        const newValue = this.ops().multiply(value, otherValue);
        const row = newData.get(rowIndex);
        if (!row) {
          const newRow: Map<number, S> = new Map();
          newRow.set(colIndex, newValue);
          newData.set(rowIndex, newRow);
        } else {
          row.set(colIndex, newValue);
        }
      });
    });
    return this.matrixBuilder().fromSparseData([m, n], newData);
  }

  /**
   * {@inheritDoc Vector.getDimension}
   */
  public forEach(callback: (entry: S, index: number) => void): void {
    this.toArray().forEach(callback);
  }

  /**
   * {@inheritDoc Vector.getDimension}
   */
  public map(valueFromEntry: (entry: S, index: number) => S): Vector<S> {
    return this.builder().fromArray(this.toArray().map(valueFromEntry));
  }

  /**
   * {@inheritDoc Vector.getDimension}
   */
  public combine(other: Vector<S>, combineEntries: (a: S, b: S) => S): Vector<S> {
    assertHomogeneous([this, other]);
    return this.map((entry, index) => combineEntries(entry, other.getEntry(index)));
  }
}
