export function approximatelyEqual(first: number, second: number, epsilon = 0.000001): boolean {
  if (Number.isNaN(first) || Number.isNaN(second)) {
    return false; // NaN should never equal itself
  }

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return false; // Infinities do not equal themselves
  }

  return Math.abs(first - second) < epsilon;
}

export function mod(num: number, modulus: number): number {
  // Operator % yields negative results for negative numbers.
  return ((num % modulus) + modulus) % modulus;
}

export function random(min = 0, max = 1): number {
  return min + Math.random() * (max - min);
}

export function randomNormal(mean = 0, standardDeviation = 1, numberOfSamples = 10): number {
  let total = 0;
  for (let i = 0; i < numberOfSamples; i++) {
    total += random();
  }

  const halfNumberOfSamples = numberOfSamples / 2;
  return mean + (standardDeviation * (total - halfNumberOfSamples)) / halfNumberOfSamples;
}

// memoize these results
const binomialResults: Map<number, Map<number, number>> = new Map();
const factorialResults: Map<number, number> = new Map();
factorialResults.set(0, 1);

export function binomial(n: number, k: number): number {
  if (!binomialResults.has(n)) {
    binomialResults.set(n, new Map());
  }
  const mapForA = binomialResults.get(n) as Map<number, number>;
  if (!mapForA.has(k)) {
    if (k > n) {
      mapForA.set(k, 0);
    } else {
      const numerator = factorial(n);
      const denominator = factorial(n - k) * factorial(k);
      const result = numerator / denominator;
      mapForA.set(k, result);
    }
  }

  return mapForA.get(k) as number;
}

export function factorial(n: number): number {
  if (!factorialResults.has(n)) {
    const result = n * factorial(n - 1);
    factorialResults.set(n, result);
  }

  return factorialResults.get(n) as number;
}

export function sigmoid(x: number): number {
  const ex = Math.exp(x);
  return ex / (1 + ex);
}
