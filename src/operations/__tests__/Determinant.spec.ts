import { determinant } from '../Determinant';
import { mat } from '../../utilities/aliases';

describe('Determinant', () => {
  describe('determinant', () => {
    test('calculates the determinant of a 2x2 matrix', () => {
      const A = mat([
        [3, 4],
        [2, 1]
      ]);

      expect(determinant(A)).toEqual(-5);
    });

    test('calculates the determinant of a NxN matrix', () => {
      let A = mat([
        [1, 3, 2],
        [4, 1, 3],
        [2, 5, 2]
      ]);
      expect(determinant(A)).toEqual(17);

      A = mat([
        [3, 2, 0, 1],
        [4, 0, 1, 2],
        [3, 0, 2, 1],
        [9, 2, 3, 1]
      ]);
      expect(determinant(A)).toEqual(24);
    });

    test('throws an error for a non-square matrix', () => {
      expect(() => determinant(mat([[1, 1]]))).toThrow();
    });
  });
});
