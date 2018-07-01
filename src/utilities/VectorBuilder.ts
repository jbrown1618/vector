import { Vector, VectorData } from '../Vector';

export class VectorBuilder {
  static empty() {
    return Vector.fromData([]);
  }

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

  static ones(dimension: number) {
    if (dimension < 0) {
      throw Error();
    }

    const data: VectorData = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = 1;
    }

    return Vector.fromData(data);
  }

  static elementaryVector(dimension: number, oneIndex: number) {
    let vector = VectorBuilder.zeros(dimension);
    vector = vector.set(oneIndex, 1);
    return vector;
  }

  static concatenate(first: Vector, second: Vector) {
    return Vector.fromData([...first.getData(), ...second.getData()]);
  }
}
