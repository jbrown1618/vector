import { AbstractVector } from './AbstractVector';
import { Matrix, MatrixData } from './Matrix';

export type VectorData = Array<number>;

export class Vector implements AbstractVector<Vector> {
  private readonly _data: VectorData;

  private constructor(contents: VectorData) {
    this._data = contents;
  }

  static fromData(contents: VectorData): Vector {
    return new Vector(contents);
  }

  static fromValues(...values: VectorData): Vector {
    return Vector.fromData(values);
  }

  public getData(): VectorData {
    return [...this._data];
  }

  public getEntry(index: number): number {
    if (index >= this.getDimension()) {
      throw new Error('Index out of bounds');
    }
    return this._data[index];
  }

  public add(other: Vector): Vector {
    this.checkForDimensionMismatch(other);

    const newContents = this._data.map((entry, i) => {
      return entry + other._data[i];
    });
    return new Vector(newContents);
  }

  public scalarMultiply(scalar: number): Vector {
    const newContents = this._data.map(entry => entry * scalar);
    return new Vector(newContents);
  }

  public innerProduct(other: Vector): number {
    const degenerateInnerProduct = 0;
    this.checkForDimensionMismatch(other);

    return this._data
      .map((entry, i) => entry * other._data[i])
      .reduce((sum, current) => sum + current, degenerateInnerProduct);
  }

  public outerProduct(other: Vector): Matrix {
    const matrixData: MatrixData = [];

    if (this.getDimension() === 0 || other.getDimension() === 0) {
      return Matrix.fromData([]);
    }

    this.getData().forEach((thisValue, rowIndex) => {
      matrixData[rowIndex] = [];
      other.getData().forEach((otherValue, columnIndex) => {
        matrixData[rowIndex][columnIndex] = thisValue * otherValue;
      });
    });
    return Matrix.fromData(matrixData);
  }

  public getDimension(): number {
    return this._data.length;
  }

  public approxEquals(other: Vector): boolean {
    if (this.getDimension() !== other.getDimension()) {
      return false;
    }

    return this.getData()
      .map((entry, i) => Math.abs(entry - other.getEntry(i)) < 0.0000001)
      .reduce((all, current) => all && current, true);
  }

  private checkForDimensionMismatch(other: Vector) {
    if (this.getDimension() != other.getDimension()) {
      throw Error('Dimension mismatch');
    }
  }
}
