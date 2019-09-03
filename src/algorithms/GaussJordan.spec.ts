import { expect } from 'chai';
import { describe, it } from 'mocha';
import { mat, vec, eye } from '../utilities/aliases';
import { Matrix } from '../types/matrix/Matrix';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import {
  inverse,
  reducedRowEchelonForm,
  rowEchelonForm,
  solveByGaussianElimination
} from './GaussJordan';
import { SolutionType, UnderdeterminedSolution, UniqueSolution } from './LinearSolution';

describe('GaussJordan', () => {
  describe('solveByGaussianElimination', () => {
    it('solves a system with a unique solution', () => {
      const A = mat([[0, 2, 1], [1, -2, -3], [-1, 1, 2]]);
      const b = vec([-8, 0, 3]);
      const solution = solveByGaussianElimination(A, b);
      const expected = vec([-4, -5, 2]);

      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      expect((solution as UniqueSolution<number>).solution).to.deep.equal(expected);
    });

    it('solves a random 20x20 system', () => {
      const A = NumberMatrix.builder().random(20, 20);
      const b = NumberMatrix.vectorBuilder().random(20);
      const solution = solveByGaussianElimination(A, b);

      // Technically this could fail, but it's astronomically unlikely
      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(A.apply(x).equals(b)).to.be.true;
    });

    it('solves an underdetermined system', () => {
      const A = mat([[0, 2, 1], [1, -2, -3], [-3, 6, 9]]);
      const b = vec([-4, 1, -3]);
      const solution = solveByGaussianElimination(A, b);
      const expected = vec([-1, -5 / 2, 1]);

      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
      expect((solution as UnderdeterminedSolution<number>).solution).to.deep.equal(expected);
    });

    it('determines when a system is overdetermined', () => {
      const A = mat([[1, -2, -6], [2, 4, 12], [1, -4, -12]]);
      const b = vec([12, -17, 22]);
      const solution = solveByGaussianElimination(A, b);

      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });
  });

  describe('rowEchelonForm', () => {
    it('row reduces a "wide" matrix', () => {
      const A = mat([[1, 2, 3], [4, 5, 6]]);
      const aRef = rowEchelonForm(A);
      expect(aRef.toArray()).to.deep.equal([[4, 5, 6], [0, 0.75, 1.5]]);
    });

    it('row reduces a "tall" matrix', () => {
      const A = mat([[0, 1], [0, 0], [5, 9]]);
      const aRef = rowEchelonForm(A);
      const expected = mat([[5, 9], [0, 1], [0, 0]]);
      expect(aRef.equals(expected)).to.be.true;
    });

    it('row reduces a matrix with non-independent rows', () => {
      const A = mat([[1, 2, 3], [1, 1, 1], [1, 1, 1]]);
      const aRef = rowEchelonForm(A);
      expect(aRef).to.deep.equal(mat([[1, 2, 3], [0, -1, -2], [0, 0, 0]]));

      // Matrix B has an unexpected row of zeros occur, necessitating an extra swap
      const B = mat([[1, 2, 2, 0], [-1, -2, -2, 0], [-3, 9, 9, 0]]);
      const bRef = rowEchelonForm(B);
      expect(bRef).to.deep.equal(mat([[-3, 9, 9, 0], [0, 5, 5, 0], [0, 0, 0, 0]]));
    });

    it('row reduces a matrix with non-diagonal pivot entries', () => {
      const A = mat([[1, 1, 1], [0, 0, 2], [0, 0, 1]]);

      const aRef = rowEchelonForm(A);
      expect(aRef.toArray()).to.deep.equal([[1, 1, 1], [0, 0, 2], [0, 0, 0]]);
    });

    it('does nothing to an identity matrix', () => {
      const I = eye(3);
      const ref = rowEchelonForm(I);
      expect(ref.equals(I)).to.be.true;
    });

    it('handles the degenerate case', () => {
      expect(rowEchelonForm(NumberMatrix.builder().empty()).toArray()).to.deep.equal([]);
    });
  });

  describe('reducedRowEchelonForm', () => {
    it('row reduces a "wide" matrix', () => {
      const A = mat([[1, 2, 3], [4, 5, 6]]);
      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).to.deep.equal([[1, 0, -1], [0, 1, 2]]);
    });

    it('row reduces a "tall" matrix', () => {
      const A = mat([[0, 1], [0, 0], [5, 9]]);
      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).to.deep.equal([[1, 0], [0, 1], [0, 0]]);
    });

    it('row reduces a matrix with non-independent rows', () => {
      const A = mat([[1, 2, 3], [1, 1, 1], [1, 1, 1]]);

      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).to.deep.equal([[1, 0, -1], [0, 1, 2], [0, 0, 0]]);
    });

    it('row reduces a matrix with non-diagonal pivot entries', () => {
      const A = mat([[1, 1, 1], [0, 0, 2], [0, 0, 1]]);

      const aRef = reducedRowEchelonForm(A);
      expect(aRef.toArray()).to.deep.equal([[1, 1, 0], [0, 0, 1], [0, 0, 0]]);
    });

    it('does nothing to an identity matrix', () => {
      const I = eye(3);
      const ref = reducedRowEchelonForm(I);
      expect(ref.equals(I)).to.be.true;
    });

    it('handles the degenerate case', () => {
      expect(reducedRowEchelonForm(mat([])).toArray()).to.deep.equal([]);
    });
  });

  describe('inverse', () => {
    it('does not affect an identity matrix', () => {
      const I = eye(3);
      const iInv = inverse(I);
      expect(iInv).to.not.be.undefined;
      expect((iInv as Matrix<number>).equals(I)).to.be.true;
    });

    it('calculates the inverse of a square matrix', () => {
      const A = mat([[4, 7], [2, 6]]);
      const expectedInverse = mat([[0.6, -0.7], [-0.2, 0.4]]);
      const aInv = inverse(A) as Matrix<number>;
      expect(aInv).to.not.be.undefined;
      expect(aInv.equals(expectedInverse)).to.be.true;
    });

    it('rejects a non-square matrix', () => {
      const nonSquare = mat([[0, 1]]);
      expect(() => inverse(nonSquare)).to.throw();
    });

    it('returns undefined for a singular matrix', () => {
      const S = mat([[0, 0], [0, 0]]);
      const sInv = inverse(S);
      expect(sInv).to.be.undefined;
    });
  });
});
