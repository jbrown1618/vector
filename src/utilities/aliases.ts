import { Vector } from '../types/vector/Vector';
import { Matrix, MatrixShape } from '../types/matrix/Matrix';
import { FloatVector } from '../types/vector/FloatVector';
import { FloatMatrix } from '../types/matrix/FloatMatrix';

const vb = FloatVector.builder();
const mb = FloatMatrix.builder();

/**
 * Creates a new {@link Vector} of numbers.  See {@link VectorBuilder.fromArray}
 * @public
 */
export function vec(data: number[]): Vector {
  return vb.fromArray(data);
}

/**
 * Creates a new {@link Matrix} of numbers.  See {@link MatrixBuilder.fromArray}
 * @public
 */
export function mat(data: number[][]): Matrix {
  return mb.fromArray(data);
}

/**
 * Creates a new identity matrix of size `size`.  See {@link MatrixBuilder.identity}
 * @public
 */
export function eye(size: number): Matrix {
  return mb.identity(size);
}

/**
 * Creates a new vector of all 1s.  See {@link VectorBuilder.ones}
 * @public
 */
export function ones(entries: number): Vector;
/**
 * Creates a new matrix of all 1s.  See {@link MatrixBuilder.ones}
 * @public
 */
export function ones(shape: MatrixShape): Matrix;
export function ones(shapeOrDim: number | MatrixShape): Matrix | Vector {
  return Array.isArray(shapeOrDim) ? mb.ones(shapeOrDim) : vb.ones(shapeOrDim);
}

/**
 * Creates a new vector of all 0s.  See {@link VectorBuilder.zeros}
 * @public
 */
export function zeros(entries: number): Vector;
/**
 * Creates a new matrix of all 0s.  See {@link MatrixBuilder.zeros}
 * @public
 */
export function zeros(shape: MatrixShape): Matrix;
export function zeros(shapeOrDim: number | MatrixShape): Matrix | Vector {
  return Array.isArray(shapeOrDim) ? mb.zeros(shapeOrDim) : vb.zeros(shapeOrDim);
}

/**
 * Creates a new matrix with the specified entries on the diagonal.  See {@link MatrixBuilder.diagonal}
 * @public
 */
export function diag(elements: number[]): Matrix {
  return mb.diagonal(vec(elements));
}
