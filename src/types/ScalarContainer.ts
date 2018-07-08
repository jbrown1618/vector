export interface ScalarContainer<ScalarType> {
  scalarsEqual(first: ScalarType, second: ScalarType): boolean;

  addScalars(first: ScalarType, second: ScalarType): ScalarType;

  multiplyScalars(first: ScalarType, second: ScalarType): ScalarType;

  conjugateScalar(scalar: ScalarType): ScalarType;

  getAdditiveIdentity(): ScalarType;

  getMultiplicativeIdentity(): ScalarType;
}
