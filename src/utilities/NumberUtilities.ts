export function approximatelyEqual(first: number, second: number, epsilon: number = 0.000001) {
  if (Number.isNaN(first) || Number.isNaN(second)) {
    return false; // NaN should never equal itself
  }

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return false; // Infinities do not equal themselves
  }

  return Math.abs(first - second) < epsilon;
}
