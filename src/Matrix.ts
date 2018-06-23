import { LinearTransformation } from "./LinearTransformation";
import { Vector } from "./Vector";
import { AbstractVector } from "./AbstractVector";

export class Matrix implements LinearTransformation<Vector, Vector>, AbstractVector<Matrix> {
  private readonly _data: Array<Array<number>>;

  private constructor(data: Array<Array<number>>) {
    this._data = data;
  }

  static fromData(data: Array<Array<number>>) {
    return new Matrix(data);
  }

  static fromColumnVectors(columns: Array<Vector>) {
    const data = [];

    if ((columns.length = 0)) {
      return Matrix.fromData(data);
    }

    const columnDimension = columns[0].getDimension();
    columns.forEach(columnVector => {
      if (columnVector.getDimension() != columnDimension) {
        throw new Error("Column vectors must all have the same dimension");
      }
    });

    // initialize rows
    for (let i = 0; i < columnDimension; i++) {
      data[i] = [];
    }

    columns.forEach((columnVector, columnIndex) => {
      columnVector.getContents().forEach((value, rowIndex) => {
        data[rowIndex][columnIndex] = value;
      });
    });

    return Matrix.fromData(data);
  }

  static fromRowVectors(rows: Array<Vector>): Matrix {
    const data = [];

    if ((rows.length = 0)) {
      return Matrix.fromData(data);
    }

    const columnDimension = rows[0].getDimension();
    rows.forEach(columnVector => {
      if (columnVector.getDimension() != columnDimension) {
        throw new Error("Column vectors must all have the same dimension");
      }
    });

    return Matrix.fromData(rows.map(row => row.getContents()));
  }

  public getData(): Array<Array<number>> {
    return this._data;
  }

  add(other: Matrix): Matrix {
    return undefined;
  }

  apply(vector: Vector): Vector {
    return undefined;
  }

  getDimension(): number {
    return 0;
  }

  innerProduct(other: Matrix): number {
    return 0;
  }

  multiply(scalar: number): Matrix {
    return undefined;
  }
}
