import { mat, vec, eye } from '../../utilities/aliases';
import { Matrix } from '../../types/matrix/Matrix';
import { NumberMatrix } from '../../types/matrix/NumberMatrix';
import {
  inverse,
  reducedRowEchelonForm,
  rowEchelonForm,
  solveByGaussianElimination
} from '../GaussJordan';
import {
  SolutionType,
  UnderdeterminedSolution,
  UniqueSolution
} from '../../solvers/LinearSolution';
import { loadTestData } from '@test-utils/testData';

describe('GaussJordan', () => {
  describe('solveByGaussianElimination', () => {
    test('solves a system with a unique solution', () => {
      const A = mat([
        [0, 2, 1],
        [1, -2, -3],
        [-1, 1, 2]
      ]);
      const b = vec([-8, 0, 3]);
      const solution = solveByGaussianElimination(A, b);
      const expected = vec([-4, -5, 2]);

      expect(solution.solutionType).toEqual(SolutionType.UNIQUE);
      expect((solution as UniqueSolution<number>).solution).toStrictEqual(expected);
    });

    test('solves a random 20x20 system', () => {
      const A = loadTestData('random-20x20');
      const b = loadTestData('random-20x1').getColumn(0);

      const solution = solveByGaussianElimination(A, b);

      expect(solution).toMatchSnapshot();
      expect(solution.solutionType).toBe(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(A.apply(x).equals(b)).toBe(true);
    });

    test('solves an underdetermined system', () => {
      const A = mat([
        [0, 2, 1],
        [1, -2, -3],
        [-3, 6, 9]
      ]);
      const b = vec([-4, 1, -3]);
      const solution = solveByGaussianElimination(A, b);
      const expected = vec([-1, -5 / 2, 1]);

      expect(solution.solutionType).toEqual(SolutionType.UNDERDETERMINED);
      expect((solution as UnderdeterminedSolution<number>).solution).toStrictEqual(expected);
    });

    test('determines when a system is overdetermined', () => {
      const A = mat([
        [1, -2, -6],
        [2, 4, 12],
        [1, -4, -12]
      ]);
      const b = vec([12, -17, 22]);
      const solution = solveByGaussianElimination(A, b);

      expect(solution.solutionType).toEqual(SolutionType.OVERDETERMINED);
    });
  });

  describe('rowEchelonForm', () => {
    test('row reduces a "wide" matrix', () => {
      const A = mat([
        [1, 2, 3],
        [4, 5, 6]
      ]);
      const aRef = rowEchelonForm(A);
      expect(aRef.toArray()).toStrictEqual([
        [4, 5, 6],
        [0, 0.75, 1.5]
      ]);
    });

    test('row reduces a "tall" matrix', () => {
      const A = mat([
        [0, 1],
        [0, 0],
        [5, 9]
      ]);
      const aRef = rowEchelonForm(A);
      const expected = mat([
        [5, 9],
        [0, 1],
        [0, 0]
      ]);
      expect(aRef.equals(expected)).toBe(true);
    });

    test('row reduces a matrix with non-independent rows', () => {
      const A = mat([
        [1, 2, 3],
        [1, 1, 1],
        [1, 1, 1]
      ]);
      const aRef = rowEchelonForm(A);
      expect(aRef).toStrictEqual(
        mat([
          [1, 2, 3],
          [0, -1, -2],
          [0, 0, 0]
        ])
      );

      // Matrix B has an unexpected row of zeros occur, necessitating an extra swap
      const B = mat([
        [1, 2, 2, 0],
        [-1, -2, -2, 0],
        [-3, 9, 9, 0]
      ]);
      const bRef = rowEchelonForm(B);
      expect(bRef).toStrictEqual(
        mat([
          [-3, 9, 9, 0],
          [0, 5, 5, 0],
          [0, 0, 0, 0]
        ])
      );
    });

    test('row reduces a matrix with non-diagonal pivot entries', () => {
      const A = mat([
        [1, 1, 1],
        [0, 0, 2],
        [0, 0, 1]
      ]);

      const aRef = rowEchelonForm(A);
      expect(aRef.toArray()).toStrictEqual([
        [1, 1, 1],
        [0, 0, 2],
        [0, 0, 0]
      ]);
    });

    test('does nothing to an identity matrix', () => {
      const I = eye(3);
      const ref = rowEchelonForm(I);
      expect(ref.equals(I)).toBe(true);
    });

    test('handles the degenerate case', () => {
      expect(rowEchelonForm(NumberMatrix.builder().empty()).toArray()).toStrictEqual([]);
    });
  });

  describe('reducedRowEchelonForm', () => {
    test('row reduces a "wide" matrix', () => {
      const A = mat([
        [1, 2, 3],
        [4, 5, 6]
      ]);
      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).toStrictEqual([
        [1, 0, -1],
        [0, 1, 2]
      ]);
    });

    test('row reduces a "tall" matrix', () => {
      const A = mat([
        [0, 1],
        [0, 0],
        [5, 9]
      ]);
      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).toStrictEqual([
        [1, 0],
        [0, 1],
        [0, 0]
      ]);
    });

    test('row reduces a matrix with non-independent rows', () => {
      const A = mat([
        [1, 2, 3],
        [1, 1, 1],
        [1, 1, 1]
      ]);

      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).toStrictEqual([
        [1, 0, -1],
        [0, 1, 2],
        [0, 0, 0]
      ]);
    });

    test('row reduces a matrix with non-diagonal pivot entries', () => {
      const A = mat([
        [1, 1, 1],
        [0, 0, 2],
        [0, 0, 1]
      ]);

      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).toStrictEqual([
        [1, 1, 0],
        [0, 0, 1],
        [0, 0, 0]
      ]);
    });

    test('does nothing to an identity matrix', () => {
      const I = eye(3);
      const ref = reducedRowEchelonForm(I);
      expect(ref.equals(I)).toBe(true);
    });

    test('handles the degenerate case', () => {
      expect(reducedRowEchelonForm(mat([])).toArray()).toStrictEqual([]);
    });
  });

  describe('inverse', () => {
    test('does not affect an identity matrix', () => {
      const I = eye(3);
      const iInv = inverse(I);
      expect(iInv).not.toBeUndefined;
      expect((iInv as Matrix<number>).equals(I)).toBe(true);
    });

    test('calculates the inverse of a square matrix', () => {
      const A = mat([
        [4, 7],
        [2, 6]
      ]);
      const expectedInverse = mat([
        [0.6, -0.7],
        [-0.2, 0.4]
      ]);
      const aInv = inverse(A) as Matrix<number>;
      expect(aInv).not.toBeUndefined;
      expect(aInv.equals(expectedInverse)).toBe(true);
    });

    test('rejects a non-square matrix', () => {
      const nonSquare = mat([[0, 1]]);
      expect(() => inverse(nonSquare)).toThrow();
    });

    test('returns undefined for a singular matrix', () => {
      const S = mat([
        [0, 0],
        [0, 0]
      ]);
      const sInv = inverse(S);
      expect(sInv).toBeUndefined;
    });
  });
});
