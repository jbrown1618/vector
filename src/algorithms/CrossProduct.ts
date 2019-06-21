import { Vector } from '../types/vector/Vector';

/**
 * Calculates the cross-product (vector-product) of two vectors.
 * This is defined only for vectors with three dimensions.
 *
 * @param first - a vector with dimension 3
 * @param second - another vector with dimension 3
 */
export function crossProduct<S>(first: Vector<S>, second: Vector<S>) {
  if (first.getDimension() !== 3 || second.getDimension() !== 3) {
    throw new Error('TODO - operation not defined');
  }

  const ops = first.ops();
  return first
    .builder()
    .fromValues(
      ops.add(
        ops.multiply(first.getEntry(1), second.getEntry(2)),
        ops.multiply(ops.negativeOne(), ops.multiply(first.getEntry(2), second.getEntry(1)))
      ),
      ops.add(
        ops.multiply(first.getEntry(2), second.getEntry(0)),
        ops.multiply(ops.negativeOne(), ops.multiply(first.getEntry(0), second.getEntry(2)))
      ),
      ops.add(
        ops.multiply(first.getEntry(0), second.getEntry(1)),
        ops.multiply(ops.negativeOne(), ops.multiply(first.getEntry(1), second.getEntry(0)))
      )
    );
}

/**
 * Calculates the scalar triple-product of three vectors.
 * This is defined only for vectors with three dimensions.
 *
 * @param first - a vector with dimension 3
 * @param second - another vector with dimension 3
 * @param third - another vector with dimension 3
 */
export function tripleProduct<S>(first: Vector<S>, second: Vector<S>, third: Vector<S>) {
  return first.innerProduct(crossProduct(second, third));
}
