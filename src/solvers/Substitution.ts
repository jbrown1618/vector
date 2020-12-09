import { assertSquare } from '../utilities/ErrorAssertions';
import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { LinearSolution, SolutionType } from './LinearSolution';

/**
 * Uses forward substitution to solve the linear system _Lx=b_ for a lower-triangular matrix `L`.
 * If `L` is not lower-triangular, the results will be incorrect.
 *
 * @param L - The lower-triangular matrix `L` in _Lx=b_
 * @param b - The vector `b` in _Lx=b_
 * @returns The vector `x` in _Lx=b_, or `undefined` if the matrix is numerically singular
 * @public
 */
export function solveByForwardSubstitution<S>(L: Matrix<S>, b: Vector<S>): Vector<S> | undefined {
  assertSquare(L);
  const ops = L.ops();
  const vectorBuilder = L.vectorBuilder();
  const [n] = L.getShape();
  const solution: S[] = [];

  for (let rowIndex = 0; rowIndex < n; rowIndex++) {
    let sum = ops.zero();
    for (let colIndex = 0; colIndex < rowIndex; colIndex++) {
      sum = ops.add(sum, ops.multiply(L.getEntry(rowIndex, colIndex), solution[colIndex]));
    }

    // Calculate the entry to include in the solution vector
    const entryNumerator = ops.subtract(b.getEntry(rowIndex), sum);
    const entryDenominator = L.getEntry(rowIndex, rowIndex);
    const entry = ops.divide(entryNumerator, entryDenominator);

    if (entry === undefined) {
      return undefined;
    }

    solution[rowIndex] = entry;
  }

  return vectorBuilder.fromArray(solution);
}

/**
 * Uses forward substitution on the augmented matrix L|b to solve the linear system _Lx=b_ for a
 * lower-triangular matrix `L`.
 * If `L` is not lower-triangular, the results will be incorrect.
 *
 * @param augmented - The augmented matrix `L|b` in _Lx=b_
 * @returns The vector `x` in _Lx=b_, or `undefined` if the matrix is numerically singular
 * @public
 */
export function forwardSubstituteAugmentedMatrix<S>(augmented: Matrix<S>): Vector<S> | undefined {
  const L = augmented
    .builder()
    .slice(augmented, 0, 0, augmented.getNumberOfRows(), augmented.getNumberOfColumns() - 1);
  const b = augmented.getColumn(augmented.getNumberOfColumns() - 1);
  return solveByForwardSubstitution(L, b);
}

/**
 * Uses backward substitution to solve the linear system _Ux=b_ for an upper-triangular matrix `U`.
 * If `U` is not lower-triangular, the results will be incorrect.
 *
 * @param U - The lower-triangular matrix `U` in _Ux=b_
 * @param b - The vector `b` in _Ux=b_
 * @returns The vector `x` in _Ux=b_, or `undefined` if the matrix is numerically singular
 * @public
 */
export function solveByBackwardSubstitution<S>(U: Matrix<S>, b: Vector<S>): Vector<S> | undefined {
  assertSquare(U);
  const ops = U.ops();
  const vectorBuilder = U.vectorBuilder();
  const [n] = U.getShape();
  const solution: S[] = [];

  for (let rowIndex = n - 1; rowIndex >= 0; rowIndex--) {
    let sum = ops.zero();
    for (let colIndex = n - 1; colIndex > rowIndex; colIndex--) {
      sum = ops.add(sum, ops.multiply(U.getEntry(rowIndex, colIndex), solution[colIndex]));
    }

    const entryNumerator = ops.subtract(b.getEntry(rowIndex), sum);
    const entryDenominator = U.getEntry(rowIndex, rowIndex);

    if (ops.equals(entryDenominator, ops.zero())) {
      return undefined;
    }
    ops.divide(entryNumerator, entryDenominator)!;

    solution[rowIndex] = ops.divide(entryNumerator, entryDenominator)!;
  }

  return vectorBuilder.fromArray(solution);
}

/**
 * Uses backward substitution on the augmented matrix U|b to solve the linear system _Ux=b_ for an
 * upper-triangular matrix `U`.
 * If `U` is not upper-triangular, the results will be incorrect.
 *
 * @param augmented - The augmented matrix `U|b` in _Ux=b_
 * @returns The vector `x` in _Ux=b_, or `undefined` if the matrix is numerically singular
 * @public
 */
export function backwardSubstituteAugmentedMatrix<S>(augmented: Matrix<S>): Vector<S> | undefined {
  const U = augmented
    .builder()
    .slice(augmented, 0, 0, augmented.getNumberOfRows(), augmented.getNumberOfColumns() - 1);
  const b = augmented.getColumn(augmented.getNumberOfColumns() - 1);
  return solveByBackwardSubstitution(U, b);
}

/**
 * Uses a simplified form of backward substitution to identify the solution to a linear
 * system represented by an augmented matrix in reduced row-echelon form.
 *
 * @param rref An augmented matrix in reduced row-echelon form
 * @returns The solution to the system
 * @public
 */
export function extractSolutionFromRrefAugmentedMatrix<S>(rref: Matrix<S>): LinearSolution<S> {
  const ops = rref.ops();
  const vb = rref.vectorBuilder();
  const A = rref.builder().slice(rref, 0, 0, rref.getNumberOfRows(), rref.getNumberOfColumns() - 1);
  const [m, n] = A.getShape();
  const zero = ops.zero();
  const one = ops.one();
  const b = rref.getColumn(rref.getNumberOfColumns() - 1);

  const pivotLocations: [number, number][] = [];
  for (let rowIndex = m - 1; rowIndex >= 0; rowIndex--) {
    const firstNonzeroIndex = A.getRow(rowIndex)
      .toArray()
      .findIndex((entry) => !ops.equals(entry, ops.zero()));
    if (firstNonzeroIndex > -1) {
      pivotLocations.push([rowIndex, firstNonzeroIndex]);
    }
  }

  const pivotColumns = pivotLocations.map(([_i, j]) => j);
  const freeColumns = Array.from({ length: n })
    .map((_, i) => i)
    .filter((val) => !pivotColumns.includes(val));

  let isSolutionUnique = true;
  const solution: S[] = [];
  for (const j of freeColumns) {
    solution[j] = one;
    isSolutionUnique = false;
  }

  for (let rowIndex = m - 1; rowIndex >= 0; rowIndex--) {
    const pivotLocation = pivotLocations.find(([i]) => rowIndex === i);
    const pivotColumn = pivotLocation?.[1];

    if (pivotColumn === undefined) {
      // No pivot entry in this row
      if (ops.equals(b.getEntry(rowIndex), zero)) {
        // This row effectively specifies 0 == 0, so we just move on
        continue;
      } else {
        // This row effectively specifies 0 == 1, so there is no solution
        return { solutionType: SolutionType.OVERDETERMINED };
      }
    }

    // we have a pivot entry in this row
    // Construct a sum of the entries to the right of the pivot entry
    let sum = zero;
    for (let colIndex = pivotColumn + 1; colIndex < n; colIndex++) {
      sum = ops.add(sum, ops.multiply(A.getEntry(rowIndex, colIndex), solution[colIndex]));
    }

    const entry = ops.subtract(b.getEntry(rowIndex), sum);
    solution[pivotColumn] = entry;
  }

  return isSolutionUnique
    ? { solutionType: SolutionType.UNIQUE, solution: vb.fromArray(solution) }
    : { solutionType: SolutionType.UNDERDETERMINED, solution: vb.fromArray(solution) };
}
