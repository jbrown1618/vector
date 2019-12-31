import { mat, vec } from '../../utilities/aliases';
import {
  SolutionType,
  UnderdeterminedSolution,
  UniqueSolution
} from '../../solvers/LinearSolution';
import {
  backwardSubstituteAugmentedMatrix,
  forwardSubstituteAugmentedMatrix,
  solveByBackwardSubstitution,
  solveByForwardSubstitution
} from '../Substitution';

describe('Substitution', () => {
  describe('solveByForwardSubstitution', () => {
    test('solves a lower-triangular system with a unique solution', () => {
      const L = mat([
        [2, 0, 0],
        [2, 1, 0],
        [3, 3, 2]
      ]);
      const b = vec([3, 2, 3]);
      const solution = solveByForwardSubstitution(L, b);

      expect(solution.solutionType).toEqual(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).toStrictEqual(vec([1.5, -1, 3 / 4]));
      expect(L.apply(x)).toStrictEqual(b);
    });

    test('solves an underdetermined lower-triangular system', () => {
      const L = mat([
        [0, 0, 0],
        [0, 0, 0],
        [1, 1, 1]
      ]);
      const b = vec([0, 0, 3]);
      const solution = solveByForwardSubstitution(L, b);

      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
      const x = (solution as UnderdeterminedSolution<number>).solution;
      expect(L.apply(x)).toStrictEqual(b);
    });

    test('solves an overdetermined lower-triangular system', () => {
      const L = mat([
        [0, 0],
        [1, 1]
      ]);
      const b = vec([1, 1]);
      const solution = solveByForwardSubstitution(L, b);

      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });

    test('solves a unique "tall" system', () => {
      const L = mat([
        [1, 0],
        [0, 1],
        [0, 1]
      ]);
      const b = vec([1, 2, 2]);
      const expected = vec([1, 2]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).toEqual(SolutionType.UNIQUE);
      expect((solution as UniqueSolution<number>).solution).toStrictEqual(expected);
    });

    test('solves an overdetermined "tall" system', () => {
      const L = mat([
        [1, 0],
        [3, 4],
        [5, 6]
      ]);
      const b = vec([1, 2, 3]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });

    test('solves an underdetermined "tall" system', () => {
      const L = mat([
        [1, 0],
        [1, 0],
        [1, 0]
      ]);
      const b = vec([1, 1, 1]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
    });

    test('solves an underdetermined "wide" system', () => {
      const L = mat([
        [1, 0, 0],
        [0, 1, 0]
      ]);
      const b = vec([1, 2]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
    });

    test('solves an overdetermined "wide" system', () => {
      const L = mat([
        [1, 0, 0],
        [1, 0, 0]
      ]);
      const b = vec([1, 2]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });
  });

  describe('forwardSubstituteAugmentedMatrix', () => {
    test('solves a lower-triangular system with a unique solution', () => {
      const L = mat([
        [2, 0, 0, 3],
        [2, 1, 0, 2],
        [3, 3, 2, 3]
      ]);
      const solution = forwardSubstituteAugmentedMatrix(L);

      expect(solution.solutionType).toEqual(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).toStrictEqual(vec([1.5, -1, 3 / 4]));
    });

    test('solves an underdetermined lower-triangular system', () => {
      const L = mat([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 3]
      ]);
      const solution = forwardSubstituteAugmentedMatrix(L);

      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
    });

    test('solves an overdetermined lower-triangular system', () => {
      const L = mat([
        [0, 0, 1],
        [1, 1, 1]
      ]);
      const solution = forwardSubstituteAugmentedMatrix(L);

      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });
  });

  describe('solveByBackwardSubstitution', () => {
    test('solves an upper-triangular system with a unique solution', () => {
      const U = mat([
        [2, 2, 3],
        [0, 1, 2],
        [0, 0, 2]
      ]);
      const b = vec([3, 2, 3]);
      const solution = solveByBackwardSubstitution(U, b);

      expect(solution.solutionType).toEqual(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).toStrictEqual(vec([0.25, -1, 1.5]));
      expect(U.apply(x)).toStrictEqual(b);
    });

    test('solves an underdetermined upper-triangular system', () => {
      const U = mat([
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0]
      ]);
      const b = vec([3, 0, 0]);
      const solution = solveByBackwardSubstitution(U, b);

      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
      const x = (solution as UnderdeterminedSolution<number>).solution;
      expect(U.apply(x)).toStrictEqual(b);
    });

    test('solves an overdetermined upper-triangular system', () => {
      const U = mat([
        [1, 1],
        [0, 0]
      ]);
      const b = vec([1, 1]);
      const solution = solveByBackwardSubstitution(U, b);

      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });

    test('solves a unique "tall" system', () => {
      const U = mat([
        [1, 0],
        [0, 1],
        [0, 0]
      ]);
      const b = vec([1, 2, 0]);
      const expected = vec([1, 2]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).toEqual(SolutionType.UNIQUE);
      expect((solution as UniqueSolution<number>).solution).toStrictEqual(expected);
    });

    test('solves an overdetermined "tall" system', () => {
      const U = mat([
        [1, 0],
        [0, 1],
        [0, 1]
      ]);
      const b = vec([1, 2, 3]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });

    test('solves an underdetermined "tall" system', () => {
      const U = mat([
        [0, 1],
        [0, 1],
        [0, 0]
      ]);
      const b = vec([1, 1, 0]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
    });

    test('solves an underdetermined "wide" system', () => {
      const U = mat([
        [1, 0, 0],
        [0, 1, 0]
      ]);
      const b = vec([1, 2]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
    });

    test('solves an overdetermined "wide" system', () => {
      const U = mat([
        [0, 0, 1],
        [0, 0, 1]
      ]);
      const b = vec([1, 2]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });
  });

  describe('backwardSubstituteAugmentedMatrix', () => {
    test('solves an upper-triangular system with a unique solution', () => {
      const U = mat([
        [2, 2, 3, 3],
        [0, 1, 2, 2],
        [0, 0, 2, 3]
      ]);
      const solution = backwardSubstituteAugmentedMatrix(U);

      expect(solution.solutionType).toEqual(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).toStrictEqual(vec([0.25, -1, 1.5]));
    });

    test('solves an underdetermined upper-triangular system', () => {
      const U = mat([
        [1, 1, 1, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
      const solution = backwardSubstituteAugmentedMatrix(U);

      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
    });

    test('solves an overdetermined upper-triangular system', () => {
      const U = mat([
        [1, 1, 1],
        [0, 0, 1]
      ]);
      const solution = backwardSubstituteAugmentedMatrix(U);

      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });
  });
});
