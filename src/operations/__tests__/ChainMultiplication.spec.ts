import { chainProduct } from '../ChainMultiplication';
import { Matrix } from '../../types/matrix/Matrix';
import { FloatMatrix } from '../../types/matrix/FloatMatrix';
import { ones } from '../../utilities/aliases';

describe('ChainMultiplication', () => {
  describe('chainProduct', () => {
    test('multiplies a sequence of matrices', () => {
      const dimensionSequence = [30, 35, 15, 5, 10, 20, 25];
      const matrices: Matrix[] = [];

      for (let i = 0; i < dimensionSequence.length - 1; i++) {
        matrices.push(ones([dimensionSequence[i], dimensionSequence[i + 1]]));
      }

      const expected = FloatMatrix.builder().fill(525000, [30, 25]);

      const result = chainProduct(...matrices);

      expect(result).toStrictEqual(expected);
    });

    test('handles trivial cases', () => {
      const A = ones([5, 3]);
      const B = ones([3, 2]);
      expect(chainProduct(A)).toStrictEqual(A);
      expect(chainProduct(A, B)).toStrictEqual(A.multiply(B));
    });

    test('throws when given no arguments', () => {
      expect(() => chainProduct()).toThrow();
    });
  });
});
