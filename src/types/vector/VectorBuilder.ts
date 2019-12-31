import { assertValidDimension, assertValidIndex } from '../../utilities/ErrorAssertions';
import { mod } from '../../utilities/NumberUtilities';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { SparseVectorData } from './SparseVector';
import { Vector, VectorConstructor, VectorData } from './Vector';

/**
 * A function that generates a vector entry based on its index
 *
 * @remarks
 * This should be a pure function
 *
 * @public
 */
export type VectorIndexFunction<S> = (index: number) => S;

/**
 * Provides methods for constructing {@link Vector}s of a given type
 * @public
 */
export class VectorBuilder<S, V extends Vector<S>> {
  private readonly _vectorConstructor: VectorConstructor<S, V>;

  /**
   * @internal
   */
  constructor(vectorConstructor: VectorConstructor<S, V>) {
    this._vectorConstructor = vectorConstructor;
  }

  public fromValues(...data: VectorData<S>): V {
    return this.fromArray(data);
  }

  public fromArray(data: VectorData<S>): V {
    return new this._vectorConstructor(data);
  }

  public fromNumberArray(data: VectorData<number>): V {
    const ops = this.ops();
    return this.fromArray(data.map(num => ops.fromNumber(num)));
  }

  public fromSparseData(dimension: number, sparseData: SparseVectorData<S>): V {
    const data: S[] = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = this.ops().zero();
    }
    sparseData.forEach((value, index) => {
      data[index] = value;
    });
    return this.fromArray(data);
  }

  /**
   * Constructs a vector with entries given by _entry = f(i)_ where _f_ is `valueFromIndex`
   * and `i` is the index of the element
   *
   * @example
   * ```
   * vectorBuilder.fromIndexFunction(4, i => i + 3); // [ 3 4 5 6 ]
   * ```
   * @param dimension - The dimension of the vector to generate
   * @param valueFromIndex - A function returning the entry for a given index
   * @returns The new vector
   */
  public fromIndexFunction(dimension: number, valueFromIndex: VectorIndexFunction<S>): V {
    assertValidDimension(dimension);
    const data: S[] = [];
    for (let i = 0; i < dimension; i++) {
      data[i] = valueFromIndex(i);
    }
    return this.fromArray(data);
  }

  /**
   * Constructs a Vector of dimension 0
   *
   * @example
   * ```
   * vectorBuilder.empty(); // []
   * ```
   *
   * @returns The new vector
   */
  public empty(): V {
    return this.fromArray([]);
  }

  /**
   * Constructs a vector whose entries are all equal to the provided value
   *
   * @example
   * ```
   * vectorBuilder.fill(3, 5); // [ 3 3 3 3 3 ]
   * ```
   *
   * @param value - The value to use as the entries of the new vector
   * @param dimension - The dimension of the new vector
   * @returns The new vector
   */
  public fill(value: S, dimension: number): V {
    assertValidDimension(dimension);
    return this.fromIndexFunction(dimension, () => value);
  }

  /**
   * Constructs a vector of all zeros
   *
   * @example
   * ```
   * vectorBuilder.zeros(3); // [ 0 0 0 ]
   * ```
   * @param dimension - The dimension of the vector to construct
   * @returns The new vector
   */
  public zeros(dimension: number): V {
    return this.fill(this.ops().zero(), dimension);
  }

  /**
   * Constructs a vector of all ones
   *
   * @example
   * ```
   * vectorBuilder.ones(3); // [ 1 1 1 ]
   * ```
   * @param dimension - The dimension of the new vector
   * @returns The new vector
   */
  public ones(dimension: number): V {
    return this.fill(this.ops().one(), dimension);
  }

  /**
   * Constructs a vector that has the value 1 at one index, and 0 at the others
   *
   * @example
   * ```
   * vectorBuilder.elementaryVector(4, 2); // [ 0 0 1 0 ]
   * vectorBuilder.elementaryVector(3, 0); // [ 1 0 0 ]
   * ```
   * @param dimension - The dimension of the new vector
   * @param oneIndex - The index of the element that should be the multiplicative identity
   * @returns The new vector
   */
  public elementaryVector(dimension: number, oneIndex: number): V {
    assertValidDimension(dimension);
    assertValidIndex(oneIndex, dimension);
    return this.fromIndexFunction(dimension, i =>
      i === oneIndex ? this.ops().one() : this.ops().zero()
    );
  }

  /**
   * Constructs a vector whose entries match the input vector, but offset by a given amount
   *
   * @example
   * ```
   * const original = vectorBuilder.fromArray([1, 2, 3]);
   * const rightOne = vectorBuilder.rotate(original); // [2, 3, 1];
   * const rightTwo = vectorBuilder.rotate(original, 2); // [3, 1, 2];
   * const leftOne = vectorBuilder.rotate(original, 1, true); // [3, 1, 2];
   * ```
   *
   * @param vector - The vector whose entries to use
   * @param offset - The amount by which to shift the indices
   * @param reverse - Shift entries backward rather than forward
   */
  public shift(vector: Vector<S>, offset = 1, reverse = false): V {
    const dim = vector.getDimension();
    return this.fromIndexFunction(dim, i => {
      const indexToUse = mod(reverse ? i - offset : i + offset, dim);
      return vector.getEntry(indexToUse);
    });
  }

  /**
   * Constructs a vector whose entries are (uniformly-distributed) random numbers
   * between `min` and `max`
   *
   * @param dimension - The dimension of the new vector
   * @param min - The lower limit of the random numbers to include
   * @param max - The upper limit of the random numbers to include
   */
  public random(dimension: number, min = 0, max = 1): V {
    if (min >= max) {
      throw Error(`Expected min < max; got ${min} and ${max}`);
    }
    return this.fromIndexFunction(dimension, () => this.ops().random(min, max));
  }

  /**
   * Constructs a vector whose entries are normally distributed, with the specified
   * mean and standard deviation
   *
   * @param dimension - The dimension of the new vector
   * @param mean - The center of the distribution of random numbers to include
   * @param standardDeviation - The standard deviation of the distribution of random numbers to include
   */
  public randomNormal(dimension: number, mean = 0, standardDeviation = 1): V {
    if (standardDeviation <= 0) {
      throw Error(`Expected standardDeviation > 0; got ${standardDeviation}`);
    }
    return this.fromIndexFunction(dimension, () =>
      this.ops().randomNormal(mean, standardDeviation)
    );
  }

  /**
   * Constructs a vector consisting of two vectors end-to-end
   *
   * @example
   * ```
   * const first = vectorBuilder.ones(3);
   * const second = vectorBuilder.zeros(2);
   *
   * vectorBuilder.concatenate(first, second); // [ 1 1 1 0 0 ]
   * ```
   * @param first - The vector which will be used for the entries starting with index 0
   * @param second - The vector which will be used for the entries starting with `first.getDimension()`
   * @returns The new vector
   */
  public concatenate(first: Vector<S>, second: Vector<S>): V {
    return this.fromArray([...first.toArray(), ...second.toArray()]);
  }

  private ops(): ScalarOperations<S> {
    return this._vectorConstructor.ops();
  }
}
