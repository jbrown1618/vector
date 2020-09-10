import { vec, ones, mat } from '../../utilities/aliases';
import {
  crossProduct,
  tripleProduct,
  dotProduct,
  hadamardProduct,
  kroneckerProduct,
} from '../Products';

describe('Products', () => {
  describe('dotProduct', () => {
    test('computes a scalar product of two vectors', () => {
      const first = vec([2, 3, 4]);
      const second = vec([3, 4, 5]);

      expect(dotProduct(first, second)).toEqual(2 * 3 + 3 * 4 + 4 * 5);
    });

    test('throws an error when the dimensions do not match', () => {
      const vector2 = vec([0, 0]);
      const vector3 = vec([0, 0, 0]);

      expect(() => dotProduct(vector2, vector3)).toThrow();
    });

    test('handles the degenerate case', () => {
      const firstEmpty = vec([]);
      const secondEmpty = vec([]);

      expect(dotProduct(firstEmpty, secondEmpty)).toEqual(0);
    });
  });

  describe('hadamardProduct', () => {
    describe('of two vectors', () => {
      test('computes an element-wise product', () => {
        const first = vec([1, 2, 3]);
        const second = vec([4, 5, 6]);
        expect(hadamardProduct(first, second)).toStrictEqual(vec([4, 10, 18]));
      });

      test('rejects a dimension mismatch', () => {
        expect(() => hadamardProduct(ones(3), ones(2))).toThrow();
      });

      test('handles the degenerate case', () => {
        const empty = vec([]);
        expect(hadamardProduct(empty, empty)).toStrictEqual(empty);
      });
    });

    describe('of two matrices', () => {
      test('computes an element-wise product', () => {
        const first = mat([
          [1, 2, 3],
          [4, 5, 6],
        ]);
        const second = mat([
          [2, 3, 4],
          [5, 6, 7],
        ]);
        expect(hadamardProduct(first, second)).toStrictEqual(
          mat([
            [2, 6, 12],
            [20, 30, 42],
          ])
        );
      });

      test('rejects a dimension mismatch', () => {
        expect(() => hadamardProduct(ones([3, 2]), ones([2, 2]))).toThrow();
      });

      test('handles the degenerate case', () => {
        const empty = mat([]);
        expect(hadamardProduct(empty, empty)).toStrictEqual(empty);
      });
    });
  });

  describe('kroneckerProduct', () => {
    test('computes a generalized outer product', () => {
      const first = mat([
        [1, 2],
        [3, 4],
      ]);
      const second = mat([
        [5, 6, 7],
        [8, 9, 0],
      ]);
      const expected = mat([
        [5, 6, 7, 8, 9, 0],
        [15, 18, 21, 24, 27, 0],
        [10, 12, 14, 16, 18, 0],
        [20, 24, 28, 32, 36, 0],
      ]);
      expect(kroneckerProduct(first, second)).toStrictEqual(expected);
    });
    test('handles the degenerate case', () => {
      const empty = mat([]);
      const nonempty = mat([
        [1, 2],
        [3, 4],
      ]);
      expect(kroneckerProduct(empty, empty)).toStrictEqual(empty);
      expect(kroneckerProduct(empty, nonempty)).toStrictEqual(empty);
      expect(kroneckerProduct(nonempty, empty)).toStrictEqual(empty);
    });
  });

  describe('crossProduct', () => {
    test('calculates the cross product of two vectors', () => {
      const v = vec([1, 2, 3]);
      const u = vec([4, 5, 6]);
      const vCrossU = vec([-3, 6, -3]);

      expect(crossProduct(v, u)).toStrictEqual(vCrossU);
      expect(crossProduct(u, v)).toStrictEqual(vCrossU.scalarMultiply(-1));
    });

    test('preserves the relationships among the unit vectors in R3', () => {
      const i = vec([1, 0, 0]);
      const j = vec([0, 1, 0]);
      const k = vec([0, 0, 1]);

      expect(crossProduct(i, j)).toStrictEqual(k);
      expect(crossProduct(j, k)).toStrictEqual(i);
      expect(crossProduct(k, i)).toStrictEqual(j);
    });

    test('rejects vectors not in R3', () => {
      const v = vec([1, 2, 3]);
      const u = vec([1, 2]);

      expect(() => crossProduct(v, u)).toThrow();
      expect(() => crossProduct(u, v)).toThrow();
      expect(() => crossProduct(u, u)).toThrow();
    });
  });

  describe('tripleProduct', () => {
    test('calculates the scalar triple product of two vectors', () => {
      const v = vec([-2, 3, 1]);
      const u = vec([0, 4, 0]);
      const w = vec([-1, 3, 3]);

      const product = tripleProduct(v, u, w);
      expect(product).toEqual(-20);
    });

    test('rejects vectors not in R3', () => {
      const v = vec([1, 2, 3]);
      const u = vec([1, 2]);

      expect(() => tripleProduct(v, v, u)).toThrow();
      expect(() => tripleProduct(v, u, v)).toThrow();
      expect(() => tripleProduct(u, v, v)).toThrow();
      expect(() => tripleProduct(v, u, u)).toThrow();
      expect(() => tripleProduct(u, v, u)).toThrow();
      expect(() => tripleProduct(u, u, v)).toThrow();
      expect(() => tripleProduct(u, u, u)).toThrow();
    });
  });
});
