export interface AbstractVector<V extends AbstractVector<any>> {
  add(other: V): V;
  scalarMultiply(scalar: number): V;
  innerProduct(other: V): number;
  getDimension(): number;
  equals(other: V): boolean;
}
