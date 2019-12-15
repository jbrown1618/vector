import { Vector } from '@lib/types/vector/Vector';
import { Matrix } from '@lib/types/matrix/Matrix';
import { NumberVector } from '@lib/types/vector/NumberVector';
import { NumberMatrix } from '@lib/types/matrix/NumberMatrix';

const vb = NumberVector.builder();
const mb = NumberMatrix.builder();

/**
 * Creates a new {@link Vector} of numbers.  See {@link VectorBuilder.fromArray}
 * @public
 */
export function vec(data: number[]): Vector<number> {
  return vb.fromArray(data);
}

/**
 * Creates a new {@link Matrix} of numbers.  See {@link MatrixBuilder.fromArray}
 * @public
 */
export function mat(data: number[][]): Matrix<number> {
  return mb.fromArray(data);
}

/**
 * Creates a new identity matrix of size `size`.  See {@link MatrixBuilder.identity}
 * @public
 */
export function eye(size: number): Matrix<number> {
  return mb.identity(size);
}

/**
 * Creates a new vector of all 1s.  See {@link VectorBuilder.ones}
 * @public
 */
export function ones(entries: number): Vector<number>;
/**
 * Creates a new matrix of all 1s.  See {@link MatrixBuilder.ones}
 * @public
 */
export function ones(rows: number, columns: number): Matrix<number>;
export function ones(rows: number, columns?: number): Matrix<number> | Vector<number> {
  return columns === undefined ? vb.ones(rows) : mb.ones(rows, columns);
}

/**
 * Creates a new vector of all 0s.  See {@link VectorBuilder.zeros}
 * @public
 */
export function zeros(entries: number): Vector<number>;
/**
 * Creates a new matrix of all 0s.  See {@link MatrixBuilder.zeros}
 * @public
 */
export function zeros(rows: number, columns: number): Matrix<number>;
export function zeros(rows: number, columns?: number): Matrix<number> | Vector<number> {
  return columns === undefined ? vb.zeros(rows) : mb.zeros(rows, columns);
}

/**
 * Creates a new matrix with the specified entries on the diagonal.  See {@link MatrixBuilder.diagonal}
 * @public
 */
export function diag(elements: number[]): Matrix<number> {
  return mb.diagonal(vec(elements));
}
