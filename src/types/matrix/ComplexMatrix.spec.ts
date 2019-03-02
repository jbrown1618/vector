import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ComplexNumber } from '../..';
import { ComplexMatrix } from './ComplexMatrix';

describe('ComplexMatrix', () => {
  describe('adjoint', () => {
    it('returns the conjugate transpose of the matrix', () => {
      const original = ComplexMatrix.builder().fromData([
        [new ComplexNumber(1, 2), new ComplexNumber(3, 4)],
        [new ComplexNumber(5, 6), new ComplexNumber(7, 8)]
      ]);
      const expected = ComplexMatrix.builder().fromData([
        [new ComplexNumber(1, -2), new ComplexNumber(5, -6)],
        [new ComplexNumber(3, -4), new ComplexNumber(7, -8)]
      ]);
      expect(original.adjoint()).to.deep.equal(expected);
    });
  });
});
