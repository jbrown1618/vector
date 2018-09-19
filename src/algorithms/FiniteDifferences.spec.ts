import { describe, it } from 'mocha';
import { expect } from 'chai';
import { derivative, linspace } from './FiniteDifferences';
import { NumberVector } from '..';

describe('FiniteDifferences', () => {
  describe('derivative', () => {
    it('calculates a finite difference derivative', () => {
      const testDifferentiation = (f: (x: number) => number, df: (x: number) => number) => {
        const binCount = 100;
        const xMin = 0;
        const xMax = 6;

        const x = linspace(xMin, xMax, binCount);
        const actualDerivative = NumberVector.builder().transform(x, df);

        const approximateDerivative = derivative(f, xMin, xMax, binCount);

        // Ignore the first couple and last couple entries
        for (let i = 2; i < binCount - 2; i++) {
          const actual = actualDerivative.getEntry(i);
          const approximate = approximateDerivative.getEntry(i);
          const error = approximate - actual;
          expect(Math.abs(error)).to.be.lessThan(0.01);
        }
      };

      testDifferentiation(Math.sin, Math.cos);
      testDifferentiation(x => Math.pow(x, 2), x => 2 * x);
      testDifferentiation(x => Math.pow(x, 3), x => 3 * Math.pow(x, 2));
    });
  });
});
