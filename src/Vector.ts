import { AbstractVector } from "./AbstractVector";

export class Vector implements AbstractVector<Vector> {
  private _contents: Array<number>;

  constructor(contents: Array<number>) {
    this._contents = contents;
  }

  add(other: Vector): Vector {
    if (this.getDimension() != other.getDimension()) {
      throw Error("Dimension mismatch");
    }
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
    return this._contents
      .map((entry, i) => entry * other._contents[i])
      .reduce((sum, current) => sum + current);
  }

  getDimension(): number {
    return this._contents.length;
  }

  toString(): string {
    return this._contents.map(entry => `[ ${entry} ]\n`).reduce((sum, current) => sum + current);
  }
}
