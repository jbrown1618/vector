import { mat, vec } from '../../utilities/aliases';
import { ComplexMatrix } from '../../types/matrix/ComplexMatrix';
import { ComplexNumber } from '../../types/scalar/ComplexNumber';
import {
  calculateEigenvalues,
  eig,
  getEigenvectorForEigenvalue,
} from '../../eigenvalues/Eigenvalues';

describe('Eigenvalues', () => {
  describe('eig', () => {
    test('calculates the eigenvalue-eigenvector pairs', () => {
      let A = mat([
        [1, 0, 0],
        [0, 2, 0],
        [0, 0, 3],
      ]);
      let expectedValues = [1, 2, 3];
      let expectedVectors = [vec([1, 0, 0]), vec([0, 1, 0]), vec([0, 0, 1])];

      let pairs = eig(A);
      expectedValues.forEach((val, i) => {
        const match = pairs.find((p) => Math.abs(p.eigenvalue - val) < 1e-5);
        expect(match).toBeDefined();
        expect(match!.eigenvector.equals(expectedVectors[i])).toBe(true);
      });

      A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7],
      ]);
      expectedValues = [3, -2, 1];
      expectedVectors = [vec([1 / 3, -1 / 3, 1]), vec([0, -1, 1]), vec([1 / 2, -1 / 2, 1])];

      pairs = eig(A);
      expectedValues.forEach((val, i) => {
        const match = pairs.find((p) => Math.abs(p.eigenvalue - val) < 1e-5);
        expect(match).toBeDefined();
        expect(match!.eigenvector.equals(expectedVectors[i])).toBe(true);
      });
    });

    test('calculates eigenvalue-eigenvector pairs of a singular matrix', () => {
      const A = mat([
        [2, -1, -1],
        [-1, 2, -1],
        [-1, -1, 2],
      ]);
      const expectedValues = [3, 3, 0];
      const expectedVectors = [vec([-2, 1, 1]), vec([-2, 1, 1]), vec([1, 1, 1])];

      const pairs = eig(A);
      expectedValues.forEach((val, i) => {
        const match = pairs.find((p) => Math.abs(p.eigenvalue - val) < 1e-5);
        expect(match).toBeDefined();
        expect(match!.eigenvector.equals(expectedVectors[i])).toBe(true);
      });
    });
  });

  describe('calculateEigenvalues', () => {
    test('exactly calculates the eigenvalues of a 1x1 matrix', () => {
      const A = mat([[6]]);
      const eigenvalues = calculateEigenvalues(A);
      const expected = vec([6]);
      expect(eigenvalues).toStrictEqual(expected);
    });

    test('calculates the eigenvalues of a 2x2 matrix', () => {
      const A = mat([
        [2, 1],
        [2, 3],
      ]);
      const eigenvalues = calculateEigenvalues(A).toArray().sort();
      const expected = [1, 4];

      expect(eigenvalues[0]).toBeCloseTo(expected[0], 5);
      expect(eigenvalues[1]).toBeCloseTo(expected[1], 5);
    });

    test('calculates the eigenvalues of a 3x3 matrix', () => {
      const A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7],
      ]);
      const eigenvalues = calculateEigenvalues(A, 30).toArray().sort();
      const expected = [-2, 1, 3];

      expected.forEach((val, i) => {
        expect(eigenvalues[i]).toBeCloseTo(val, 5);
      });
    });

    test('throws an error when eigenvalues are complex for a real-valued scalar type', () => {
      const A = mat([
        [0, -1],
        [1, 0],
      ]);
      expect(() => calculateEigenvalues(A, 20)).toThrow();
    });

    test('calculates the complex eigenvalues of a complex matrix', () => {
      const A = ComplexMatrix.builder().fromNumberArray([
        [0, -1],
        [1, 0],
      ]);
      const eigenvalues = calculateEigenvalues(A);
      const vals = [eigenvalues.getEntry(0), eigenvalues.getEntry(1)];
      const hasI = vals.some((v) => v.equals(ComplexNumber.I));
      const hasNegI = vals.some((v) => v.equals(new ComplexNumber(0, -1)));
      expect(hasI).toBe(true);
      expect(hasNegI).toBe(true);
    });

    test('rejects a non-square matrix', () => {
      const A = mat([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      expect(() => calculateEigenvalues(A)).toThrow();
    });
  });

  describe('getEigenvectorForEigenvalue', () => {
    test('gets the eigenvectors for a 2x2 matrix', () => {
      const A = mat([
        [2, 1],
        [2, 3],
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
        [-3, 9, 7],
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

    test('rejects a value that is not an eigenvalue', () => {
      const A = mat([
        [-1, 2, 2],
        [-1, -4, -2],
        [-3, 9, 7],
      ]);
      const notAnEValue = 5;
      expect(() => getEigenvectorForEigenvalue(A, notAnEValue)).toThrow();
    });
  });
});
