import { vec } from '../../utilities/aliases';
import { crossProduct, tripleProduct } from '../CrossProduct';

describe('CrossProduct', () => {
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
