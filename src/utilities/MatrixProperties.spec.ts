import { expect } from 'chai';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { isSquare } from './MatrixProperties';

describe('MatrixProperties', () => {
  describe('isSquare', () => {
    it('returns true for square matrices of various sizes', () => {
      [0, 1, 2, 3, 4, 5].forEach(size => {
        const I = NumberMatrix.builder().identity(size);
        expect(isSquare(I)).to.be.true;
      });
    });

    it('returns false for a non-square matrix', () => {
      const wide = NumberMatrix.builder().fromArray([[1, 2]]);
      const tall = NumberMatrix.builder().fromArray([[1], [2]]);

      expect(isSquare(wide)).to.be.false;
      expect(isSquare(tall)).to.be.false;
    });
  });
});
