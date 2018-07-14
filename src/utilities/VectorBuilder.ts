import { NumberVector } from '..';
import { Vector, VectorData } from '..';
import { assertValidIndex } from './ErrorAssertions';

export type VectorIndexFunction = (index: number) => number;
export type VectorEntryFunction = (entry: number, index: number) => number;

export class VectorBuilder {
  /**
   * Builds a Vector of dimension 0
   *
   * ```
   * VectorBuilder.empty(); // []
   * ```
   *
   * @returns {Vector<number>}
   */
  static empty(): Vector<number> {
    return NumberVector.fromData([]);
  }

  /**
   * Builds a vector of all zeros
   *
   * ```
   * VectorBuilder.zeros(3); // [ 0 0 0 ]
   * ```
   * @param {number} dimension  The dimension of the vector to construct
   * @returns {Vector<number>}
   */
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

  /**
   * Builds a vector of all ones
   *
   * ```
   * VectorBuilder.ones(3); // [ 1 1 1 ]
   * ```
   * @param {number} dimension
   * @returns {Vector<number>}
   */
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

  /**
   * Builds a vector that has the value 1 at one index, and 0 at the others
   *
   * ```
   * VectorBuilder.elementaryVector(4, 2); // [ 0 0 1 0 ]
   * VectorBuilder.elementaryVector(3, 0); // [ 1 0 0 ]
   * ```
   * @param {number} dimension
   * @param {number} oneIndex
   * @returns {Vector<number>}
   */
  static elementaryVector(dimension: number, oneIndex: number): Vector<number> {
    assertValidIndex(oneIndex, dimension);
    return VectorBuilder.fromIndexFunction(i => (i === oneIndex ? 1 : 0), dimension);
  }

  /**
   * Builds a vector consisting of two vectors end-to-end
   *
   * ```
   * const first = VectorBuilder.ones(3);
   * const second = VectorBuilder.zeros(2);
   *
   * VectorBuilder.concatenate(first, second); // [ 1 1 1 0 0 ]
   * ```
   * @param {Vector<number>} first
   * @param {Vector<number>} second
   * @returns {Vector<number>}
   */
  static concatenate(first: Vector<number>, second: Vector<number>): Vector<number> {
    return NumberVector.fromData([...first.getData(), ...second.getData()]);
  }

  /**
   * Builds a vector with entries given by _entry = f(i)_ where _f_ is `valueFromIndex`
   * and `i` is the index of the element
   *
   * ```
   * VectorBuilder.fromIndexFunction(i => i + 3, 4); // [ 3 4 5 6 ]
   * ```
   * @param {VectorIndexFunction} valueFromIndex  A function returning the entry for a given index
   * @param {number} length  The dimension of the vector to generate
   * @returns {Vector<number>}
   */
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
