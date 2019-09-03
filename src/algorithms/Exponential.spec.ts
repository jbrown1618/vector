import { expect } from 'chai';
import { describe, it } from 'mocha';
import { mat, eye } from '../utilities/aliases';
import { exp, pow } from './Exponential';

describe('Exponential', () => {
  describe('exp', () => {
    it('calculates exp(I) to within the default tolerance', () => {
      const I = eye(10);
      // exp(I) is a matrix with e on the diagonal entries
      const expected = I.scalarMultiply(Math.E);
      const expI = exp(I);
      expect(expI.equals(expected)).to.be.true;
    });

    it('calculates the exponential of a matrix', () => {
      const A = mat([[1, 2], [3, 4]]);
      const expected = mat([
        [51.96895679755742, 74.7365654397869],
        [112.1048481596805, 164.073804957238]
      ]);
      const expA = exp(A);
      expect(expA.equals(expected)).to.be.true;
    });

    it('calculates a more precise exponential', () => {
      const A = mat([[1, 2], [3, 4]]);
      const expected = mat([
        [51.968956152216535, 74.73656449924971],
        [112.1048467488746, 164.0738029010913]
      ]);
      const expA = exp(A, 7);
      expect(expA.equals(expected)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const A = mat([]);
      expect(exp(A)).to.deep.equal(A);
    });
  });

  describe('pow', () => {
    it('calculates a matrix raised to an integral power', () => {
      const A = mat([[4, 7], [2, 6]]);
      const aSquared = mat([[30, 70], [20, 50]]);
      const aCubed = mat([[260, 630], [180, 440]]);
      const I = eye(2);
      const aInv = mat([[0.6, -0.7], [-0.2, 0.4]]);
      const aNegTwo = mat([[0.5, -0.7], [-0.2, 0.3]]);

      expect(pow(A, 1)).to.deep.equal(A);
      expect(pow(A, 2)).to.deep.equal(aSquared);
      expect(pow(A, 3)).to.deep.equal(aCubed);
      expect(pow(A, 0)).to.deep.equal(I);
      expect(pow(A, -1).equals(aInv)).to.be.true;
      expect(pow(A, -2).equals(aNegTwo)).to.be.true;
    });

    it('throws an error for a negative power of a singular matrix', () => {
      const S = mat([[1, 1], [1, 1]]);
      expect(() => pow(S, -3)).to.throw();
    });

    it('handles the degenerate case', () => {
      const A = mat([]);
      expect(pow(A, 2)).to.deep.equal(A);
      expect(pow(A, 3)).to.deep.equal(A);
      expect(pow(A, -1)).to.deep.equal(A);
    });
  });
});
