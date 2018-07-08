import { Vector, VectorData } from './Vector';

export abstract class ArrayVector<ScalarType> implements Vector<ScalarType> {
  private readonly _data: VectorData<ScalarType>;

  protected constructor(data: VectorData<ScalarType>) {
    this._data = data;
  }

  protected abstract newFromData(data: VectorData<ScalarType>): ArrayVector<ScalarType>;

  abstract addScalars(first: ScalarType, second: ScalarType): ScalarType;

  abstract scalarsEqual(first: ScalarType, second: ScalarType): boolean;

  abstract multiplyScalars(first: ScalarType, second: ScalarType): ScalarType;

  abstract conjugateScalar(scalar: ScalarType): ScalarType;

  abstract getAdditiveIdentity(): ScalarType;

  abstract getMultiplicativeIdentity(): ScalarType;

  getEntry(index: number): ScalarType {
    return this._data[index];
  }

  add(other: Vector<ScalarType>): Vector<ScalarType> {
    const newData = this.getData().map((entry, index) =>
      this.addScalars(entry, other.getEntry(index))
    );

    return this.newFromData(newData);
  }

  equals(other: Vector<ScalarType>): boolean {
    if (this.getDimension() !== other.getDimension()) {
      return false;
    }

    return this._data
      .map((entry, i) => this.scalarsEqual(entry, other.getEntry(i)))
      .reduce((all, current) => all && current, true);
  }

  innerProduct(other: Vector<ScalarType>): ScalarType {
    return this._data
      .map((entry, index) => this.multiplyScalars(entry, other.getEntry(index)))
      .reduce(this.addScalars, this.getAdditiveIdentity());
  }

  scalarMultiply(scalar: ScalarType): Vector<ScalarType> {
    return this.newFromData(this.getData().map(entry => this.multiplyScalars(entry, scalar)));
  }

  getData(): VectorData<ScalarType> {
    return [...this._data];
  }

  getDimension(): number {
    return this._data.length;
  }
}
