import { vec } from '../utilities/aliases';
import { Vector } from '../types/vector/Vector';

/**
 * Computes the softmax of an array of numbers, using the max-subtraction trick
 * for numerical stability.
 *
 * @example
 * ```
 * const probs = softmaxArray([1, 2, 3]);
 * // probs ≈ [0.0900, 0.2447, 0.6652]
 * ```
 *
 * @param values - An array of logits
 * @returns An array of probabilities that sum to 1
 * @public
 */
export function softmaxArray(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }

  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > max) max = values[i];
  }

  const exps = new Array<number>(values.length);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    exps[i] = Math.exp(values[i] - max);
    sum += exps[i];
  }

  for (let i = 0; i < exps.length; i++) {
    exps[i] /= sum;
  }

  return exps;
}

/**
 * Computes the softmax of a {@link Vector} of logits.
 *
 * @example
 * ```
 * const probs = softmax(vec([1, 2, 3]));
 * // probs ≈ [ 0.0900, 0.2447, 0.6652 ]
 * ```
 *
 * @param v - A vector of logits
 * @returns A vector of probabilities that sum to 1
 * @public
 */
export function softmax(v: Vector<number>): Vector<number> {
  return vec(softmaxArray(v.toArray()));
}

/**
 * Applies the ReLU (Rectified Linear Unit) activation function element-wise
 * to an array of numbers.
 *
 * @example
 * ```
 * const result = reluArray([-1, 0, 2, -3, 4]);
 * // result = [0, 0, 2, 0, 4]
 * ```
 *
 * @param values - An array of numbers
 * @returns An array where negative values are replaced with 0
 * @public
 */
export function reluArray(values: number[]): number[] {
  const result = new Array<number>(values.length);
  for (let i = 0; i < values.length; i++) {
    result[i] = values[i] > 0 ? values[i] : 0;
  }
  return result;
}

/**
 * Applies the ReLU (Rectified Linear Unit) activation function element-wise
 * to a {@link Vector}.
 *
 * @example
 * ```
 * const result = relu(vec([-1, 0, 2, -3, 4]));
 * // result = [ 0, 0, 2, 0, 4 ]
 * ```
 *
 * @param v - A vector of numbers
 * @returns A vector where negative entries are replaced with 0
 * @public
 */
export function relu(v: Vector<number>): Vector<number> {
  return v.map((x) => (x > 0 ? x : 0));
}

/**
 * Applies the sigmoid activation function element-wise to an array of numbers.
 *
 * @example
 * ```
 * const result = sigmoidArray([0, 1, -1]);
 * // result ≈ [0.5, 0.7311, 0.2689]
 * ```
 *
 * @param values - An array of numbers
 * @returns An array of values in the range (0, 1)
 * @public
 */
export function sigmoidArray(values: number[]): number[] {
  const result = new Array<number>(values.length);
  for (let i = 0; i < values.length; i++) {
    result[i] = 1 / (1 + Math.exp(-values[i]));
  }
  return result;
}

/**
 * Applies the sigmoid activation function element-wise to a {@link Vector}.
 *
 * @example
 * ```
 * const result = sigmoid(vec([0, 1, -1]));
 * // result ≈ [ 0.5, 0.7311, 0.2689 ]
 * ```
 *
 * @param v - A vector of numbers
 * @returns A vector of values in the range (0, 1)
 * @public
 */
export function sigmoid(v: Vector<number>): Vector<number> {
  return v.map((x) => 1 / (1 + Math.exp(-x)));
}
