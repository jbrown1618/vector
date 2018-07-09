import { NumberVector } from '../types/NumberVector';
import { Vector, VectorData } from '../types/Vector';

export type VectorIndexFunction = (index: number) => number;
export type VectorEntryFunction = (entry: number, index: number) => number;

export class VectorBuilder {
  static fromData(data: VectorData<number>) {
    return new NumberVector(data);
  }

  static fromValues(...args: VectorData<number>) {
    return new NumberVector(args);
  }

  static empty() {
    return new NumberVector([]);
  }

  static zeros(dimension: number) {
    if (dimension < 0) {
      throw Error();
    }

    const data: VectorData<number> = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = 0;
    }

    return new NumberVector(data);
  }

  static ones(dimension: number) {
    if (dimension < 0) {
      throw Error();
    }

    const data: VectorData<number> = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = 1;
    }

    return new NumberVector(data);
  }

  static elementaryVector(dimension: number, oneIndex: number) {
    return VectorBuilder.fromIndexFunction(i => (i === oneIndex ? 1 : 0), dimension);
  }

  static concatenate(first: Vector<number>, second: Vector<number>) {
    new NumberVector([...first.getData(), ...second.getData()]);
  }

  static fromIndexFunction(valueFromIndex: VectorIndexFunction, length: number): Vector<number> {
    const data: VectorData<number> = [];
    for (let i = 0; i < length; i++) {
      data[i] = valueFromIndex(i);
    }
    return new NumberVector(data);
  }

  static transform(vector: Vector<number>, valueFromEntry: VectorEntryFunction): Vector<number> {
    return new NumberVector(vector.getData().map(valueFromEntry));
  }
}
