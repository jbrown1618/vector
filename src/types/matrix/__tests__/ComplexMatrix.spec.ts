import { ComplexNumber } from '../../scalar/ComplexNumber';
import { ComplexMatrix } from '../ComplexMatrix';

describe('ComplexMatrix', () => {
  describe('adjoint', () => {
    test('returns the conjugate transpose of the matrix', () => {
      const original = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(1, 2), new ComplexNumber(3, 4)],
        [new ComplexNumber(5, 6), new ComplexNumber(7, 8)]
      ]);
      const expected = ComplexMatrix.builder().fromArray([
        [new ComplexNumber(1, -2), new ComplexNumber(5, -6)],
        [new ComplexNumber(3, -4), new ComplexNumber(7, -8)]
      ]);
      expect(original.adjoint()).toStrictEqual(expected);
    });
  });
});
