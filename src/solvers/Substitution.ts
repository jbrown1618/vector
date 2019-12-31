import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { LinearSolution, SolutionType } from './LinearSolution';

/**
 * Uses forward substitution to solve the linear system _Lx=b_ for a lower-triangular matrix `L`.
 * If `L` is not lower-triangular, the results will be incorrect.
 *
 * @param L - The lower-triangular matrix `L` in _Lx=b_
 * @param b - The vector `b` in _Lx=b_
 * @returns The vector `x` in _Lx=b_
 * @public
 */
export function solveByForwardSubstitution<S>(L: Matrix<S>, b: Vector<S>): LinearSolution<S> {
  const ops = L.ops();
  const vectorBuilder = L.vectorBuilder();
  const [numRows, numCols] = L.getShape();
  const solution: S[] = [];

  // A system cannot have a unique solution if the matrix is wider than it is tall
  let isUnique = numRows >= numCols;

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    let sum = ops.zero();
    for (let colIndex = 0; colIndex < rowIndex; colIndex++) {
      sum = ops.add(sum, ops.multiply(L.getEntry(rowIndex, colIndex), solution[colIndex]));
    }

    if (rowIndex < numCols) {
      // Calculate the entry to include in the solution vector
      const entryNumerator = ops.subtract(b.getEntry(rowIndex), sum);
      const entryDenominator = L.getEntry(rowIndex, rowIndex);
      let entry = ops.divide(entryNumerator, entryDenominator);

      if (!ops.equals(entryNumerator, ops.zero()) && ops.equals(entryDenominator, ops.zero())) {
        return {
          solutionType: SolutionType.OVERDETERMINED
        };
      } else if (entry === undefined || ops.equals(entryDenominator, ops.zero())) {
        isUnique = false;
        entry = ops.one(); // Anything will do.
      }

      solution[rowIndex] = entry;
    } else {
      // We are done with the solution - just check whether the
      // remaining rows make the system inconsistent
      if (!ops.equals(ops.subtract(b.getEntry(rowIndex), sum), ops.zero())) {
        return {
          solutionType: SolutionType.OVERDETERMINED
        };
      }
    }
  }

  if (isUnique) {
    return {
      solutionType: SolutionType.UNIQUE,
      solution: vectorBuilder.fromArray(solution)
    };
  } else {
    return {
      solutionType: SolutionType.UNDERDETERMINED,
      solution: vectorBuilder.fromArray(solution)
    };
  }
}

/**
 * Uses forward substitution on the augmented matrix L|b to solve the linear system _Lx=b_ for a
 * lower-triangular matrix `L`.
 * If `L` is not lower-triangular, the results will be incorrect.
 *
 * @param augmented - The augmented matrix `L|b` in _Lx=b_
 * @returns The vector `x` in _Lx=b_
 * @public
 */
export function forwardSubstituteAugmentedMatrix<S>(augmented: Matrix<S>): LinearSolution<S> {
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
 * @returns The vector `x` in _Ux=b_
 * @public
 */
export function solveByBackwardSubstitution<S>(U: Matrix<S>, b: Vector<S>): LinearSolution<S> {
  const ops = U.ops();
  const vectorBuilder = U.vectorBuilder();
  const [numRows, numCols] = U.getShape();
  const solution: S[] = [];

  // A system cannot have a unique solution if the matrix is wider than it is tall
  let isUnique = numRows >= numCols;

  for (let rowIndex = numRows - 1; rowIndex >= 0; rowIndex--) {
    if (rowIndex >= numCols) {
      // The matrix entries must be 0, so check if the b entries
      // are nonzero.  If so, the system is inconsistent.
      if (!ops.equals(b.getEntry(rowIndex), ops.zero())) {
        return {
          solutionType: SolutionType.OVERDETERMINED
        };
      }
    } else {
      let sum = ops.zero();
      for (let colIndex = numCols - 1; colIndex > rowIndex; colIndex--) {
        sum = ops.add(sum, ops.multiply(U.getEntry(rowIndex, colIndex), solution[colIndex]));
      }

      const entryNumerator = ops.subtract(b.getEntry(rowIndex), sum);
      const entryDenominator = U.getEntry(rowIndex, rowIndex);
      let entry = ops.divide(entryNumerator, entryDenominator);

      if (!ops.equals(entryNumerator, ops.zero()) && ops.equals(entryDenominator, ops.zero())) {
        return {
          solutionType: SolutionType.OVERDETERMINED
        };
      } else if (entry === undefined || ops.equals(entryDenominator, ops.zero())) {
        isUnique = false;
        entry = ops.one(); // Anything will do.
      }

      solution[rowIndex] = entry;
    }
  }

  if (isUnique) {
    return {
      solutionType: SolutionType.UNIQUE,
      solution: vectorBuilder.fromArray(solution)
    };
  } else {
    return {
      solutionType: SolutionType.UNDERDETERMINED,
      solution: vectorBuilder.fromArray(solution)
    };
  }
}

/**
 * Uses backward substitution on the augmented matrix U|b to solve the linear system _Ux=b_ for an
 * upper-triangular matrix `U`.
 * If `U` is not upper-triangular, the results will be incorrect.
 *
 * @param augmented - The augmented matrix `U|b` in _Ux=b_
 * @returns The vector `x` in _Ux=b_
 * @public
 */
export function backwardSubstituteAugmentedMatrix<S>(augmented: Matrix<S>): LinearSolution<S> {
  const U = augmented
    .builder()
    .slice(augmented, 0, 0, augmented.getNumberOfRows(), augmented.getNumberOfColumns() - 1);
  const b = augmented.getColumn(augmented.getNumberOfColumns() - 1);
  return solveByBackwardSubstitution(U, b);
}
