export function approximatelyEqual(first: number, second: number, epsilon: number = 0.000001) {
  if (Number.isNaN(first) || Number.isNaN(second)) {
    return false; // NaN should never equal itself
  }

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return false; // Infinities do not equal themselves
  }

  return Math.abs(first - second) < epsilon;
}

export function random(min: number = 0, max: number = 1) {
  return min + Math.random() * (max - min);
}

export function randomNormal(
  mean: number = 0,
  standardDeviation: number = 1,
  numberOfSamples: number = 10
) {
  let total = 0;
  for (let i = 0; i < numberOfSamples; i++) {
    total += Math.random();
  }

  const halfNumberOfSamples = numberOfSamples / 2;
  return mean + (standardDeviation * (total - halfNumberOfSamples)) / halfNumberOfSamples;
}
