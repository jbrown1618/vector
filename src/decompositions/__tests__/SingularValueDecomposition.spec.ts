import { calculateSingularValueDecomposition } from '../SingularValueDecomposition';
import { diag, mat } from '../../utilities/aliases';
import { loadTestData } from '@test-utils/testData';

describe('SingularValueDecomposition', () => {
  describe('calculateSingularValueDecomposition', () => {
    test('calculates the Singular Value Decomposition of a matrix A', () => {
      const A = mat([
        [3, 2, 2],
        [2, 3, -2]
      ]);

      const oneOverRootTwo = 1 / Math.sqrt(2);
      const oneOverRootEighteen = 1 / Math.sqrt(18);

      const expectedSigma = diag([5, 3]);
      const expectedU = mat([
        [oneOverRootTwo, oneOverRootTwo],
        [oneOverRootTwo, -1 * oneOverRootTwo]
      ]);
      const expectedV = mat([
        [oneOverRootTwo, oneOverRootEighteen],
        [oneOverRootTwo, -1 * oneOverRootEighteen],
        [0, 4 * oneOverRootEighteen]
      ]);

      const { U, Sigma, V } = calculateSingularValueDecomposition(A);

      // Check that USigmaV* equals A
      const USigmaVStar = U.multiply(Sigma.multiply(V.adjoint()));
      expect(USigmaVStar.equals(A)).toBe(true);

      expect(U.equals(expectedU)).toBe(true);
      expect(V.equals(expectedV)).toBe(true);
      expect(Sigma.equals(expectedSigma)).toBe(true);
    });

    test('calculates the SVD for a random 20x20 matrix', () => {
      const A = loadTestData('random-20x20');
      const svd = calculateSingularValueDecomposition(A);
      expect(svd).toMatchSnapshot();
      // Check that USigmaV* equals A
      const USigmaVStar = svd.U.multiply(svd.Sigma.multiply(svd.V.adjoint()));
      expect(USigmaVStar.equals(A)).toBe(true);
    });
  });
});
