import {
  isSquare,
  isUpperTriangular,
  isLowerTriangular,
  isSymmetric,
  isIdentity,
  isOrthogonal,
  isOrthonormal,
  isHermitian
} from '../MatrixProperties';
import { ComplexMatrix } from '../../types/matrix/ComplexMatrix';
import { ComplexNumber } from '../../types/scalar/ComplexNumber';
import { mat, eye } from '../aliases';

describe('MatrixProperties', () => {
  describe('isSquare', () => {
    test('returns true for square matrices of various sizes', () => {
      [0, 1, 2, 3, 4, 5].forEach(size => {
        const I = eye(size);
        expect(isSquare(I)).toBe(true);
      });
    });

    test('returns false for a non-square matrix', () => {
      const wide = mat([[1, 2]]);
      const tall = mat([[1], [2]]);

      expect(isSquare(wide)).toBe(false);
      expect(isSquare(tall)).toBe(false);
    });

    test('returns true for the degenerate matrix', () => {
      expect(isSquare(mat([]))).toBe(true);
    });
  });

  describe('isUpperTriangular', () => {
    test('returns true for an upper-triangular matrix', () => {
      const U = mat([
        [1, 2, 3, 4],
        [0, 5, 6, 7],
        [0, 0, 8, 9],
        [0, 0, 0, 10]
      ]);

      expect(isUpperTriangular(U)).toBe(true);
    });

    test('returns false for a non-upper-triangular matrix', () => {
      const A = mat([
        [1, 2, 3, 4],
        [0, 5, 6, 7],
        [0, 0, 8, 9],
        [0, 1, 0, 10]
      ]);

      expect(isUpperTriangular(A)).toBe(false);
    });

    test('returns true for the degenerate matrix', () => {
      expect(isUpperTriangular(mat([]))).toBe(true);
    });
  });

  describe('isLowerTriangular', () => {
    test('returns true for a lower-triangular matrix', () => {
      const L = mat([
        [1, 0, 0, 0],
        [2, 3, 0, 0],
        [4, 5, 6, 0],
        [7, 8, 9, 10]
      ]);

      expect(isLowerTriangular(L)).toBe(true);
    });

    test('returns false for a non-lower-triangular matrix', () => {
      const A = mat([
        [1, 0, 0, 0],
        [2, 3, 0, 1],
        [4, 5, 6, 0],
        [7, 8, 9, 10]
      ]);

      expect(isLowerTriangular(A)).toBe(false);
    });

    test('returns true for the degenerate matrix', () => {
      expect(isLowerTriangular(mat([]))).toBe(true);
    });
  });

  describe('isSymmetric', () => {
    test('returns true for a symmetric matrix', () => {
      const S = mat([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 6, 7, 1]
      ]);

      expect(isSymmetric(S)).toBe(true);
    });

    test('returns false for a non-symmetric matrix', () => {
      const A = mat([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 3, 7, 1]
      ]);

      expect(isSymmetric(A)).toBe(false);
    });

    test('returns false for a matrix that is nearly symmetric but has an extra row', () => {
      const A = mat([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 6, 7, 1],
        [1, 1, 1, 1]
      ]);

      expect(isSymmetric(A)).toBe(false);
    });

    test('returns true for the degenerate matrix', () => {
      expect(isSymmetric(mat([]))).toBe(true);
    });
  });

  describe('isHermitian', () => {
    test('returns true for a real symmetric matrix', () => {
      const S = mat([
        [1, 2, 3, 4],
        [2, 1, 5, 6],
        [3, 5, 1, 7],
        [4, 6, 7, 1]
      ]);

      expect(isHermitian(S)).toBe(true);
    });

    test('returns true for a complex Hermitian matrix', () => {
      const H = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(2, 0), new ComplexNumber(3, -4)],
        [new ComplexNumber(3, 4), new ComplexNumber(8, 0)]
      ]);

      expect(isHermitian(H)).toBe(true);
    });

    test('returns false for a complex matrix that is nearly Hermitian, but has an extra row', () => {
      const A = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(2, 0), new ComplexNumber(3, -4)],
        [new ComplexNumber(3, 4), new ComplexNumber(8, 0)],
        [new ComplexNumber(1, 1), new ComplexNumber(1, 1)]
      ]);

      expect(isHermitian(A)).toBe(false);
    });

    test('returns false for a complex non-Hermitian matrix', () => {
      const A = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(2, 1), new ComplexNumber(3, -4)],
        [new ComplexNumber(-3, 4), new ComplexNumber(2, 1)]
      ]);

      expect(isHermitian(A)).toBe(false);
    });

    test('returns true for a degenerate matrix', () => {
      expect(isHermitian(ComplexMatrix.builder().empty())).toBe(true);
    });
  });

  describe('isIdentity', () => {
    test('returns true for an identity matrix', () => {
      const I = eye(10);
      expect(isIdentity(I)).toBe(true);
    });

    test('returns false for a non-identity matrix', () => {
      const A = eye(10).set(3, 4, 1);
      const B = eye(10).set(6, 6, 0);
      const C = mat([
        [1, 0],
        [0, 1],
        [0, 0]
      ]);

      expect(isIdentity(A)).toBe(false);
      expect(isIdentity(B)).toBe(false);
      expect(isIdentity(C)).toBe(false);
    });

    test('returns true for a degenerate matrix', () => {
      expect(isIdentity(mat([]))).toBe(true);
    });
  });

  describe('isOrthogonal', () => {
    test('returns true for an orthogonal matrix', () => {
      const O = mat([
        [1, 0, 0],
        [0, 2, 0],
        [0, 0, 3]
      ]);
      expect(isOrthogonal(O)).toBe(true);
    });

    test(`returns false for a non-orthogonal matrix`, () => {
      const A = mat([
        [1, 0, 1],
        [0, 2, 0],
        [0, 0, 3]
      ]);
      expect(isOrthogonal(A)).toBe(false);
    });

    test('returns true for the degenerate matrix', () => {
      expect(isOrthogonal(mat([]))).toBe(true);
    });
  });

  describe('isOrthonormal', () => {
    test('returns true for an orthonormal matrix', () => {
      const O = mat([
        [2 / 3, -2 / 3, 1 / 3],
        [1 / 3, 2 / 3, 2 / 3],
        [2 / 3, 1 / 3, -2 / 3]
      ]);
      expect(isOrthonormal(O)).toBe(true);
    });

    test('returns false for a non-orthonormal matrix', () => {
      const O = mat([
        [2 / 3, -2 / 3, 1 / 3],
        [1 / 3, 2 / 3, 2 / 3],
        [2 / 3, 1, -2 / 3]
      ]);
      expect(isOrthonormal(O)).toBe(false);
    });

    test('returns true for the degenerate matrix', () => {
      expect(isOrthonormal(mat([]))).toBe(true);
    });
  });
});
