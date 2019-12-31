import { mat } from '../../utilities/aliases';
import { calculateCholeskyDecomposition } from '../CholeskyDecomposition';

describe('CholeskyDecomposition', () => {
  describe('calculateCholeskyDecomposition', () => {
    test('calculates the Cholesky Decomposition of a matrix A', () => {
      const A = mat([
        [4, 12, -16],
        [12, 37, -43],
        [-16, -43, 98]
      ]);
      const expectedL = mat([
        [2, 0, 0],
        [6, 1, 0],
        [-8, 5, 3]
      ]);

      const decomposition = calculateCholeskyDecomposition(A);
      expect(decomposition).not.toBeUndefined;
      const { L } = decomposition as any;
      expect(L).toStrictEqual(expectedL);

      // Check that LL* equals A
      const LLstar = L.multiply(L.adjoint());
      expect(LLstar.equals(A)).toBe(true);
    });

    test('returns undefined for a non-square matrix', () => {
      const A = mat([[1, 2]]);
      expect(calculateCholeskyDecomposition(A)).toBeUndefined;
    });

    test('returns undefined for a non-symmetric matrix', () => {
      const A = mat([
        [4, 12, -16],
        [12, 37, -43],
        [-16, -46, 98]
      ]);
      expect(calculateCholeskyDecomposition(A)).toBeUndefined;
    });

    test('returns undefined for a non-positive-definite matrix', () => {
      const A = mat([[-1]]);
      expect(calculateCholeskyDecomposition(A)).toBeUndefined;
    });
  });
});
