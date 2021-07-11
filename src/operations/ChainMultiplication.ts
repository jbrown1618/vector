import { assertMultiplicable } from '../utilities/ErrorAssertions';
import { Matrix } from '../types/matrix/Matrix';

/**
 * Represents a multplication order.
 *
 * [A, [B, C]] represents the parenthesization A(BC)
 */
type Parenthesization<S> =
  | [left: Matrix<S> | Parenthesization<S>, right: Matrix<S> | Parenthesization<S>]
  | Matrix<S>;

interface OptimizationResult<S> {
  parenthesization: Parenthesization<S>;
  multiplicationCount: number;
}

/**
 * Returns the product of the given array of matrices.
 *
 * @remarks
 * Uses dynamic programming to determine the order of multiplication that minimizes the total number of scalar multiplications.
 *
 * @param matrices - The array of matrices to multiply
 * @public
 */
export function chainProduct<S>(...matrices: Matrix<S>[]): Matrix<S> {
  if (matrices.length === 0) {
    throw Error('Cannot multiply a chain of 0 matrices');
  }
  assertMultiplicable(...matrices);
  const parenthesization = optimalMultiplicationOrderMemo(
    matrices,
    0,
    matrices.length - 1,
    new MultiplicationOrderMemo<S>()
  ).parenthesization;
  return multiplyParenthesization(parenthesization);
}

/**
 * Recursively executes the multiplications represented by the given parenthesization
 */
function multiplyParenthesization<S>(parenthesization: Parenthesization<S>): Matrix<S> {
  if (!Array.isArray(parenthesization)) {
    return parenthesization;
  }
  const [left, right] = parenthesization;
  const leftMatrix = Array.isArray(left) ? multiplyParenthesization(left) : left;
  const rightMatrix = Array.isArray(right) ? multiplyParenthesization(right) : right;
  return leftMatrix.multiply(rightMatrix);
}

/**
 * Uses dynamic programming to determine the parenthesization that minimizes the number of scalar multiplications
 * @param matrices
 * @param startIndex (inclusive)
 * @param endIndex (inclusive)
 * @param memo
 * @returns
 */
function optimalMultiplicationOrderMemo<S>(
  matrices: Matrix<S>[],
  startIndex: number,
  endIndex: number,
  memo: MultiplicationOrderMemo<S>
): OptimizationResult<S> {
  if (memo.has(startIndex, endIndex)) {
    return memo.get(startIndex, endIndex)!;
  }

  if (startIndex === endIndex) {
    // It takes 0 multiplications to multiply a chain of 1 matrix
    const result: OptimizationResult<S> = {
      parenthesization: matrices[startIndex],
      multiplicationCount: 0,
    };
    memo.set(startIndex, endIndex, result);
    return result;
  }

  if (startIndex + 1 === endIndex) {
    // Multiplying a chain of 2 matrices has only one possible operation order
    const left = matrices[startIndex];
    const right = matrices[endIndex];
    const multiplicationCount =
      left.getNumberOfRows() * left.getNumberOfColumns() * right.getNumberOfColumns();

    const result: OptimizationResult<S> = {
      parenthesization: [left, right],
      multiplicationCount,
    };
    memo.set(startIndex, endIndex, result);
    return result;
  }

  let optimalCost = Number.MAX_SAFE_INTEGER;
  let leftParenthesization: Parenthesization<S> | null = null;
  let rightParenthesization: Parenthesization<S> | null = null;

  const mLeft = matrices[startIndex].getNumberOfRows();
  const nRight = matrices[endIndex].getNumberOfColumns();
  for (let i = startIndex; i < endIndex; i++) {
    const nLeft = matrices[i].getNumberOfColumns();

    const costOfMultiplicationAcrossSplit = mLeft * nLeft * nRight;
    const leftOpt = optimalMultiplicationOrderMemo(matrices, startIndex, i, memo);
    const rightOpt = optimalMultiplicationOrderMemo(matrices, i + 1, endIndex, memo);

    const costOfSplit =
      leftOpt.multiplicationCount + rightOpt.multiplicationCount + costOfMultiplicationAcrossSplit;

    if (costOfSplit < optimalCost) {
      optimalCost = costOfSplit;
      leftParenthesization = leftOpt.parenthesization;
      rightParenthesization = rightOpt.parenthesization;
    }
  }

  const parenthesization: Parenthesization<S> = [leftParenthesization!, rightParenthesization!];
  const result = {
    parenthesization,
    multiplicationCount: optimalCost,
  };

  memo.set(startIndex, endIndex, result);
  return result;
}

/**
 * This is just a wrapper for a nested map which provides an API that's nicer than chaining .gets
 */
class MultiplicationOrderMemo<S> {
  private _map: Map<number, Map<number, OptimizationResult<S>>> = new Map();

  public has(startIndex: number, endIndex: number): boolean {
    return !!this._map.get(startIndex)?.has(endIndex);
  }

  public get(startIndex: number, endIndex: number): OptimizationResult<S> | undefined {
    return this._map.get(startIndex)?.get(endIndex);
  }

  public set(startIndex: number, endIndex: number, value: OptimizationResult<S>): void {
    if (!this._map.has(startIndex)) {
      this._map.set(startIndex, new Map());
    }
    this._map.get(startIndex)!.set(endIndex, value);
  }
}
