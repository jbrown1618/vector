import { mat } from '../../utilities/aliases';
import { calculateLUDecomposition } from '../LUDecomposition';

describe('LUDecomposition', () => {
  describe('calculateLUDecomposition', () => {
    test('calculates the LU Decomposition of a matrix A', () => {
      const A = mat([
        [2, 3, 2],
        [1, 3, 2],
        [3, 4, 1]
      ]);
      const expectedL = mat([
        [1, 0, 0],
        [2 / 3, 1, 0],
        [1 / 3, 5, 1]
      ]);
      const expectedU = mat([
        [3, 4, 1],
        [0, 1 / 3, 4 / 3],
        [0, 0, -5]
      ]);
      const expectedP = mat([
        [0, 0, 1],
        [1, 0, 0],
        [0, 1, 0]
      ]);

      const { L, U, P } = calculateLUDecomposition(A);
      expect(L.equals(expectedL)).toBe(true);
      expect(U.equals(expectedU)).toBe(true);
      expect(P.equals(expectedP)).toBe(true);

      // Check that LU equals PA
      const pa = P.multiply(A);
      const lu = L.multiply(U);
      expect(lu.equals(pa)).toBe(true);
    });

    test('handles matrices that require pivoting', () => {
      const A = mat([
        [0, 5, 5],
        [2, 9, 0],
        [6, 8, 8]
      ]);
      const expectedL = mat([
        [1, 0, 0],
        [1 / 3, 1, 0],
        [0, 15 / 19, 1]
      ]);
      const expectedU = mat([
        [6, 8, 8],
        [0, 19 / 3, -8 / 3],
        [0, 0, 135 / 19]
      ]);
      const expectedP = mat([
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0]
      ]);

      const { L, U, P } = calculateLUDecomposition(A);
      expect(L.equals(expectedL)).toBe(true);
      expect(U.equals(expectedU)).toBe(true);
      expect(P.equals(expectedP)).toBe(true);

      // Check that LU equals PA
      const pa = P.multiply(A);
      const lu = L.multiply(U);
      expect(lu.equals(pa)).toBe(true);
    });

    test('rejects a non-square matrix', () => {
      const A = mat([[1, 2]]);
      expect(() => calculateLUDecomposition(A)).toThrow();
    });
  });
});
