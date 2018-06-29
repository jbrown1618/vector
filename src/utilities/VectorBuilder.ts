import { Vector, VectorData } from '../Vector';

export class VectorBuilder {
  static zeros(dimension: number) {
    if (dimension < 0) {
      throw Error();
    }

    const data: VectorData = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = 0;
    }

    return Vector.fromData(data);
  }

  static elementaryVector(dimension: number, oneIndex: number) {
    if (dimension < 0) {
      throw Error();
    }

    const data: VectorData = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = i === oneIndex ? 1 : 0;
    }

    return Vector.fromData(data);
  }

  static concatenate(first: Vector, second: Vector) {
    return Vector.fromData([...first.getData(), ...second.getData()]);
  }
}
