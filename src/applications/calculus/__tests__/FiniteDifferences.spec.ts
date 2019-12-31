import { mat, vec } from '../../..//utilities/aliases';
import {
  backwardDifferenceMatrix,
  centralDifferenceMatrix,
  derivative,
  forwardDifferenceMatrix,
  linspace
} from '../FiniteDifferences';

describe('FiniteDifferences', () => {
  describe('linspace', () => {
    test('creates a vector of evenly spaced numbers', () => {
      const expected = vec([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
      const spaces = linspace(0, 1, 10);
      expect(spaces.equals(expected)).toBe(true);
    });

    test('rejects a max less than a min', () => {
      expect(() => linspace(2, 1, 10)).toThrow();
    });

    test('rejects a negative bin count', () => {
      expect(() => linspace(0, 1, -10)).toThrow();
    });
  });

  describe('forwardDifferenceMatrix', () => {
    test('constructs a forward difference matrix', () => {
      const expected = mat([
        [-1, 1, 0, 0],
        [0, -1, 1, 0],
        [0, 0, -1, 1],
        [0, 0, 0, -1]
      ]);
      const forwardDifference = forwardDifferenceMatrix(4);
      expect(forwardDifference.equals(expected)).toBe(true);
    });
  });

  describe('backwardDifferenceMatrix', () => {
    test('constructs a backward difference matrix', () => {
      const expected = mat([
        [1, 0, 0, 0],
        [-1, 1, 0, 0],
        [0, -1, 1, 0],
        [0, 0, -1, 1]
      ]);
      const backwardDifference = backwardDifferenceMatrix(4);
      expect(backwardDifference.equals(expected)).toBe(true);
    });
  });

  describe('centralDifferenceMatrix', () => {
    test('constructs a central difference matrix', () => {
      const expected = mat([
        [0, 1 / 2, 0, 0],
        [-1 / 2, 0, 1 / 2, 0],
        [0, -1 / 2, 0, 1 / 2],
        [0, 0, -1 / 2, 0]
      ]);
      const centralDifference = centralDifferenceMatrix(4);
      expect(centralDifference.equals(expected)).toBe(true);
    });
  });

  describe('derivative', () => {
    test('calculates a finite difference derivative', () => {
      const testDifferentiation = (f: (x: number) => number, df: (x: number) => number) => {
        const binCount = 100;
        const xMin = 0;
        const xMax = 6;

        const x = linspace(xMin, xMax, binCount);
        const actualDerivative = x.map(df);

        const approximateDerivative = derivative(f, xMin, xMax, binCount);

        // Ignore the first couple and last couple entries
        for (let i = 2; i < binCount - 2; i++) {
          const actual = actualDerivative.getEntry(i);
          const approximate = approximateDerivative.getEntry(i);
          const error = approximate - actual;
          expect(Math.abs(error)).toBeLessThan(0.01);
        }
      };

      testDifferentiation(Math.sin, Math.cos);
      testDifferentiation(
        x => Math.pow(x, 2),
        x => 2 * x
      );
      testDifferentiation(
        x => Math.pow(x, 3),
        x => 3 * Math.pow(x, 2)
      );
    });
  });
});
