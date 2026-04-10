/**
 * Samples an index from a discrete probability distribution.
 *
 * @example
 * ```
 * const index = sampleFromDistribution([0.1, 0.7, 0.2]);
 * // returns 0, 1, or 2 with the given probabilities
 * ```
 *
 * @param probabilities - An array of non-negative numbers that sum to 1
 * @returns A randomly chosen index, weighted by the given probabilities
 * @public
 */
export function sampleFromDistribution(probabilities: number[]): number {
  if (probabilities.length === 0) {
    throw new Error('Cannot sample from an empty distribution');
  }

  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (rand < cumulative) return i;
  }
  return probabilities.length - 1;
}

/**
 * Returns the index of the maximum value in an array.
 *
 * @example
 * ```
 * const index = argmax([0.1, 0.7, 0.2]);
 * // returns 1
 * ```
 *
 * @param values - A non-empty array of numbers
 * @returns The index of the largest value
 * @public
 */
export function argmax(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Cannot compute argmax of an empty array');
  }

  let maxIndex = 0;
  let maxValue = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > maxValue) {
      maxValue = values[i];
      maxIndex = i;
    }
  }
  return maxIndex;
}
