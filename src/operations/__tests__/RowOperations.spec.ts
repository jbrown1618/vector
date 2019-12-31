import { mat } from '../../utilities/aliases';
import { RowOperations } from '../RowOperations';

describe('RowOperations', () => {
  const original = mat([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]);

  describe('multiplyRowByScalar', () => {
    test('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.multiplyRowByScalar(original, 1, 2);
      expect(transformed.toArray()).toStrictEqual([
        [1, 2, 3],
        [8, 10, 12],
        [7, 8, 9]
      ]);
    });
  });

  describe('addRowToRow', () => {
    test('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.addRowToRow(original, 0, 1);
      expect(transformed.toArray()).toStrictEqual([
        [5, 7, 9],
        [4, 5, 6],
        [7, 8, 9]
      ]);
    });
  });

  describe('addScalarMultipleOfRowToRow', () => {
    test('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.addScalarMultipleOfRowToRow(original, 1, 2, 3);
      expect(transformed.toArray()).toStrictEqual([
        [1, 2, 3],
        [25, 29, 33],
        [7, 8, 9]
      ]);
    });
  });

  describe('exchangeRows', () => {
    test('returns a new matrix with the correct transformation applied', () => {
      const transformed = RowOperations.exchangeRows(original, 0, 2);
      expect(transformed.toArray()).toStrictEqual([
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3]
      ]);
    });
  });

  describe('pivot', () => {
    test('sorts a matrix by the number of leading zeros', () => {
      const unsorted = mat([
        [0, 5, 5],
        [5, 5, 5],
        [0, 0, 5]
      ]);
      const sorted = mat([
        [5, 5, 5],
        [0, 5, 5],
        [0, 0, 5]
      ]);
      const permutation = mat([
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1]
      ]);

      const result = RowOperations.pivot(unsorted);
      expect(result.result).toStrictEqual(sorted);
      expect(result.operator).toStrictEqual(permutation);
    });
  });
});
