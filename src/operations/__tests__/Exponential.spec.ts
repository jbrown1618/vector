import { mat, eye } from '../../utilities/aliases';
import { exp, pow } from '../Exponential';

describe('Exponential', () => {
  describe('exp', () => {
    test('calculates exp(I) to within the default tolerance', () => {
      const I = eye(10);
      // exp(I) is a matrix with e on the diagonal entries
      const expected = I.scalarMultiply(Math.E);
      const expI = exp(I);
      expect(expI.equals(expected)).toBe(true);
    });

    test('calculates the exponential of a matrix', () => {
      const A = mat([
        [1, 2],
        [3, 4]
      ]);
      const expA = exp(A);
      expect(expA).toMatchSnapshot();
    });

    test('calculates a more precise exponential', () => {
      const A = mat([
        [1, 2],
        [3, 4]
      ]);
      const expA = exp(A, 7);
      expect(expA).toMatchSnapshot();
    });

    test('handles the degenerate case', () => {
      const A = mat([]);
      expect(exp(A)).toStrictEqual(A);
    });
  });

  describe('pow', () => {
    test('calculates a matrix raised to an integral power', () => {
      const A = mat([
        [4, 7],
        [2, 6]
      ]);
      const aSquared = mat([
        [30, 70],
        [20, 50]
      ]);
      const aCubed = mat([
        [260, 630],
        [180, 440]
      ]);
      const I = eye(2);
      const aInv = mat([
        [0.6, -0.7],
        [-0.2, 0.4]
      ]);
      const aNegTwo = mat([
        [0.5, -0.7],
        [-0.2, 0.3]
      ]);

      expect(pow(A, 1)).toStrictEqual(A);
      expect(pow(A, 2)).toStrictEqual(aSquared);
      expect(pow(A, 3)).toStrictEqual(aCubed);
      expect(pow(A, 0)).toStrictEqual(I);
      expect(pow(A, -1).equals(aInv)).toBe(true);
      expect(pow(A, -2).equals(aNegTwo)).toBe(true);
    });

    test('throws an error for a negative power of a singular matrix', () => {
      const S = mat([
        [1, 1],
        [1, 1]
      ]);
      expect(() => pow(S, -3)).toThrow();
    });

    test('handles the degenerate case', () => {
      const A = mat([]);
      expect(pow(A, 2)).toStrictEqual(A);
      expect(pow(A, 3)).toStrictEqual(A);
      expect(pow(A, -1)).toStrictEqual(A);
    });
  });
});
