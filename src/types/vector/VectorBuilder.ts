import { SparseVectorData, Vector, VectorConstructor, VectorData } from '../../index';
import { assertValidIndex } from '../../utilities/ErrorAssertions';
import { ScalarOperations } from '../scalar/ScalarOperations';

export type VectorIndexFunction<ScalarType> = (index: number) => ScalarType;
export type VectorEntryFunction<ScalarType> = (entry: ScalarType, index: number) => ScalarType;

export class VectorBuilder<ScalarType, VectorType extends Vector<ScalarType>> {
  private readonly _vectorConstructor: VectorConstructor<ScalarType, VectorType>;

  constructor(vectorConstructor: VectorConstructor<ScalarType, VectorType>) {
    this._vectorConstructor = vectorConstructor;
  }

  private ops(): ScalarOperations<ScalarType> {
    return this._vectorConstructor.ops();
  }

  /**
   * Builds a Vector of dimension 0
   *
   * ```
   * VectorBuilder.empty(); // []
   * ```
   *
   * @returns {VectorType}
   */
  empty(): VectorType {
    return this.fromData([]);
  }

  /**
   * Builds a vector of all zeros
   *
   * ```
   * VectorBuilder.zeros(3); // [ 0 0 0 ]
   * ```
   * @param {number} dimension  The dimension of the vector to construct
   * @returns {VectorType}
   */
  zeros(dimension: number): VectorType {
    if (dimension < 0) {
      throw Error();
    }

    return this.fromIndexFunction(dimension, () => this.ops().zero());
  }

  /**
   * Builds a vector of all ones
   *
   * ```
   * VectorBuilder.ones(3); // [ 1 1 1 ]
   * ```
   * @param {number} dimension
   * @returns {VectorType}
   */
  ones(dimension: number): VectorType {
    if (dimension < 0) {
      throw Error();
    }

    return this.fromIndexFunction(dimension, () => this.ops().one());
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
   * @returns {VectorType}
   */
  elementaryVector(dimension: number, oneIndex: number): VectorType {
    assertValidIndex(oneIndex, dimension);
    return this.fromIndexFunction(
      dimension,
      i => (i === oneIndex ? this.ops().one() : this.ops().zero())
    );
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
   * @param {VectorType} first
   * @param {VectorType} second
   * @returns {VectorType}
   */
  concatenate(first: VectorType, second: VectorType): VectorType {
    return this.fromData([...first.getData(), ...second.getData()]);
  }

  /**
   * Builds a vector with entries given by _entry = f(i)_ where _f_ is `valueFromIndex`
   * and `i` is the index of the element
   *
   * ```
   * VectorBuilder.fromIndexFunction(i => i + 3, 4); // [ 3 4 5 6 ]
   * ```
   * @param {number} size  The dimension of the vector to generate
   * @param {VectorIndexFunction} valueFromIndex  A function returning the entry for a given index
   * @returns {VectorType}
   */
  fromIndexFunction(size: number, valueFromIndex: VectorIndexFunction<ScalarType>): VectorType {
    const data: VectorData<ScalarType> = [];
    for (let i = 0; i < size; i++) {
      data[i] = valueFromIndex(i);
    }
    return this.fromData(data);
  }

  map(vector: VectorType, valueFromEntry: VectorEntryFunction<ScalarType>): VectorType {
    return this.fromData(vector.getData().map(valueFromEntry));
  }

  fromData(data: VectorData<ScalarType>): VectorType {
    return new this._vectorConstructor(data);
  }

  fromValues(...data: VectorData<ScalarType>): VectorType {
    return this.fromData(data);
  }

  fromSparseData(dimension: number, sparseData: SparseVectorData<ScalarType>): VectorType {
    const data: VectorData<ScalarType> = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = this.ops().zero();
    }
    sparseData.forEach((value, index) => {
      data[index] = value;
    });
    return this.fromData(data);
  }
}
