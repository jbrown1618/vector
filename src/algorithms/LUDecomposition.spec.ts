import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { calculateLUDecomposition } from './LUDecomposition';

describe('LUDecomposition', () => {
  const matrixBuilder = NumberMatrix.builder();

  describe('calculateLUDecomposition', () => {
    it('calculates the LU Decomposition of a matrix A', () => {
      const A = matrixBuilder.fromData([[2, 3, 2], [1, 3, 2], [3, 4, 1]]);
      const expectedL = matrixBuilder.fromData([[1, 0, 0], [2 / 3, 1, 0], [1 / 3, 5, 1]]);
      const expectedU = matrixBuilder.fromData([[3, 4, 1], [0, 1 / 3, 4 / 3], [0, 0, -5]]);
      const expectedP = matrixBuilder.fromData([[0, 0, 1], [1, 0, 0], [0, 1, 0]]);

      const { L, U, P } = calculateLUDecomposition(A);
      expect(L.equals(expectedL)).to.be.true;
      expect(U.equals(expectedU)).to.be.true;
      expect(P.equals(expectedP)).to.be.true;

      // Check that LU equals PA
      const pa = P.multiply(A);
      const lu = L.multiply(U);
      expect(lu.equals(pa)).to.be.true;
    });

    it('handles matrices that require pivoting', () => {
      const A = matrixBuilder.fromData([[0, 5, 5], [2, 9, 0], [6, 8, 8]]);
      const expectedL = matrixBuilder.fromData([[1, 0, 0], [1 / 3, 1, 0], [0, 15 / 19, 1]]);
      const expectedU = matrixBuilder.fromData([[6, 8, 8], [0, 19 / 3, -8 / 3], [0, 0, 135 / 19]]);
      const expectedP = matrixBuilder.fromData([[0, 0, 1], [0, 1, 0], [1, 0, 0]]);

      const { L, U, P } = calculateLUDecomposition(A);
      expect(L.equals(expectedL)).to.be.true;
      expect(U.equals(expectedU)).to.be.true;
      expect(P.equals(expectedP)).to.be.true;

      // Check that LU equals PA
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
