import { Vector, VectorData } from './Vector';
import { Matrix } from './Matrix';
import { assertValidVectorIndex } from '../utilities/ErrorAssertions';
import { ScalarOperations } from './ScalarOperations';
import { MatrixBuilder, VectorBuilder } from '..';

export type SparseVectorDataEntry<ScalarType> = {
  readonly index: number;
  readonly value: ScalarType;
};

export type SparseVectorData<ScalarType> = Array<SparseVectorDataEntry<ScalarType>>;

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
    const sparseData: SparseVectorData<ScalarType> = [];
    data.forEach((value: ScalarType, index: number) => {
      if (!this.ops().equals(this.ops().zero(), value)) {
        sparseData.push({ index, value });
      }
    });
    this._sparseData = sparseData;
  }

  abstract ops(): ScalarOperations<ScalarType>;

  abstract builder(): VectorBuilder<ScalarType, Vector<ScalarType>>;

  abstract matrixBuilder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;

  getSparseData(): SparseVectorData<ScalarType> {
    return [...this._sparseData];
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
    const matching = this._sparseData.filter(sparseEntry => sparseEntry.index === index);
    return matching.length ? matching[0].value : this.ops().zero();
  }

  innerProduct(other: Vector<ScalarType>): ScalarType {
    return this._sparseData
      .map(sparseEntry => this.ops().multiply(sparseEntry.value, other.getEntry(sparseEntry.index)))
      .reduce(this.ops().add, this.ops().zero());
  }

  outerProduct(other: Vector<ScalarType>): Matrix<ScalarType> {
    return this.matrixBuilder().fromData([other.getData()]); // TODO - implement
  }

  scalarMultiply(scalar: ScalarType): Vector<ScalarType> {
    return this.builder().fromSparseData(
      this._dimension,
      this._sparseData.map(sparseEntry => {
        return {
          index: sparseEntry.index,
          value: this.ops().multiply(sparseEntry.value, scalar)
        };
      })
    );
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
    const thisSparseData = this._sparseData;
    const otherSparseData = other._sparseData;

    if (thisSparseData.length !== otherSparseData.length) {
      return false;
    }

    return thisSparseData
      .map(sparseEntry => this.ops().equals(sparseEntry.value, other.getEntry(sparseEntry.index)))
      .reduce((all, current) => all && current, true);
  }

  getDimension(): number {
    return this._dimension;
  }
}
