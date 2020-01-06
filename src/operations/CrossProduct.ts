import { Vector } from '../types/vector/Vector';

/**
 * Calculates the cross-product (vector-product) of two vectors.
 * This is defined only for vectors with three dimensions.
 *
 * @param first - a vector with dimension 3
 * @param second - another vector with dimension 3
 * @public
 */
export function crossProduct<S>(first: Vector<S>, second: Vector<S>): Vector<S> {
  if (first.getDimension() !== 3 || second.getDimension() !== 3) {
    throw new Error('The cross product is only defined for vectors of dimension 3');
  }
  const ops = first.ops();

  const [x1, y1, z1] = first.toArray();
  const [x2, y2, z2] = second.toArray();

  const x = ops.add(ops.multiply(y1, z2), ops.multiply(ops.negativeOne(), ops.multiply(z1, y2)));
  const y = ops.add(ops.multiply(z1, x2), ops.multiply(ops.negativeOne(), ops.multiply(x1, z2)));
  const z = ops.add(ops.multiply(x1, y2), ops.multiply(ops.negativeOne(), ops.multiply(y1, x2)));

  return first.builder().fromValues(x, y, z);
}

/**
 * Calculates the scalar triple-product of three vectors.
 * This is defined only for vectors with three dimensions.
 *
 * @param first - a vector with dimension 3
 * @param second - another vector with dimension 3
 * @param third - another vector with dimension 3
 * @public
 */
export function tripleProduct<S>(first: Vector<S>, second: Vector<S>, third: Vector<S>): S {
  if (first.getDimension() !== 3 || second.getDimension() !== 3 || third.getDimension() !== 3) {
    throw new Error('The triple product is only defined for vectors of dimension 3');
  }
  return first.innerProduct(crossProduct(second, third));
}
