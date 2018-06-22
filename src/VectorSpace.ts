export interface VectorSpace<V, S> {
  add(left: V, right: V): V;
  multiply(vector: V, scalar: S);
}
