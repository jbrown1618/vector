import { AbstractVector } from "./AbstractVector";
import { Matrix } from "./Matrix";

export class Vector implements AbstractVector<Vector> {
  private readonly _data: Array<number>;

  private constructor(contents: Array<number>) {
    this._data = contents;
  }

  static fromArray(contents: Array<number>): Vector {
    return new Vector(contents);
  }

  static fromValues(...values: Array<number>): Vector {
    return Vector.fromArray(values);
  }

  public getData(): Array<number> {
    return [...this._data];
  }

  public getEntry(index: number): number {
    if (index >= this.getDimension()) {
      throw new Error("Index out of bounds");
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
    const matrixData = [];

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

  public equals(other: Vector): boolean {
    if (this.getDimension() !== other.getDimension()) {
      return false;
    }

    return this.getData()
      .map((entry, i) => entry === other.getEntry(i))
      .reduce((all, current) => all && current, true);
  }

  private checkForDimensionMismatch(other: Vector) {
    if (this.getDimension() != other.getDimension()) {
      throw Error("Dimension mismatch");
    }
  }
}
