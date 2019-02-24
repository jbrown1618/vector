import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { exp, pow } from './Exponential';

describe('Exponential', () => {
  const matrixBuilder = NumberMatrix.builder();

  describe('exp', () => {
    it('calculates exp(I) to within the default tolerance', () => {
      const I = matrixBuilder.identity(10);
      // exp(I) is a matrix with e on the diagonal entries
      const expected = I.scalarMultiply(Math.E);
      const expI = exp(I);
      expect(expI.equals(expected)).to.be.true;
    });

    it('calculates the exponential of a matrix', () => {
      const A = matrixBuilder.fromData([[1, 2], [3, 4]]);
      const expected = matrixBuilder.fromData([
        [51.96895679755742, 74.7365654397869],
        [112.1048481596805, 164.073804957238]
      ]);
      const expA = exp(A);
      expect(expA.equals(expected)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const A = matrixBuilder.empty();
      expect(exp(A)).to.deep.equal(A);
    });
  });

  describe('pow', () => {
    it('calculates a matrix raised to an integral power', () => {
      const A = matrixBuilder.fromData([[4, 7], [2, 6]]);
      const aSquared = matrixBuilder.fromData([[30, 70], [20, 50]]);
      const aCubed = matrixBuilder.fromData([[260, 630], [180, 440]]);
      const I = matrixBuilder.identity(2);
      const aInv = matrixBuilder.fromData([[0.6, -0.7], [-0.2, 0.4]]);
      const aNegTwo = matrixBuilder.fromData([[0.5, -0.7], [-0.2, 0.3]]);

      expect(pow(A, 1)).to.deep.equal(A);
      expect(pow(A, 2)).to.deep.equal(aSquared);
      expect(pow(A, 3)).to.deep.equal(aCubed);
      expect(pow(A, 0)).to.deep.equal(I);
      expect(pow(A, -1).equals(aInv)).to.be.true;
      expect(pow(A, -2).equals(aNegTwo)).to.be.true;
    });

    it('throws an error for a negative power of a singular matrix', () => {
      const S = matrixBuilder.fromData([[1, 1], [1, 1]]);
      expect(() => pow(S, -3)).to.throw();
    });

    it('handles the degenerate case', () => {
      const A = matrixBuilder.empty();
      expect(pow(A, 2)).to.deep.equal(A);
      expect(pow(A, 3)).to.deep.equal(A);
      expect(pow(A, -1)).to.deep.equal(A);
    });
  });
});
