import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberVector } from '..';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { calculateEigenvalues, eig, getEigenvectorForEigenvalue } from './Eigenvalues';

describe('Eigenvalues', () => {
  describe('eig', () => {
    it('calculates the eigenvalue-eigenvector pairs', () => {
      // TODO - this test will continue to need a high number of iterations
      //  until our GE algorithm is more numerically stable, because the slight
      //  error in the eigenvalues is propagating through the eigenvector-finding.
      const A = NumberMatrix.builder().fromData([[-1, 2, 2], [-1, -4, -2], [-3, 9, 7]]);
      const pairs = eig(A, 50, false);

      const expectedValues = [3, -2, 1];
      const expectedVectors = [
        NumberVector.builder().fromData([1 / 3, -1 / 3, 1]),
        NumberVector.builder().fromData([0, -1, 1]),
        NumberVector.builder().fromData([1 / 2, -1 / 2, 1])
      ];

      pairs.forEach((pair, i) => {
        expect(pair.eigenvalue).to.be.approximately(expectedValues[i], 0.00001);
        expect(pair.eigenvector.equals(expectedVectors[i])).to.be.true;
      });
    });
  });

  describe('calculateEigenvalues', () => {
    it('calculates the eigenvalues of a 2x2 matrix', () => {
      const A = NumberMatrix.builder().fromData([[2, 1], [2, 3]]);
      const eigenvalues = calculateEigenvalues(A);
      const expected = NumberVector.builder().fromData([4, 1]);

      expect(eigenvalues.getEntry(0)).to.be.approximately(expected.getEntry(0), 0.00001);
      expect(eigenvalues.getEntry(1)).to.be.approximately(expected.getEntry(1), 0.00001);
    });

    it('calculates the eigenvalues of a 3x3 matrix', () => {
      const A = NumberMatrix.builder().fromData([[-1, 2, 2], [-1, -4, -2], [-3, 9, 7]]);
      const eigenvalues = calculateEigenvalues(A, 30, false);
      const expected = NumberVector.builder().fromData([3, -2, 1]);

      expect(eigenvalues.getEntry(0)).to.be.approximately(expected.getEntry(0), 0.00001);
      expect(eigenvalues.getEntry(1)).to.be.approximately(expected.getEntry(1), 0.00001);
      expect(eigenvalues.getEntry(2)).to.be.approximately(expected.getEntry(2), 0.00001);
    });

    it('throws an error when it fails to converge', () => {
      const A = NumberMatrix.builder().fromData([[-1, 2, 2], [-1, -4, -2], [-3, 9, 7]]);
      expect(() => calculateEigenvalues(A, 1)).to.throw();
    });

    it('does not throw when instructed to return the non-converged result', () => {
      const A = NumberMatrix.builder().fromData([[-1, 2, 2], [-1, -4, -2], [-3, 9, 7]]);
      const eigenvalues = calculateEigenvalues(A, 30, false);
      expect(eigenvalues.getDimension()).to.equal(3);
    });
  });

  describe('getEigenvectorForEigenvalue', () => {
    it('gets the eigenvectors for a 2x2 matrix', () => {
      const A = NumberMatrix.builder().fromData([[2, 1], [2, 3]]);
      const v1 = getEigenvectorForEigenvalue(A, 4);
      const v2 = getEigenvectorForEigenvalue(A, 1);

      expect(v1).to.deep.equal(NumberVector.builder().fromData([1 / 2, 1]));
      expect(v2).to.deep.equal(NumberVector.builder().fromData([-1, 1]));
    });

    it('gets the eigenvectors for a 3x3 matrix', () => {
      const A = NumberMatrix.builder().fromData([[-1, 2, 2], [-1, -4, -2], [-3, 9, 7]]);
      const v1 = getEigenvectorForEigenvalue(A, 3);
      const v2 = getEigenvectorForEigenvalue(A, -2);
      const v3 = getEigenvectorForEigenvalue(A, 1);

      const expected1 = NumberVector.builder().fromData([1 / 3, -1 / 3, 1]);
      const expected2 = NumberVector.builder().fromData([0, -1, 1]);
      const expected3 = NumberVector.builder().fromData([1 / 2, -1 / 2, 1]);

      expect(v1.equals(expected1)).to.be.true;
      expect(v2.equals(expected2)).to.be.true;
      expect(v3.equals(expected3)).to.be.true;
    });
  });
});
