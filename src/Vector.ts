import { AbstractVector } from "./AbstractVector";
import { Matrix } from "./Matrix";

export class Vector implements AbstractVector<Vector> {
  private readonly _contents: Array<number>;

  private constructor(contents: Array<number>) {
    this._contents = contents;
  }

  static fromArray(contents: Array<number>): Vector {
    return new Vector(contents);
  }

  static fromValues(...values: Array<number>): Vector {
    return Vector.fromArray(values);
  }

  public getContents(): Array<number> {
    return [...this._contents];
  }

  add(other: Vector): Vector {
    this.checkForDimensionMismatch(other);

    const newContents = this._contents.map((entry, i) => {
      return entry + other._contents[i];
    });
    return new Vector(newContents);
  }

  multiply(scalar: number): Vector {
    const newContents = this._contents.map(entry => entry * scalar);
    return new Vector(newContents);
  }

  innerProduct(other: Vector): number {
    const degenerateInnerProduct = 0;
    this.checkForDimensionMismatch(other);

    return this._contents
      .map((entry, i) => entry * other._contents[i])
      .reduce((sum, current) => sum + current, degenerateInnerProduct);
  }

  outerProduct(other: Vector): Matrix {
    const matrixData = [];

    if (this.getDimension() === 0 || other.getDimension() === 0) {
      return Matrix.fromData([]);
    }

    this.getContents().forEach((thisValue, rowIndex) => {
      matrixData[rowIndex] = [];
      other.getContents().forEach((otherValue, columnIndex) => {
        matrixData[rowIndex][columnIndex] = thisValue * otherValue;
      });
    });
    return Matrix.fromData(matrixData);
  }

  getDimension(): number {
    return this._contents.length;
  }

  private checkForDimensionMismatch(other: Vector) {
    if (this.getDimension() != other.getDimension()) {
      throw Error("Dimension mismatch");
    }
  }
}
