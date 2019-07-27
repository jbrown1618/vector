import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { calculateSingularValueDecomposition } from './SingularValueDecomposition';
import { NumberVector } from '../types/vector/NumberVector';

describe('SingularValueDecomposition', () => {
  const matrixBuilder = NumberMatrix.builder();
  const vectorBuilder = NumberVector.builder();

  describe('calculateSingularValueDecomposition', () => {
    it('calculates the Singular Value Decomposition of a matrix A', () => {
      const A = matrixBuilder.fromArray([[3, 2, 2], [2, 3, -2]]);

      const oneOverRootTwo = 1 / Math.sqrt(2);
      const oneOverRootEighteen = 1 / Math.sqrt(18);

      const expectedSigma = matrixBuilder.diagonal(vectorBuilder.fromArray([5, 3]));
      const expectedU = matrixBuilder.fromArray([
        [oneOverRootTwo, oneOverRootTwo],
        [oneOverRootTwo, -1 * oneOverRootTwo]
      ]);
      const expectedV = matrixBuilder.fromArray([
        [oneOverRootTwo, oneOverRootEighteen],
        [oneOverRootTwo, -1 * oneOverRootEighteen],
        [0, 4 * oneOverRootEighteen]
      ]);

      const { U, Sigma, V } = calculateSingularValueDecomposition(A);

      // Check that USigmaV* equals A
      const USigmaVStar = U.multiply(Sigma.multiply(V.adjoint()));
      expect(USigmaVStar.equals(A)).to.be.true;

      expect(U.equals(expectedU)).to.be.true;
      expect(V.equals(expectedV)).to.be.true;
      expect(Sigma.equals(expectedSigma)).to.be.true;
    });

    it('calculates the SVD for a random 20x20 matrix', () => {
      const A = matrixBuilder.random(20);
      const { U, Sigma, V } = calculateSingularValueDecomposition(A);
      // Check that USigmaV* equals A
      const USigmaVStar = U.multiply(Sigma.multiply(V.adjoint()));
      expect(USigmaVStar.equals(A)).to.be.true;
    });
  });
});
