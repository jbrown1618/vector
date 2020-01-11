import { Vector } from '../types/vector/Vector';
import { Matrix } from '../types/matrix/Matrix';

/**
 * Computes the dot/inner/scalar product of two vectors.  See {@link Vector.innerProduct}.
 *
 * @param first - the left vector in the product
 * @param second - the right vector in the product
 *
 * @public
 */
export function dotProduct<S>(first: Vector<S>, second: Vector<S>): S {
  return first.innerProduct(second);
}

/**
 * Computes the hadamard (element-wise) product of two vectors.
 *
 * @param first - the left vector in the product
 * @param second - the right vector in the product
 *
 * @public
 */
export function hadamardProduct<S>(first: Vector<S>, second: Vector<S>): Vector<S>;
/**
 * Computes the hadamard (element-wise) product of two matrices.
 *
 * @param first - the left matrix in the product
 * @param second - the right matrix in the product
 *
 * @public
 */
export function hadamardProduct<S>(first: Matrix<S>, second: Matrix<S>): Matrix<S>;
export function hadamardProduct<S>(
  first: Vector<S> | Matrix<S>,
  second: Vector<S> | Matrix<S>
): Vector<S> | Matrix<S> {
  const ops = first.ops();
  // TODO: The type assertion below is not correct, but it satisfies tsc.
  return first.combine(second as Vector<S> & Matrix<S>, (x: S, y: S) => ops.multiply(x, y));
}

/**
 * Computes the Kronecker product (generalized outer product) of two matrices.
 *
 * @param first - the left matrix in the product
 * @param second - the right matrix in the product
 *
 * @public
 */
export function kroneckerProduct<S>(first: Matrix<S>, second: Matrix<S>): Matrix<S> {
  const block: Matrix<S>[][] = [];
  first.getColumnVectors().forEach((columnOfFirst, i) => {
    second.getRowVectors().forEach((rowOfSecond, j) => {
      block[i] = block[i] || [];
      block[i][j] = columnOfFirst.outerProduct(rowOfSecond);
    });
  });
  return first.builder().block(block);
}

/**
 * Calculates the cross-product (vector-product) of two vectors.
 * This is defined only for vectors with three dimensions.
 *
 * @param first - a vector with dimension 3
 * @param second - another vector with dimension 3
 *
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
 *
 * @public
 */
export function tripleProduct<S>(first: Vector<S>, second: Vector<S>, third: Vector<S>): S {
  if (first.getDimension() !== 3 || second.getDimension() !== 3 || third.getDimension() !== 3) {
    throw new Error('The triple product is only defined for vectors of dimension 3');
  }
  return first.innerProduct(crossProduct(second, third));
}
