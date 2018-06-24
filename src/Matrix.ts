import { LinearTransformation } from "./LinearTransformation";
import { Vector } from "./Vector";
import { AbstractVector } from "./AbstractVector";

export class Matrix implements LinearTransformation<Vector, Vector>, AbstractVector<Matrix> {
  private readonly _data: Array<Array<number>>;

  private constructor(data: Array<Array<number>>) {
    if (data.length > 0) {
      const rowDimension = data[0].length;
      for (let i = 0; i < data.length; i++) {
        if (data[i].length != rowDimension) {
          throw Error("Non-rectangular data");
        }
      }

      if (rowDimension === 0) {
        data = [];
      }
    }
    this._data = data;
  }

  static fromData(data: Array<Array<number>>) {
    return new Matrix(data);
  }

  static fromColumnVectors(columns: Array<Vector>) {
    const data = [];

    if (columns.length === 0) {
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
      columnVector.getData().forEach((value, rowIndex) => {
        data[rowIndex][columnIndex] = value;
      });
    });

    return Matrix.fromData(data);
  }

  static fromRowVectors(rows: Array<Vector>): Matrix {
    const data = [];

    if (rows.length === 0) {
      return Matrix.fromData(data);
    }

    const columnDimension = rows[0].getDimension();
    rows.forEach(columnVector => {
      if (columnVector.getDimension() != columnDimension) {
        throw new Error("Column vectors must all have the same dimension");
      }
    });

    return Matrix.fromData(rows.map(row => row.getData()));
  }

  public getData(): Array<Array<number>> {
    return this.getRowVectors().map(row => row.getData());
  }

  public getNumberOfRows(): number {
    return this.getRowVectors().length;
  }

  public getNumberOfColumns(): number {
    return this.getColumnVectors().length;
  }

  public getRowVectors(): Array<Vector> {
    return this._data.map(row => Vector.fromArray(row));
  }

  public getRow(rowIndex: number): Vector {
    if (rowIndex > this.getNumberOfRows() - 1 || rowIndex < 0) {
      throw new Error("Index out of bounds");
    }
    return this.getColumnVectors()[rowIndex];
  }

  public getColumnVectors(): Array<Vector> {
    return this.transpose().getRowVectors();
  }

  public getColumn(columnIndex: number): Vector {
    if (columnIndex > this.getNumberOfColumns() - 1 || columnIndex < 0) {
      throw new Error("Index out of bounds");
    }
    return this.getColumnVectors()[columnIndex];
  }

  public getEntry(rowIndex: number, columnIndex: number) {
    return this.getRow(rowIndex).getEntry(columnIndex);
  }

  public getDimension(): number {
    return this.getNumberOfRows() * this.getNumberOfColumns();
  }

  public multiply(other: Matrix): Matrix {
    if (this.getNumberOfColumns() !== other.getNumberOfRows()) {
      throw new Error("Dimension mismatch");
    }

    return Matrix.fromData(
      this.getRowVectors().map(row =>
        other.getColumnVectors().map(column => row.innerProduct(column))
      )
    );
  }

  public transpose(): Matrix {
    return Matrix.fromColumnVectors(this.getRowVectors());
  }

  public add(other: Matrix): Matrix {
    return Matrix.fromColumnVectors(
      this.getColumnVectors().map((column, columnIndex) => column.add(other.getColumn(columnIndex)))
    );
  }

  public apply(vector: Vector): Vector {
    const vectorAsColumnMatrix = Matrix.fromColumnVectors([vector]);
    return this.multiply(vectorAsColumnMatrix).getColumn(0);
  }

  public innerProduct(other: Matrix): number {
    return this.getRowVectors()
      .map((row, rowIndex) => row.innerProduct(other.getRow(rowIndex)))
      .reduce((sum, next) => sum + next);
  }

  public scalarMultiply(scalar: number): Matrix {
    return Matrix.fromColumnVectors(
      this.getColumnVectors().map(column => column.scalarMultiply(scalar))
    );
  }

  public equals(other: Matrix): boolean {
    if (this.getNumberOfColumns() !== other.getNumberOfColumns()) {
      return false;
    }

    if (this.getNumberOfRows() !== other.getNumberOfRows()) {
      return false;
    }

    return this.getColumnVectors()
      .map((column, i) => column.equals(other.getColumn(i)))
      .reduce((all, current) => all && current, true);
  }
}
