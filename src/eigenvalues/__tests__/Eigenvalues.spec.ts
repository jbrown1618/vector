import { mat, vec } from '../../utilities/aliases';
import { ComplexMatrix } from '../../types/matrix/ComplexMatrix';
import { ComplexNumber } from '../../types/scalar/ComplexNumber';
import {
  calculateEigenvalues,
  eig,
  getEigenvectorForEigenvalue
} from '../../eigenvalues/Eigenvalues';

describe('Eigenvalues', () => {
  describe('eig', () => {
    test('calculates the eigenvalue-eigenvector pairs', () => {
      const A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7]
      ]);
      const pairs = eig(A);

      const expectedValues = [3, -2, 1];
      const expectedVectors = [vec([1 / 3, -1 / 3, 1]), vec([0, -1, 1]), vec([1 / 2, -1 / 2, 1])];

      pairs.forEach((pair, i) => {
        expect(pair.eigenvalue).toBeCloseTo(expectedValues[i], 5);
        expect(pair.eigenvector.equals(expectedVectors[i])).toBe(true);
      });
    });
  });

  describe('calculateEigenvalues', () => {
    test('calculates the eigenvalues of a 2x2 matrix', () => {
      const A = mat([
        [2, 1],
        [2, 3]
      ]);
      const eigenvalues = calculateEigenvalues(A);
      const expected = vec([4, 1]);

      expect(eigenvalues.getEntry(0)).toBeCloseTo(expected.getEntry(0), 5);
      expect(eigenvalues.getEntry(1)).toBeCloseTo(expected.getEntry(1), 5);
    });

    test('calculates the eigenvalues of a 3x3 matrix', () => {
      const A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7]
      ]);
      const eigenvalues = calculateEigenvalues(A, 30);
      const expected = vec([3, -2, 1]);

      expect(eigenvalues.getEntry(0)).toBeCloseTo(expected.getEntry(0), 5);
      expect(eigenvalues.getEntry(1)).toBeCloseTo(expected.getEntry(1), 5);
      expect(eigenvalues.getEntry(2)).toBeCloseTo(expected.getEntry(2), 5);
    });

    test('throws an error when eigenvalues are complex for a real-valued scalar type', () => {
      const A = mat([
        [0, -1],
        [1, 0]
      ]);
      expect(() => calculateEigenvalues(A, 20)).toThrow();
    });

    test('calculates the complex eigenvalues of a complex matrix', () => {
      const A = ComplexMatrix.builder().fromNumberArray([
        [0, -1],
        [1, 0]
      ]);
      const eigenvalues = calculateEigenvalues(A);
      expect(eigenvalues.getEntry(0)).toStrictEqual(ComplexNumber.I);
      expect(eigenvalues.getEntry(1)).toStrictEqual(new ComplexNumber(0, -1));
    });
  });

  describe('getEigenvectorForEigenvalue', () => {
    test('gets the eigenvectors for a 2x2 matrix', () => {
      const A = mat([
        [2, 1],
        [2, 3]
      ]);
      const v1 = getEigenvectorForEigenvalue(A, 4);
      const v2 = getEigenvectorForEigenvalue(A, 1);

      expect(v1).toStrictEqual(vec([1 / 2, 1]));
      expect(v2).toStrictEqual(vec([-1, 1]));
    });

    test('gets the eigenvectors for a 3x3 matrix', () => {
      const A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7]
      ]);
      const v1 = getEigenvectorForEigenvalue(A, 3);
      const v2 = getEigenvectorForEigenvalue(A, -2);
      const v3 = getEigenvectorForEigenvalue(A, 1);

      const expected1 = vec([1 / 3, -1 / 3, 1]);
      const expected2 = vec([0, -1, 1]);
      const expected3 = vec([1 / 2, -1 / 2, 1]);

      expect(v1.equals(expected1)).toBe(true);
      expect(v2.equals(expected2)).toBe(true);
      expect(v3.equals(expected3)).toBe(true);
    });
  });
});
