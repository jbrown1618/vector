import { expect } from 'chai';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import {
  isSquare,
  isUpperTriangular,
  isLowerTriangular,
  isSymmetric,
  isIdentity,
  isOrthogonal,
  isOrthonormal,
  isHermitian
} from './MatrixProperties';
import { ComplexMatrix } from '../types/matrix/ComplexMatrix';
import { ComplexNumber } from '../types/scalar/ComplexNumber';

describe('MatrixProperties', () => {
  describe('isSquare', () => {
    it('returns true for square matrices of various sizes', () => {
      [0, 1, 2, 3, 4, 5].forEach(size => {
        const I = NumberMatrix.builder().identity(size);
        expect(isSquare(I)).to.be.true;
      });
    });

    it('returns false for a non-square matrix', () => {
      const wide = NumberMatrix.builder().fromArray([[1, 2]]);
      const tall = NumberMatrix.builder().fromArray([[1], [2]]);

      expect(isSquare(wide)).to.be.false;
      expect(isSquare(tall)).to.be.false;
    });

    it('returns true for the degenerate matrix', () => {
      expect(isSquare(NumberMatrix.builder().empty())).to.be.true;
    });
  });

  describe('isUpperTriangular', () => {
    it('returns true for an upper-triangular matrix', () => {
      const U = NumberMatrix.builder().fromArray([
        [1, 2, 3, 4],
        [0, 5, 6, 7],
        [0, 0, 8, 9],
        [0, 0, 0, 10]
      ]);

      expect(isUpperTriangular(U)).to.be.true;
    });

    it('returns false for a non-upper-triangular matrix', () => {
      const A = NumberMatrix.builder().fromArray([
        [1, 2, 3, 4],
        [0, 5, 6, 7],
        [0, 0, 8, 9],
        [0, 1, 0, 10]
      ]);

      expect(isUpperTriangular(A)).to.be.false;
    });

    it('returns true for the degenerate matrix', () => {
      expect(isUpperTriangular(NumberMatrix.builder().empty())).to.be.true;
    });
  });

  describe('isLowerTriangular', () => {
    it('returns true for a lower-triangular matrix', () => {
      const L = NumberMatrix.builder().fromArray([
        [1, 0, 0, 0],
        [2, 3, 0, 0],
        [4, 5, 6, 0],
        [7, 8, 9, 10]
      ]);

      expect(isLowerTriangular(L)).to.be.true;
    });

    it('returns false for a non-lower-triangular matrix', () => {
      const A = NumberMatrix.builder().fromArray([
        [1, 0, 0, 0],
        [2, 3, 0, 1],
        [4, 5, 6, 0],
        [7, 8, 9, 10]
      ]);

      expect(isLowerTriangular(A)).to.be.false;
    });

    it('returns true for the degenerate matrix', () => {
      expect(isLowerTriangular(NumberMatrix.builder().empty())).to.be.true;
    });
  });

  describe('isSymmetrix', () => {
    it('returns true for a symmetrix matrix', () => {
      const S = NumberMatrix.builder().fromArray([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 6, 7, 1]
      ]);

      expect(isSymmetric(S)).to.be.true;
    });

    it('returns false for a non-symmetrix matrix', () => {
      const A = NumberMatrix.builder().fromArray([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 3, 7, 1]
      ]);

      expect(isSymmetric(A)).to.be.false;
    });

    it('returns false for a matrix that is nearly symmetric but has an extra row', () => {
      const A = NumberMatrix.builder().fromArray([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 6, 7, 1],
        [1, 1, 1, 1]
      ]);

      expect(isSymmetric(A)).to.be.false;
    });

    it('returns true for the degenerate matrix', () => {
      expect(isSymmetric(NumberMatrix.builder().empty())).to.be.true;
    });
  });

  describe('isHermitian', () => {
    it('returns true for a real symmetric matrix', () => {
      const S = NumberMatrix.builder().fromArray([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 6, 7, 1]
      ]);

      expect(isHermitian(S)).to.be.true;
    });

    it('returns true for a complex Hermitian matrix', () => {
      const H = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(2, 0), new ComplexNumber(3, -4)],
        [new ComplexNumber(3, 4), new ComplexNumber(8, 0)]
      ]);

      expect(isHermitian(H)).to.be.true;
    });

    it('returns false for a complex matrix that is nearly Hermitian, but has an extra row', () => {
      const A = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(2, 0), new ComplexNumber(3, -4)],
        [new ComplexNumber(3, 4), new ComplexNumber(8, 0)],
        [new ComplexNumber(1, 1), new ComplexNumber(1, 1)]
      ]);

      expect(isHermitian(A)).to.be.false;
    });

    it('returns false for a complex non-Hermitian matrix', () => {
      const A = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(2, 1), new ComplexNumber(3, -4)],
        [new ComplexNumber(-3, 4), new ComplexNumber(2, 1)]
      ]);

      expect(isHermitian(A)).to.be.false;
    });

    it('returns true for a degenerate matrix', () => {
      expect(isHermitian(ComplexMatrix.builder().empty())).to.be.true;
    });
  });

  describe('isIdentity', () => {
    it('returns true for an identity matrix', () => {
      const I = NumberMatrix.builder().identity(10);
      expect(isIdentity(I)).to.be.true;
    });

    it('returns false for a non-identity matrix', () => {
      const A = NumberMatrix.builder()
        .identity(10)
        .set(3, 4, 1);

      const B = NumberMatrix.builder()
        .identity(10)
        .set(6, 6, 0);

      const C = NumberMatrix.builder().fromArray([[1, 0], [0, 1], [0, 0]]);

      expect(isIdentity(A)).to.be.false;
      expect(isIdentity(B)).to.be.false;
      expect(isIdentity(C)).to.be.false;
    });

    it('returns true for a degenerate matrix', () => {
      expect(isIdentity(NumberMatrix.builder().empty())).to.be.true;
    });
  });

  describe('isOrthogonal', () => {
    it('returns true for an orthogonal matrix', () => {
      const O = NumberMatrix.builder().fromArray([[1, 0, 0], [0, 2, 0], [0, 0, 3]]);
      expect(isOrthogonal(O)).to.be.true;
    });

    it(`returns false for a non-orthogonal matrix`, () => {
      const A = NumberMatrix.builder().fromArray([[1, 0, 1], [0, 2, 0], [0, 0, 3]]);
      expect(isOrthogonal(A)).to.be.false;
    });

    it('returns true for the degenerate matrix', () => {
      expect(isOrthogonal(NumberMatrix.builder().empty())).to.be.true;
    });
  });

  describe('isOrthonormal', () => {
    it('returns true for an orthonormal matrix', () => {
      const O = NumberMatrix.builder().fromArray([
        [2 / 3, -2 / 3, 1 / 3],
        [1 / 3, 2 / 3, 2 / 3],
        [2 / 3, 1 / 3, -2 / 3]
      ]);
      expect(isOrthonormal(O)).to.be.true;
    });

    it('returns false for a non-orthonormal matrix', () => {
      const O = NumberMatrix.builder().fromArray([
        [2 / 3, -2 / 3, 1 / 3],
        [1 / 3, 2 / 3, 2 / 3],
        [2 / 3, 1, -2 / 3]
      ]);
      expect(isOrthonormal(O)).to.be.false;
    });

    it('returns true for the degenerate matrix', () => {
      expect(isOrthonormal(NumberMatrix.builder().empty())).to.be.true;
    });
  });
});
