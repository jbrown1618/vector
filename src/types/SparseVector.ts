import { Vector, VectorData } from './Vector';
import { Matrix, MatrixData } from './Matrix';
import { assertValidVectorIndex } from '../utilities/ErrorAssertions';

export type SparseVectorDataEntry<ScalarType> = {
  readonly index: number;
  readonly value: ScalarType;
};

export type SparseVectorData<ScalarType> = Array<SparseVectorDataEntry<ScalarType>>;

export function isSparse<ScalarType>(
  vector: Vector<ScalarType>
): vector is SparseVector<ScalarType> {
  return (<SparseVector<ScalarType>>vector).getSparseData !== undefined;
}

export abstract class SparseVector<ScalarType> implements Vector<ScalarType> {
  private readonly _dimension: number;
  private readonly _sparseData: SparseVectorData<ScalarType>;

  protected constructor(dimension: number, data: SparseVectorData<ScalarType>) {
    this._dimension = dimension;
    this._sparseData = data;
  }

  protected abstract newFromSparseData(
    sparseData: SparseVectorData<ScalarType>
  ): SparseVector<ScalarType>;

  protected abstract makeMatrix(data: MatrixData<ScalarType>): Matrix<ScalarType>;

  abstract addScalars(first: ScalarType, second: ScalarType): ScalarType;

  abstract multiplyScalars(first: ScalarType, second: ScalarType): ScalarType;

  abstract scalarsEqual(first: ScalarType, second: ScalarType): boolean;

  abstract conjugateScalar(scalar: ScalarType): ScalarType;

  abstract getAdditiveIdentity(): ScalarType;

  abstract getMultiplicativeIdentity(): ScalarType;

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
    return matching.length ? matching[0].value : this.getAdditiveIdentity();
  }

  innerProduct(other: Vector<ScalarType>): ScalarType {
    return this._sparseData
      .map(sparseEntry =>
        this.multiplyScalars(sparseEntry.value, other.getEntry(sparseEntry.index))
      )
      .reduce(this.addScalars, this.getAdditiveIdentity());
  }

  outerProduct(other: Vector<ScalarType>): Matrix<ScalarType> {
    return this.makeMatrix([other.getData()]); // TODO - implement
  }

  scalarMultiply(scalar: ScalarType): Vector<ScalarType> {
    return this.newFromSparseData(
      this._sparseData.map(sparseEntry => {
        return {
          index: sparseEntry.index,
          value: this.multiplyScalars(sparseEntry.value, scalar)
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
      .map((entry, i) => this.scalarsEqual(this.getEntry(i), entry))
      .reduce((all, current) => all && current, true);
  }

  private equalsSparse(other: SparseVector<ScalarType>): boolean {
    const thisSparseData = this._sparseData;
    const otherSparseData = other._sparseData;

    if (thisSparseData.length !== otherSparseData.length) {
      return false;
    }

    return thisSparseData
      .map(sparseEntry => this.scalarsEqual(sparseEntry.value, other.getEntry(sparseEntry.index)))
      .reduce((all, current) => all && current, true);
  }

  getDimension(): number {
    return this._dimension;
  }
}
