import {
  columnSumSupremumNorm,
  euclideanNorm,
  frobeniusNorm,
  normalize,
  pNorm,
  rowSumSupremumNorm,
  sumNorm,
  supremumNorm
} from '../Norms';
import { vec, mat, zeros } from '../../utilities/aliases';

describe('Norms', () => {
  describe('Vector norms', () => {
    describe('normalize', () => {
      test('returns a vector scaled to have a norm of 1', () => {
        const v = vec([3, 4]);
        const expected = vec([3 / 5, 4 / 5]);
        const normalized = normalize(v);
        if (normalized === undefined) {
          expect(true).toBe(false); // Should not be undefined
          return;
        }
        expect(normalized.equals(expected)).toBe(true);
        expect(euclideanNorm(normalized)).toEqual(1);
      });

      test('handles the zero vector', () => {
        expect(normalize(vec([0, 0, 0, 0, 0]))).toBeUndefined;
      });

      test('handles the empty vector', () => {
        expect(normalize(vec([]))).toBeUndefined;
      });
    });

    describe('pNorm', () => {
      test('calculates the p-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(pNorm(v, 1)).toEqual(7);
        expect(pNorm(v, 2)).toEqual(5);
        expect(pNorm(v, 3)).toEqual(4.497941445275415);
      });

      test('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(pNorm(zero, 1)).toEqual(0);
        expect(pNorm(zero, 2)).toEqual(0);
        expect(pNorm(zero, 3)).toEqual(0);
      });

      test('handles the empty vector', () => {
        const empty = vec([]);
        expect(pNorm(empty, 1)).toEqual(0);
        expect(pNorm(empty, 2)).toEqual(0);
        expect(pNorm(empty, 3)).toEqual(0);
      });

      test('rejects p < 1', () => {
        const v = vec([3, 4]);
        [0, -1, -2].forEach(p => {
          expect(() => pNorm(v, p)).toThrow();
        });
      });
    });

    describe('sumNorm', () => {
      test('calculates the 1-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(sumNorm(v)).toEqual(7);
      });

      test('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(sumNorm(zero)).toEqual(0);
      });

      test('handles the empty vector', () => {
        const empty = vec([]);
        expect(sumNorm(empty)).toEqual(0);
      });
    });

    describe('euclideanNorm', () => {
      test('calculates the 2-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(euclideanNorm(v)).toEqual(5);
      });

      test('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(euclideanNorm(zero)).toEqual(0);
      });

      test('handles the empty vector', () => {
        const empty = vec([]);
        expect(euclideanNorm(empty)).toEqual(0);
      });
    });

    describe('supremumNorm', () => {
      test('calculates the infinity-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(supremumNorm(v)).toEqual(4);
      });

      test('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(supremumNorm(zero)).toEqual(0);
      });

      test('handles the empty vector', () => {
        const empty = vec([]);
        expect(supremumNorm(empty)).toEqual(0);
      });
    });
  });

  describe('Matrix norms', () => {
    describe('frobeniusNorm', () => {
      test('calculates the Frobenius Norm of a matrix', () => {
        const A = mat([
          [1, 2],
          [3, 4]
        ]);
        const norm = frobeniusNorm(A);
        expect(norm).toEqual(5.477225575051661);
      });

      test('handles the zero matrix', () => {
        const zero = zeros([5, 5]);
        expect(frobeniusNorm(zero)).toEqual(0);
      });

      test('handles the empty matrix', () => {
        const empty = mat([]);
        expect(frobeniusNorm(empty)).toEqual(0);
      });
    });

    describe('columnSumSupremumNorm', () => {
      test('calculates the 1-norm of a matrix', () => {
        const A = mat([
          [1, 2],
          [3, 4]
        ]);
        const norm = columnSumSupremumNorm(A);
        expect(norm).toEqual(6);
      });

      test('handles the zero matrix', () => {
        const zero = zeros([5, 5]);
        expect(columnSumSupremumNorm(zero)).toEqual(0);
      });

      test('handles the empty matrix', () => {
        const empty = mat([]);
        expect(columnSumSupremumNorm(empty)).toEqual(0);
      });
    });

    describe('rowSumSupremumNorm', () => {
      test('calculates the infinity-norm of a matrix', () => {
        const A = mat([
          [1, 2],
          [3, 4]
        ]);
        const norm = rowSumSupremumNorm(A);
        expect(norm).toEqual(7);
      });

      test('handles the zero matrix', () => {
        const zero = zeros([5, 5]);
        expect(rowSumSupremumNorm(zero)).toEqual(0);
      });

      test('handles the empty matrix', () => {
        const empty = mat([]);
        expect(rowSumSupremumNorm(empty)).toEqual(0);
      });
    });
  });
});
