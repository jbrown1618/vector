import { NumberVector } from '..';
import { Vector, VectorData } from '..';
import { assertValidIndex } from './ErrorAssertions';

export type VectorIndexFunction = (index: number) => number;
export type VectorEntryFunction = (entry: number, index: number) => number;

export class VectorBuilder {
  static empty(): Vector<number> {
    return NumberVector.fromData([]);
  }

  static zeros(dimension: number): Vector<number> {
    if (dimension < 0) {
      throw Error();
    }

    const data: VectorData<number> = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = 0;
    }

    return NumberVector.fromData(data);
  }

  static ones(dimension: number): Vector<number> {
    if (dimension < 0) {
      throw Error();
    }

    const data: VectorData<number> = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = 1;
    }

    return NumberVector.fromData(data);
  }

  static elementaryVector(dimension: number, oneIndex: number): Vector<number> {
    assertValidIndex(oneIndex, dimension);
    return VectorBuilder.fromIndexFunction(i => (i === oneIndex ? 1 : 0), dimension);
  }

  static concatenate(first: Vector<number>, second: Vector<number>): Vector<number> {
    return NumberVector.fromData([...first.getData(), ...second.getData()]);
  }

  static fromIndexFunction(valueFromIndex: VectorIndexFunction, length: number): Vector<number> {
    const data: VectorData<number> = [];
    for (let i = 0; i < length; i++) {
      data[i] = valueFromIndex(i);
    }
    return NumberVector.fromData(data);
  }

  static transform(vector: Vector<number>, valueFromEntry: VectorEntryFunction): Vector<number> {
    return NumberVector.fromData(vector.getData().map(valueFromEntry));
  }
}
