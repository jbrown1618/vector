import { describe, it } from 'mocha';
import { expect } from 'chai';
import { RowOperations } from './RowOperations';
import { NumberMatrix } from '..';

describe('RowOperations', () => {
  const original = NumberMatrix.builder().fromData([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

  describe('multiplyRowByScalar', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.multiplyRowByScalar(original, 1, 2);
      expect(transformed.getData()).to.deep.equal([[1, 2, 3], [8, 10, 12], [7, 8, 9]]);
    });
  });

  describe('addRowToRow', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.addRowToRow(original, 0, 1);
      expect(transformed.getData()).to.deep.equal([[5, 7, 9], [4, 5, 6], [7, 8, 9]]);
    });
  });

  describe('addScalarMultipleOfRowToRow', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.addScalarMultipleOfRowToRow(original, 1, 2, 3);
      expect(transformed.getData()).to.deep.equal([[1, 2, 3], [25, 29, 33], [7, 8, 9]]);
    });
  });

  describe('exchangeRows', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.exchangeRows(original, 0, 2);
      expect(transformed.getData()).to.deep.equal([[7, 8, 9], [4, 5, 6], [1, 2, 3]]);
    });
  });
});
