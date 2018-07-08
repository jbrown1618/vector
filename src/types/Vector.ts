import { ScalarContainer } from './ScalarContainer';

export type VectorData<ScalarType> = Array<ScalarType>;

export interface Vector<ScalarType> extends ScalarContainer<ScalarType> {
  getData(): VectorData<ScalarType>;

  getEntry(index: number): ScalarType;

  add(other: Vector<ScalarType>): Vector<ScalarType>;

  scalarMultiply(scalar: ScalarType): Vector<ScalarType>;

  innerProduct(other: Vector<ScalarType>): ScalarType;

  getDimension(): number;

  equals(other: Vector<ScalarType>): boolean;
}
