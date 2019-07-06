import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberMatrix } from '..';
import { SolutionType, UnderdeterminedSolution, UniqueSolution } from './LinearSolution';
import {
  backwardSubstituteAugmentedMatrix,
  forwardSubstituteAugmentedMatrix,
  solveByBackwardSubstitution,
  solveByForwardSubstitution
} from './Substitution';

describe('Substitution', () => {
  const matrixBuilder = NumberMatrix.builder();
  const vectorBuilder = NumberMatrix.vectorBuilder();

  describe('solveByForwardSubstitution', () => {
    it('solves a lower-triangular system with a unique solution', () => {
      const L = matrixBuilder.fromArray([[2, 0, 0], [2, 1, 0], [3, 3, 2]]);
      const b = vectorBuilder.fromArray([3, 2, 3]);
      const solution = solveByForwardSubstitution(L, b);

      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).to.deep.equal(vectorBuilder.fromArray([1.5, -1, 3 / 4]));
      expect(L.apply(x)).to.deep.equal(b);
    });

    it('solves an underdetermined lower-triangular system', () => {
      const L = matrixBuilder.fromArray([[0, 0, 0], [0, 0, 0], [1, 1, 1]]);
      const b = vectorBuilder.fromArray([0, 0, 3]);
      const solution = solveByForwardSubstitution(L, b);

      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
      const x = (solution as UnderdeterminedSolution<number>).solution;
      expect(L.apply(x)).to.deep.equal(b);
    });

    it('solves an overdetermined lower-triangular system', () => {
      const L = matrixBuilder.fromArray([[0, 0], [1, 1]]);
      const b = vectorBuilder.fromArray([1, 1]);
      const solution = solveByForwardSubstitution(L, b);

      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });

    it('solves a unique "tall" system', () => {
      const L = matrixBuilder.fromArray([[1, 0], [0, 1], [0, 1]]);
      const b = vectorBuilder.fromArray([1, 2, 2]);
      const expected = vectorBuilder.fromArray([1, 2]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      expect((solution as UniqueSolution<number>).solution).to.deep.equal(expected);
    });

    it('solves an overdetermined "tall" system', () => {
      const L = matrixBuilder.fromArray([[1, 0], [3, 4], [5, 6]]);
      const b = vectorBuilder.fromArray([1, 2, 3]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });

    it('solves an underdetermined "tall" system', () => {
      const L = matrixBuilder.fromArray([[1, 0], [1, 0], [1, 0]]);
      const b = vectorBuilder.fromArray([1, 1, 1]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
    });

    it('solves an underdetermined "wide" system', () => {
      const L = matrixBuilder.fromArray([[1, 0, 0], [0, 1, 0]]);
      const b = vectorBuilder.fromArray([1, 2]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
    });

    it('solves an overdetermined "wide" system', () => {
      const L = matrixBuilder.fromArray([[1, 0, 0], [1, 0, 0]]);
      const b = vectorBuilder.fromArray([1, 2]);
      const solution = solveByForwardSubstitution(L, b);
      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });
  });

  describe('forwardSubstituteAugmentedMatrix', () => {
    it('solves a lower-triangular system with a unique solution', () => {
      const L = matrixBuilder.fromArray([[2, 0, 0, 3], [2, 1, 0, 2], [3, 3, 2, 3]]);
      const solution = forwardSubstituteAugmentedMatrix(L);

      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).to.deep.equal(vectorBuilder.fromArray([1.5, -1, 3 / 4]));
    });

    it('solves an underdetermined lower-triangular system', () => {
      const L = matrixBuilder.fromArray([[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 3]]);
      const solution = forwardSubstituteAugmentedMatrix(L);

      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
    });

    it('solves an overdetermined lower-triangular system', () => {
      const L = matrixBuilder.fromArray([[0, 0, 1], [1, 1, 1]]);
      const solution = forwardSubstituteAugmentedMatrix(L);

      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });
  });

  describe('solveByBackwardSubstitution', () => {
    it('solves an upper-triangular system with a unique solution', () => {
      const U = matrixBuilder.fromArray([[2, 2, 3], [0, 1, 2], [0, 0, 2]]);
      const b = vectorBuilder.fromArray([3, 2, 3]);
      const solution = solveByBackwardSubstitution(U, b);

      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).to.deep.equal(vectorBuilder.fromArray([0.25, -1, 1.5]));
      expect(U.apply(x)).to.deep.equal(b);
    });

    it('solves an underdetermined upper-triangular system', () => {
      const U = matrixBuilder.fromArray([[1, 1, 1], [0, 0, 0], [0, 0, 0]]);
      const b = vectorBuilder.fromArray([3, 0, 0]);
      const solution = solveByBackwardSubstitution(U, b);

      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
      const x = (solution as UnderdeterminedSolution<number>).solution;
      expect(U.apply(x)).to.deep.equal(b);
    });

    it('solves an overdetermined upper-triangular system', () => {
      const U = matrixBuilder.fromArray([[1, 1], [0, 0]]);
      const b = vectorBuilder.fromArray([1, 1]);
      const solution = solveByBackwardSubstitution(U, b);

      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });

    it('solves a unique "tall" system', () => {
      const U = matrixBuilder.fromArray([[1, 0], [0, 1], [0, 0]]);
      const b = vectorBuilder.fromArray([1, 2, 0]);
      const expected = vectorBuilder.fromArray([1, 2]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      expect((solution as UniqueSolution<number>).solution).to.deep.equal(expected);
    });

    it('solves an overdetermined "tall" system', () => {
      const U = matrixBuilder.fromArray([[1, 0], [0, 1], [0, 1]]);
      const b = vectorBuilder.fromArray([1, 2, 3]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });

    it('solves an underdetermined "tall" system', () => {
      const U = matrixBuilder.fromArray([[0, 1], [0, 1], [0, 0]]);
      const b = vectorBuilder.fromArray([1, 1, 0]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
    });

    it('solves an underdetermined "wide" system', () => {
      const U = matrixBuilder.fromArray([[1, 0, 0], [0, 1, 0]]);
      const b = vectorBuilder.fromArray([1, 2]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
    });

    it('solves an overdetermined "wide" system', () => {
      const U = matrixBuilder.fromArray([[0, 0, 1], [0, 0, 1]]);
      const b = vectorBuilder.fromArray([1, 2]);
      const solution = solveByBackwardSubstitution(U, b);
      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });
  });

  describe('backwardSubstituteAugmentedMatrix', () => {
    it('solves an upper-triangular system with a unique solution', () => {
      const U = matrixBuilder.fromArray([[2, 2, 3, 3], [0, 1, 2, 2], [0, 0, 2, 3]]);
      const solution = backwardSubstituteAugmentedMatrix(U);

      expect(solution.solutionType).to.equal(SolutionType.UNIQUE);
      const x = (solution as UniqueSolution<number>).solution;
      expect(x).to.deep.equal(vectorBuilder.fromArray([0.25, -1, 1.5]));
    });

    it('solves an underdetermined upper-triangular system', () => {
      const U = matrixBuilder.fromArray([[1, 1, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0]]);
      const solution = backwardSubstituteAugmentedMatrix(U);

      expect(solution.solutionType).to.equal(SolutionType.UNDERDETERMINED);
    });

    it('solves an overdetermined upper-triangular system', () => {
      const U = matrixBuilder.fromArray([[1, 1, 1], [0, 0, 1]]);
      const solution = backwardSubstituteAugmentedMatrix(U);

      expect(solution.solutionType).to.equal(SolutionType.OVERDETERMINED);
    });
  });
});
