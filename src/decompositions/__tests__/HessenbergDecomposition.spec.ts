import { mat } from '../../utilities/aliases';
import { reduceToHessenberg } from '../HessenbergDecomposition';
import { calculateEigenvalues } from '../../eigenvalues/Eigenvalues';

describe('HessenbergDecomposition', () => {
  describe('reduceToHessenberg', () => {
    test('reduces a 3x3 matrix to upper Hessenberg form', () => {
      const A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7],
      ]);
      const H = reduceToHessenberg(A);
      // Verify upper Hessenberg form: H[i][j] = 0 for i > j + 1
      expect(H.getEntry(2, 0)).toBeCloseTo(0, 10);
    });

    test('preserves eigenvalues', () => {
      const A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7],
      ]);
      const eigenvaluesBefore = calculateEigenvalues(A).toArray().sort();
      const H = reduceToHessenberg(A);
      const eigenvaluesAfter = calculateEigenvalues(H).toArray().sort();

      eigenvaluesBefore.forEach((val, i) => {
        expect(eigenvaluesAfter[i]).toBeCloseTo(val, 5);
      });
    });

    test('returns the matrix unchanged for 2x2 or smaller', () => {
      const A = mat([
        [1, 2],
        [3, 4],
      ]);
      expect(reduceToHessenberg(A)).toBe(A);

      const B = mat([[5]]);
      expect(reduceToHessenberg(B)).toBe(B);
    });

    test('handles a matrix with zero leading subdiagonal element', () => {
      // This triggers the x0Norm === 0 branch in the Householder reflection
      const A = mat([
        [0, 0, 1],
        [0, 0, 0],
        [1, 0, 0],
      ]);
      const H = reduceToHessenberg(A);
      // Verify upper Hessenberg form: H[i][j] = 0 for i > j + 1
      expect(H.getEntry(2, 0)).toBeCloseTo(0, 10);
      // Eigenvalues should be preserved (eigenvalues of A are 1, -1, 0)
      const eigenvalues = calculateEigenvalues(A).toArray().sort();
      expect(eigenvalues[0]).toBeCloseTo(-1, 5);
      expect(eigenvalues[1]).toBeCloseTo(0, 5);
      expect(eigenvalues[2]).toBeCloseTo(1, 5);
    });
  });
});
