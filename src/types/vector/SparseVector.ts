import { Vector, VectorData } from './Vector';
import { Matrix } from '../matrix/Matrix';
import { assertValidVectorIndex } from '../../utilities/ErrorAssertions';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { MatrixBuilder, VectorBuilder } from '../../index';

export type SparseVectorData<ScalarType> = Map<number, ScalarType>;

/**
 * A type guard which returns true if the input is an instance of `SparseVector`,
 * and functions as a type check in the compiler.
 */
export function isSparse<ScalarType>(
  vector: Vector<ScalarType>
): vector is SparseVector<ScalarType> {
  return (<SparseVector<ScalarType>>vector).getSparseData !== undefined;
}

/**
 * For large vectors with many entries equal to 0, some operations are
 * more efficient with a `Vector` implementation that only stores the non-zero values.
 */
export abstract class SparseVector<ScalarType> implements Vector<ScalarType> {
  private readonly _dimension: number;
  private readonly _sparseData: SparseVectorData<ScalarType>;

  protected constructor(dimension: number, data: VectorData<ScalarType>) {
    this._dimension = dimension;
    const sparseData: SparseVectorData<ScalarType> = new Map();
    data.forEach((value: ScalarType, index: number) => {
      if (!this.ops().equals(this.ops().zero(), value)) {
        sparseData.set(index, value);
      }
    });
    this._sparseData = sparseData;
  }

  abstract ops(): ScalarOperations<ScalarType>;

  abstract builder(): VectorBuilder<ScalarType, Vector<ScalarType>>;

  abstract matrixBuilder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;

  getSparseData(): SparseVectorData<ScalarType> {
    return this._sparseData;
  }

  getData(): VectorData<ScalarType> {
    const data: VectorData<ScalarType> = [];
    for (let i = 0; i < this.getDimension(); i++) {
      data[i] = this.getEntry(i);
    }
    return data;
  }

  getEntry(index: number): ScalarType {
    assertValidVectorIndex(this, index);
    return this._sparseData.get(index) || this.ops().zero();
  }

  innerProduct(other: Vector<ScalarType>): ScalarType {
    let innerProduct: ScalarType = this.ops().zero();
    this._sparseData.forEach((value, index) => {
      innerProduct = this.ops().add(
        innerProduct,
        this.ops().multiply(value, other.getEntry(index))
      );
    });
    return innerProduct;
  }

  outerProduct(other: Vector<ScalarType>): Matrix<ScalarType> {
    // TODO - implement.  This is just here to satisfy the compiler.
    return this.matrixBuilder().fromData([other.getData()]);
  }

  scalarMultiply(scalar: ScalarType): Vector<ScalarType> {
    const newSparseData = new Map();
    this._sparseData.forEach((value, index) => {
      newSparseData.set(index, this.ops().multiply(value, scalar));
    });
    return this.builder().fromSparseData(this._dimension, newSparseData);
  }

  abstract add(other: Vector<ScalarType>): Vector<ScalarType>;

  equals(other: Vector<ScalarType>): boolean {
    if (isSparse(other)) {
      return this.equalsSparse(other);
    }

    return other
      .getData()
      .map((entry, i) => this.ops().equals(this.getEntry(i), entry))
      .reduce((all, current) => all && current, true);
  }

  private equalsSparse(other: SparseVector<ScalarType>): boolean {
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
    return hasMismatch;
  }

  getDimension(): number {
    return this._dimension;
  }
}
