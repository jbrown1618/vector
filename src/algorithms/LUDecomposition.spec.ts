import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { calculateLUDecomposition } from './LUDecomposition';

describe('LUDecomposition', () => {
  const matrixBuilder = NumberMatrix.builder();

  describe('calculateLUDecomposition', () => {
    it('calculates the LU Decomposition of a matrix A', () => {
      const A = matrixBuilder.fromData([[2, 3, 2], [1, 3, 2], [3, 4, 1]]);
      const expectedL = matrixBuilder.fromData([[1, 0, 0], [1 / 2, 1, 0], [3 / 2, -1 / 3, 1]]);
      const expectedU = matrixBuilder.fromData([[2, 3, 2], [0, 3 / 2, 1], [0, 0, -5 / 3]]);
      const expectedP = matrixBuilder.identity(3);

      const { L, U, P } = calculateLUDecomposition(A);
      expect(L).to.deep.equal(expectedL);
      expect(U).to.deep.equal(expectedU);
      expect(P).to.deep.equal(expectedP);

      // Check that QR equals A
      const pa = P.multiply(A);
      const lu = L.multiply(U);
      expect(lu.equals(pa)).to.be.true;
    });

    it('rejects a non-square matrix', () => {
      const A = matrixBuilder.fromData([[1, 2]]);
      expect(() => calculateLUDecomposition(A)).to.throw();
    });
  });
});
