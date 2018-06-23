export interface AbstractVector<V extends AbstractVector> {
  add(other: V): V;
  multiply(scalar: number): V;
  innerProduct(other: V): number;
  getDimension(): number;
}
