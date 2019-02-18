import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import {
  addRowToRow,
  addScalarMultipleOfRowToRow,
  exchangeRows,
  moveLeadingZerosToBottom,
  multiplyRowByScalar
} from './RowOperations';

describe('RowOperations', () => {
  const original = NumberMatrix.builder().fromData([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

  describe('multiplyRowByScalar', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = multiplyRowByScalar(original, 1, 2);
      expect(transformed.getData()).to.deep.equal([[1, 2, 3], [8, 10, 12], [7, 8, 9]]);
    });
  });

  describe('addRowToRow', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = addRowToRow(original, 0, 1);
      expect(transformed.getData()).to.deep.equal([[5, 7, 9], [4, 5, 6], [7, 8, 9]]);
    });
  });

  describe('addScalarMultipleOfRowToRow', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = addScalarMultipleOfRowToRow(original, 1, 2, 3);
      expect(transformed.getData()).to.deep.equal([[1, 2, 3], [25, 29, 33], [7, 8, 9]]);
    });
  });

  describe('exchangeRows', () => {
    it('returns a new matrix with the correct transformation applied', () => {
      const transformed = exchangeRows(original, 0, 2);
      expect(transformed.getData()).to.deep.equal([[7, 8, 9], [4, 5, 6], [1, 2, 3]]);
    });
  });

  describe('moveLeadingZerosToBottom', () => {
    it('sorts a matrix by the number of leading zeros', () => {
      const unsorted = NumberMatrix.builder().fromData([[0, 5, 5], [5, 5, 5], [0, 0, 5]]);
      const sorted = NumberMatrix.builder().fromData([[5, 5, 5], [0, 5, 5], [0, 0, 5]]);
      const permutation = NumberMatrix.builder().fromData([[0, 1, 0], [1, 0, 0], [0, 0, 1]]);

      const result = moveLeadingZerosToBottom(unsorted);
      expect(result.result).to.deep.equal(sorted);
      expect(result.operator).to.deep.equal(permutation);
    });
  });
});
