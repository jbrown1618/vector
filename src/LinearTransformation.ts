export interface LinearTransformation<V, U> {
  apply(vector: V): U;
}
