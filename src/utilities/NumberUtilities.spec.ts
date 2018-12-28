import { expect } from 'chai';
import { approximatelyEqual } from './NumberUtilities';

describe('NumberUtilities', () => {
  describe('approximatelyEqual', () => {
    it('returns true for numbers within the tolerance', () => {
      const tolerances = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      const numbers = [0, 1, -1, 3.14, -2.71];

      tolerances.forEach(tolerance => {
        numbers.forEach(n => {
          const offByALittle = n + tolerance / 1.1;
          expect(approximatelyEqual(n, offByALittle, tolerance)).to.be.true;
        });
      });
    });

    it('returns false for numbers outside the tolerance', () => {
      const tolerances = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      const numbers = [0, 1, -1, 3.14, -2.71];

      tolerances.forEach(tolerance => {
        numbers.forEach(n => {
          const offByTooMuch = n + tolerance * 1.1;
          expect(approximatelyEqual(n, offByTooMuch, tolerance)).to.be.false;
        });
      });
    });

    it('has a default tolerance of 1e-6', () => {
      const n = 1;
      const offByALittle = 1.0000009;
      const offByTooMuch = 1.0000011;
      expect(approximatelyEqual(n, offByALittle)).to.be.true;
      expect(approximatelyEqual(n, offByTooMuch)).to.be.false;
    });

    it('returns false for two NaNs', () => {
      expect(approximatelyEqual(NaN, NaN)).to.be.false;
    });

    it('returns false for two infinities', () => {
      expect(approximatelyEqual(Infinity, Infinity)).to.be.false;
      expect(approximatelyEqual(-Infinity, -Infinity)).to.be.false;
    });
  });
});
