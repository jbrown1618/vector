import { mat } from '../../utilities/aliases';
import { calculateQRDecomposition } from '../QRDecomposition';

describe('QRDecomposition', () => {
  describe('calculateQRDecomposition', () => {
    test('calculates the QR Decomposition of a matrix A', () => {
      const A = mat([
        [12, -51, 4],
        [6, 167, -68],
        [-4, 24, -41]
      ]);

      const expectedQ = mat([
        [6 / 7, -69 / 175, -58 / 175],
        [3 / 7, 158 / 175, 6 / 175],
        [-2 / 7, 6 / 35, -33 / 35]
      ]);

      const expectedR = mat([
        [14, 21, -14],
        [0, 175, -70],
        [0, 0, 35]
      ]);

      const result = calculateQRDecomposition(A);
      expect(result.Q.equals(expectedQ)).toBe(true);
      expect(result.R.equals(expectedR)).toBe(true);

      // Check that QR equals A
      expect(result.Q.multiply(result.R).equals(A)).toBe(true);
    });

    test('rejects a non-square matrix', () => {
      const A = mat([[1, 2]]);
      expect(() => calculateQRDecomposition(A)).toThrow();
    });

    test('rejects a matrix with linearly dependent columns', () => {
      const A = mat([
        [1, 1],
        [1, 1]
      ]);
      expect(() => calculateQRDecomposition(A)).toThrow();
    });
  });
});
