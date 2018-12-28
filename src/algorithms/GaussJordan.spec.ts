import { describe, it } from 'mocha';
import { expect } from 'chai';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { inverse, reducedRowEchelonForm, rowEchelonForm } from './GaussJordan';
import { Matrix } from '../types/matrix/Matrix';

describe('GaussJordan', () => {
  describe('rowEchelonForm', () => {
    it('row reduces a "wide" matrix', () => {
      const A = NumberMatrix.builder().fromData([[1, 2, 3], [4, 5, 6]]);
      const Aref = rowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 2, 3], [0, 1, 2]]);
    });

    it('row reduces a "tall" matrix', () => {
      const A = NumberMatrix.builder().fromData([[0, 1], [0, 0], [5, 9]]);
      const Aref = rowEchelonForm(A);
      const expected = NumberMatrix.builder().fromData([[1, 1.8], [0, 1], [0, 0]]);
      expect(Aref.equals(expected)).to.be.true;
    });

    it('row reduces a matrix with non-independent rows', () => {
      const A = NumberMatrix.builder().fromData([[1, 2, 3], [1, 1, 1], [1, 1, 1]]);

      const Aref = rowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 2, 3], [0, 1, 2], [0, 0, 0]]);
    });

    it('row reduces a matrix with non-diagonal pivot entries', () => {
      const A = NumberMatrix.builder().fromData([[1, 1, 1], [0, 0, 2], [0, 0, 1]]);

      const Aref = rowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 1, 1], [0, 0, 1], [0, 0, 0]]);
    });

    it('does nothing to an identity matrix', () => {
      const I = NumberMatrix.builder().identity(3);
      const ref = rowEchelonForm(I);
      expect(ref.equals(I)).to.be.true;
    });

    it('handles the degenerate case', () => {
      expect(rowEchelonForm(NumberMatrix.builder().empty()).getData()).to.deep.equal([]);
    });
  });

  describe('reducedRowEchelonForm', () => {
    it('row reduces a "wide" matrix', () => {
      const A = NumberMatrix.builder().fromData([[1, 2, 3], [4, 5, 6]]);
      const Aref = reducedRowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 0, -1], [0, 1, 2]]);
    });

    it('row reduces a "tall" matrix', () => {
      const A = NumberMatrix.builder().fromData([[0, 1], [0, 0], [5, 9]]);
      const Aref = reducedRowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 0], [0, 1], [0, 0]]);
    });

    it('row reduces a matrix with non-independent rows', () => {
      const A = NumberMatrix.builder().fromData([[1, 2, 3], [1, 1, 1], [1, 1, 1]]);

      const Aref = reducedRowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 0, -1], [0, 1, 2], [0, 0, 0]]);
    });

    it('row reduces a matrix with non-diagonal pivot entries', () => {
      const A = NumberMatrix.builder().fromData([[1, 1, 1], [0, 0, 2], [0, 0, 1]]);

      const Aref = reducedRowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 1, 0], [0, 0, 1], [0, 0, 0]]);
    });

    it('does nothing to an identity matrix', () => {
      const I = NumberMatrix.builder().identity(3);
      const ref = reducedRowEchelonForm(I);
      expect(ref.equals(I)).to.be.true;
    });

    it('handles the degenerate case', () => {
      expect(reducedRowEchelonForm(NumberMatrix.builder().empty()).getData()).to.deep.equal([]);
    });
  });

  describe('inverse', () => {
    it('does not affect an identity matrix', () => {
      const I = NumberMatrix.builder().identity(3);
      const Iinv = inverse(I);
      expect(Iinv).to.not.be.undefined;
      expect((Iinv as Matrix<number>).equals(I)).to.be.true;
    });

    it('calculates the inverse of a square matrix', () => {
      const A = NumberMatrix.builder().fromData([[4, 7], [2, 6]]);
      const expectedInverse = NumberMatrix.builder().fromData([[0.6, -0.7], [-0.2, 0.4]]);
      const Ainv = inverse(A) as Matrix<number>;
      expect(Ainv).to.not.be.undefined;
      expect(Ainv.equals(expectedInverse)).to.be.true;
    });

    it('rejects a non-square matrix', () => {
      const nonSquare = NumberMatrix.builder().fromData([[0, 1]]);
      expect(() => inverse(nonSquare)).to.throw();
    });

    it('returns undefined for a singular matrix', () => {
      const S = NumberMatrix.builder().fromData([[0, 0], [0, 0]]);
      const Sinv = inverse(S);
      expect(Sinv).to.be.undefined;
    });
  });
});
