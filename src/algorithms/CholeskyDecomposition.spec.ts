import { expect } from 'chai';
import { describe, it } from 'mocha';
import { mat } from '../utilities/aliases';
import { calculateCholeskyDecomposition } from './CholeskyDecomposition';

describe('CholeskyDecomposition', () => {
  describe('calculateCholeskyDecomposition', () => {
    it('calculates the Cholesky Decomposition of a matrix A', () => {
      const A = mat([[4, 12, -16], [12, 37, -43], [-16, -43, 98]]);
      const expectedL = mat([[2, 0, 0], [6, 1, 0], [-8, 5, 3]]);

      const decomposition = calculateCholeskyDecomposition(A);
      expect(decomposition).not.to.be.undefined;
      const { L } = decomposition as any;
      expect(L).to.deep.equal(expectedL);

      // Check that LL* equals A
      const LLstar = L.multiply(L.adjoint());
      expect(LLstar.equals(A)).to.be.true;
    });

    it('returns undefined for a non-square matrix', () => {
      const A = mat([[1, 2]]);
      expect(calculateCholeskyDecomposition(A)).to.be.undefined;
    });

    it('returns undefined for a non-symmetric matrix', () => {
      const A = mat([[4, 12, -16], [12, 37, -43], [-16, -46, 98]]);
      expect(calculateCholeskyDecomposition(A)).to.be.undefined;
    });

    it('returns undefined for a non-positive-definite matrix', () => {
      const A = mat([[-1]]);
      expect(calculateCholeskyDecomposition(A)).to.be.undefined;
    });
  });
});
