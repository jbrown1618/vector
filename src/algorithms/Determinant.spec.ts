import { describe, it } from 'mocha';
import { expect } from 'chai';
import { determinant } from './Determinant';
import { NumberMatrix } from '..';

describe('Determinant', () => {
  describe('determinant', () => {
    it('calculates the determinant of a 2x2 matrix', () => {
      const A = NumberMatrix.fromData([[3, 4], [2, 1]]);

      expect(determinant(A)).to.equal(-5);
    });

    it('calculates the determinant of a NxN matrix', () => {
      let A = NumberMatrix.fromData([[1, 3, 2], [4, 1, 3], [2, 5, 2]]);
      expect(determinant(A)).to.equal(17);

      A = NumberMatrix.fromData([[3, 2, 0, 1], [4, 0, 1, 2], [3, 0, 2, 1], [9, 2, 3, 1]]);
      expect(determinant(A)).to.equal(24);
    });

    it('throws an error for a non-square matrix', () => {
      expect(() => determinant(NumberMatrix.fromData([[1, 1]]))).to.throw();
    });
  });
});
