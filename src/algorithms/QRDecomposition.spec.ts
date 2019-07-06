import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { calculateQRDecomposition } from './QRDecomposition';

describe('QRDecomposition', () => {
  const matrixBuilder = NumberMatrix.builder();

  describe('calculateQRDecomposition', () => {
    it('calculates the QR Decomposition of a matrix A', () => {
      const A = matrixBuilder.fromArray([[12, -51, 4], [6, 167, -68], [-4, 24, -41]]);

      const expectedQ = matrixBuilder.fromArray([
        [6 / 7, -69 / 175, -58 / 175],
        [3 / 7, 158 / 175, 6 / 175],
        [-2 / 7, 6 / 35, -33 / 35]
      ]);

      const expectedR = matrixBuilder.fromArray([[14, 21, -14], [0, 175, -70], [0, 0, 35]]);

      const result = calculateQRDecomposition(A);
      expect(result.Q.equals(expectedQ)).to.be.true;
      expect(result.R.equals(expectedR)).to.be.true;

      // Check that QR equals A
      expect(result.Q.multiply(result.R).equals(A)).to.be.true;
    });

    it('rejects a non-square matrix', () => {
      const A = matrixBuilder.fromArray([[1, 2]]);
      expect(() => calculateQRDecomposition(A)).to.throw();
    });

    it('rejects a matrix with linearly dependent columns', () => {
      const A = matrixBuilder.fromArray([[1, 1], [1, 1]]);
      expect(() => calculateQRDecomposition(A)).to.throw();
    });
  });
});
