import { vec, zeros, diag, ones, eye } from '../../../utilities/aliases';
import { ComplexNumber } from '../../scalar/ComplexNumber';
import { ComplexMatrix } from '../ComplexMatrix';
import { MatrixBuilder } from '../MatrixBuilder';
import { FloatMatrix } from '../FloatMatrix';

describe('MatrixBuilder', () => {
  const matrixBuilder = new MatrixBuilder(FloatMatrix);

  describe('fromArray', () => {
    test('builds a matrix from a 2D array of values', () => {
      const data = [
        [1, 2, 3],
        [4, 5, 6]
      ];
      expect(matrixBuilder.fromArray(data).toArray()).toStrictEqual(data);
    });

    test('handles an empty array', () => {
      expect(matrixBuilder.fromArray([]).toArray()).toStrictEqual([]);
    });

    test('handles an array of empty arrays', () => {
      expect(matrixBuilder.fromArray([[], [], []]).toArray()).toStrictEqual([]);
    });
  });

  describe('fromNumberArray', () => {
    test('behaves exactly like fromArray for a NumberMatrix', () => {
      const data = [
        [1, 2, 3],
        [4, 5, 6]
      ];
      expect(matrixBuilder.fromNumberArray(data).toArray()).toStrictEqual(data);
    });

    test('builds a complex matrix from number data', () => {
      const complexMatrixBuilder = ComplexMatrix.builder();
      const data = [
        [1, 2, 3],
        [4, 5, 6]
      ];
      const expected = complexMatrixBuilder.fromArray([
        [new ComplexNumber(1, 0), new ComplexNumber(2, 0), new ComplexNumber(3, 0)],
        [new ComplexNumber(4, 0), new ComplexNumber(5, 0), new ComplexNumber(6, 0)]
      ]);

      expect(complexMatrixBuilder.fromNumberArray(data)).toStrictEqual(expected);
    });

    test('handles an empty array', () => {
      expect(matrixBuilder.fromArray([]).toArray()).toStrictEqual([]);
    });

    test('handles an array of empty arrays', () => {
      expect(matrixBuilder.fromArray([[], [], []]).toArray()).toStrictEqual([]);
    });
  });

  describe('fromColumnVectors', () => {
    test('builds a matrix from column vectors', () => {
      const first = vec([1, 2, 3]);
      const second = vec([4, 5, 6]);
      const expected = matrixBuilder.fromArray([
        [1, 4],
        [2, 5],
        [3, 6]
      ]);

      expect(matrixBuilder.fromColumnVectors([first, second])).toStrictEqual(expected);
    });

    test('handles an empty array', () => {
      expect(matrixBuilder.fromColumnVectors([]).toArray()).toStrictEqual([]);
      expect(matrixBuilder.fromColumnVectors([vec([])]).toArray()).toStrictEqual([]);
    });
  });

  describe('fromRowVectors', () => {
    test('builds a matrix from row vectors', () => {
      const first = vec([1, 2, 3]);
      const second = vec([4, 5, 6]);
      const expected = matrixBuilder.fromArray([
        [1, 2, 3],
        [4, 5, 6]
      ]);

      expect(matrixBuilder.fromRowVectors([first, second])).toStrictEqual(expected);
    });

    test('handles an empty array', () => {
      expect(matrixBuilder.fromRowVectors([]).toArray()).toStrictEqual([]);
      expect(matrixBuilder.fromRowVectors([vec([])]).toArray()).toStrictEqual([]);
    });
  });

  describe('fromIndexFunction', () => {
    test('builds a matrix whose entries are determined by a function of their indices', () => {
      const fn = (i: number, j: number) => i + j;
      const expected = [
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
      ];
      const result = matrixBuilder.fromIndexFunction([4, 4], fn);
      expect(result.toArray()).toStrictEqual(expected);
    });

    test('handles size 0', () => {
      const fn = () => 1;
      expect(matrixBuilder.fromIndexFunction([0, 0], fn).toArray()).toStrictEqual([]);
    });

    test('rejects invalid sizes', () => {
      const fn = () => 1;
      expect(() => matrixBuilder.fromIndexFunction([-1, -1], fn)).toThrow();
      expect(() => matrixBuilder.fromIndexFunction([-1, 1], fn)).toThrow();
      expect(() => matrixBuilder.fromIndexFunction([1, -1], fn)).toThrow();
      expect(() => matrixBuilder.fromIndexFunction([1, 0], fn)).toThrow();
      expect(() => matrixBuilder.fromIndexFunction([0, 1], fn)).toThrow();
    });
  });

  describe('empty', () => {
    test('returns an empty vector', () => {
      const E = matrixBuilder.empty();
      expect(E.getNumberOfRows()).toEqual(0);
      expect(E.getNumberOfColumns()).toEqual(0);
      expect(E.toArray()).toStrictEqual([]);
    });
  });

  describe('fill', () => {
    test('builds a square matrix of all the same value', () => {
      const values = [-1, 0, 1, 2];
      const sizes = [0, 1, 2, 3];

      sizes.forEach(size => {
        values.forEach(value => {
          const filled = matrixBuilder.fill(value, [size, size]);
          expect(filled.getNumberOfRows()).toEqual(size);
          expect(filled.getNumberOfColumns()).toEqual(size);
          filled.forEach(entry => {
            expect(entry).toEqual(value);
          });
        });
      });
    });

    test('builds a rectangular matrix of all the same value', () => {
      const values = [-1, 0, 1, 2];
      const sizes = [1, 2, 3];

      sizes.forEach(m => {
        sizes.forEach(n => {
          values.forEach(value => {
            const filled = matrixBuilder.fill(value, [m, n]);
            expect(filled.getNumberOfRows()).toEqual(m);
            expect(filled.getNumberOfColumns()).toEqual(n);
            filled.forEach(entry => {
              expect(entry).toEqual(value);
            });
          });
        });
      });
    });

    test('rejects invalid sizes', () => {
      expect(() => matrixBuilder.fill(2, [-1, -1])).toThrow();
      expect(() => matrixBuilder.fill(2, [-1, 1])).toThrow();
      expect(() => matrixBuilder.fill(2, [1, -1])).toThrow();
    });
  });

  describe('zeros', () => {
    test('builds a square matrix of zeros', () => {
      for (let n = 0; n < 10; n++) {
        const zero = zeros([n, n]);
        expect(zero.getNumberOfRows()).toEqual(n);
        expect(zero.getNumberOfColumns()).toEqual(n);

        zero.forEach((entry: number) => {
          expect(entry).toEqual(0);
        });
      }
    });

    test('builds a rectangular matrix of zeros', () => {
      for (let r = 1; r < 5; r++) {
        for (let c = 1; c < 5; c++) {
          const zero = zeros([r, c]);
          expect(zero.getNumberOfRows()).toEqual(r);
          expect(zero.getNumberOfColumns()).toEqual(c);

          zero.forEach((entry: number) => {
            expect(entry).toEqual(0);
          });
        }
      }
    });
  });

  describe('ones', () => {
    test('builds a square matrix of ones', () => {
      for (let n = 0; n < 10; n++) {
        const ones = matrixBuilder.ones([n, n]);
        expect(ones.getNumberOfRows()).toEqual(n);
        expect(ones.getNumberOfColumns()).toEqual(n);

        ones.forEach((entry: number) => {
          expect(entry).toEqual(1);
        });
      }
    });

    test('builds a rectangular matrix of ones', () => {
      for (let r = 1; r < 5; r++) {
        for (let c = 1; c < 5; c++) {
          const ones = matrixBuilder.ones([r, c]);
          expect(ones.getNumberOfRows()).toEqual(r);
          expect(ones.getNumberOfColumns()).toEqual(c);

          ones.forEach((entry: number) => {
            expect(entry).toEqual(1);
          });
        }
      }
    });
  });

  describe('identity', () => {
    test('constructs an identity matrix', () => {
      for (let n = 0; n < 10; n++) {
        const I = matrixBuilder.identity(n);
        expect(I.getNumberOfColumns()).toEqual(n);
        expect(I.getNumberOfRows()).toEqual(n);

        I.forEach((entry: number, i: number, j: number) => {
          expect(entry).toEqual(i === j ? 1 : 0);
        });
      }
    });
  });

  describe('hilbert', () => {
    test('constructs a Hilbert matrix', () => {
      const hilbert = matrixBuilder.hilbert(3);
      const expected = matrixBuilder.fromArray([
        [1, 1 / 2, 1 / 3],
        [1 / 2, 1 / 3, 1 / 4],
        [1 / 3, 1 / 4, 1 / 5]
      ]);
      expect(hilbert).toStrictEqual(expected);
    });

    test('handles size 0', () => {
      expect(matrixBuilder.hilbert(0)).toStrictEqual(matrixBuilder.empty());
    });

    test('rejects a negative size', () => {
      expect(() => matrixBuilder.hilbert(-1)).toThrow();
    });
  });

  describe('toeplitz', () => {
    test('constructs a Toeplitz matrix with the default first row', () => {
      const toeplitz = matrixBuilder.toeplitz(vec([1, 2, 3]));
      const expected = matrixBuilder.fromArray([
        [1, 2, 3],
        [2, 1, 2],
        [3, 2, 1]
      ]);
      expect(toeplitz).toStrictEqual(expected);
    });

    test('constructs a Toeplitz matrix with a specified first row', () => {
      const toeplitz = matrixBuilder.toeplitz(vec([1, 2, 3]), vec([1, 3, 5, 7]));
      const expected = matrixBuilder.fromArray([
        [1, 3, 5, 7],
        [2, 1, 3, 5],
        [3, 2, 1, 3]
      ]);
      expect(toeplitz).toStrictEqual(expected);
    });

    test('handles an empty first column', () => {
      const toeplitz = matrixBuilder.toeplitz(vec([]));
      expect(toeplitz).toStrictEqual(matrixBuilder.empty());
    });

    test('rejects an entry mismatch', () => {
      expect(() => matrixBuilder.toeplitz(vec([1, 2]), vec([2, 1]))).toThrow();
    });
  });

  describe('hankel', () => {
    test('constructs a Hankel matrix with the default last row', () => {
      const hankel = matrixBuilder.hankel(vec([2, 4, 6, 8]));
      const expected = matrixBuilder.fromArray([
        [2, 4, 6, 8],
        [4, 6, 8, 0],
        [6, 8, 0, 0],
        [8, 0, 0, 0]
      ]);
      expect(hankel).toStrictEqual(expected);
    });

    test('constructs a "narrow" Hankel matrix with a specified last row', () => {
      const hankel = matrixBuilder.hankel(vec([1, 2, 3, 4]), vec([4, 9, 9]));
      const expected = matrixBuilder.fromArray([
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 9],
        [4, 9, 9]
      ]);
      expect(hankel).toStrictEqual(expected);
    });

    test('constructs a "wide" Hankel matrix with a specified last row', () => {
      const hankel = matrixBuilder.hankel(vec([1, 2, 3]), vec([3, 9, 9, 9]));
      const expected = matrixBuilder.fromArray([
        [1, 2, 3, 9],
        [2, 3, 9, 9],
        [3, 9, 9, 9]
      ]);
      expect(hankel).toStrictEqual(expected);
    });

    test('handles an empty first column', () => {
      const hankel = matrixBuilder.hankel(vec([]));
      expect(hankel).toStrictEqual(matrixBuilder.empty());
    });

    test('rejects an empty last row', () => {
      expect(() => matrixBuilder.hankel(vec([1, 1, 1, 1]), vec([]))).toThrow();
    });

    test('rejects an entry mismatch', () => {
      expect(() => matrixBuilder.hankel(vec([1, 2]), vec([1, 2]))).toThrow();
    });
  });

  describe('pascal', () => {
    test('constructs a lower-triangular pascal matrix', () => {
      const lower = matrixBuilder.pascal(5);
      const expected = matrixBuilder.fromArray([
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 2, 1, 0, 0],
        [1, 3, 3, 1, 0],
        [1, 4, 6, 4, 1]
      ]);
      expect(lower).toStrictEqual(expected);
    });

    test('constructs a upper-triangular pascal matrix', () => {
      const upper = matrixBuilder.pascal(5, true);
      const expected = matrixBuilder.fromArray([
        [1, 1, 1, 1, 1],
        [0, 1, 2, 3, 4],
        [0, 0, 1, 3, 6],
        [0, 0, 0, 1, 4],
        [0, 0, 0, 0, 1]
      ]);
      expect(upper).toStrictEqual(expected);
    });

    test('rejects a negative size', () => {
      expect(() => matrixBuilder.pascal(-1)).toThrow();
    });
  });

  describe('pascalSymmetric', () => {
    test('constructs a symmetric pascal matrix', () => {
      const pascal = matrixBuilder.pascalSymmetric(5);
      const expected = matrixBuilder.fromArray([
        [1, 1, 1, 1, 1],
        [1, 2, 3, 4, 5],
        [1, 3, 6, 10, 15],
        [1, 4, 10, 20, 35],
        [1, 5, 15, 35, 70]
      ]);
      expect(pascal).toStrictEqual(expected);
    });

    test('rejects a negative size', () => {
      expect(() => matrixBuilder.pascalSymmetric(-1)).toThrow();
    });
  });

  describe('circulant', () => {
    test('constructs a circulant matrix', () => {
      const entries = vec([1, 2, 3]);
      const circulant = matrixBuilder.circulant(entries);
      const expected = matrixBuilder.fromArray([
        [1, 3, 2],
        [2, 1, 3],
        [3, 2, 1]
      ]);
      expect(circulant).toStrictEqual(expected);
    });

    test('handles an empty vector', () => {
      expect(matrixBuilder.circulant(vec([]))).toStrictEqual(matrixBuilder.empty());
    });
  });

  describe('random', () => {
    test('constructs a matrix of random numbers between min and max', () => {
      const bounds = [-1, 0, 1, 2];

      bounds.forEach(min => {
        bounds.forEach(max => {
          if (max > min) {
            const randomMatrix = matrixBuilder.random([10, 10], min, max);
            randomMatrix.forEach(value => {
              expect(value).toBeGreaterThan(min);
              expect(value).toBeLessThan(max);
            });
          }
        });
      });
    });

    test('defaults to a square matrix', () => {
      const R = matrixBuilder.random([5, 5]);
      expect(R.getNumberOfRows()).toBe(5);
      expect(R.getNumberOfColumns()).toBe(5);
    });

    test('defaults to min = 0 and max = 1', () => {
      const randomMatrix = matrixBuilder.random([10, 10]);
      randomMatrix.forEach(value => {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThan(1);
      });
    });

    test('throws an error when min > max', () => {
      expect(() => matrixBuilder.random([5, 5], 1, 0)).toThrow();
    });
  });

  describe('randomNormal', () => {
    // Technically this test is non-deterministic and will fail in about 0.006% of cases
    // Ideally we would seed the RNG, but there doesn't seem to be a good way to do that

    test('constructs a matrix of numbers randomly drawn from a normal distribution', () => {
      const means = [-1, 0, 1];
      const standardDeviations = [1, 2, 10];
      means.forEach(mean => {
        standardDeviations.forEach(standardDeviation => {
          const randomVector = matrixBuilder.randomNormal([10, 10], mean, standardDeviation);
          const average =
            randomVector
              .toArray()
              .reduce((accum, next) => [...accum, ...next])
              .reduce((accum, next) => accum + next, 0) / 100;

          const fourSamplingSDFromMean = (4 * standardDeviation) / 10;
          expect(Math.abs(average - mean)).toBeLessThan(fourSamplingSDFromMean);
        });
      });
    });

    test('defaults to a square matrix', () => {
      const R = matrixBuilder.randomNormal([5, 5]);
      expect(R.getNumberOfRows()).toBe(5);
      expect(R.getNumberOfColumns()).toBe(5);
    });

    test('defaults to mean=0 and sd=1', () => {
      const randomVector = matrixBuilder.randomNormal([10, 10]);
      const average =
        randomVector
          .toArray()
          .reduce((accum, next) => [...accum, ...next])
          .reduce((accum, next) => accum + next, 0) / 100;

      const fourSamplingSDFromMean = 0.4;
      expect(Math.abs(average)).toBeLessThan(fourSamplingSDFromMean);
    });

    test('rejects a negative standard deviation', () => {
      expect(() => matrixBuilder.randomNormal([1, 1], 0, -1)).toThrow();
    });
  });

  describe('diagonal', () => {
    test('constructs a diagonal matrix with the given diagonal entries', () => {
      const diagonalEntries = vec([1, 2, 3]);
      const expected = matrixBuilder.fromArray([
        [1, 0, 0],
        [0, 2, 0],
        [0, 0, 3]
      ]);

      expect(matrixBuilder.diagonal(diagonalEntries).equals(expected)).toBe(true);
    });

    test('handles the degenerate case', () => {
      const diagonalEntries = vec([]);
      const expected = matrixBuilder.empty();
      expect(matrixBuilder.diagonal(diagonalEntries).equals(expected)).toBe(true);
    });
  });

  describe('tridiagonal', () => {
    test('constructs a tridiagonal matrix based on the primary diagonal and two off-diagonals', () => {
      const expected = matrixBuilder.fromArray([
        [2, 3, 0, 0, 0],
        [1, 2, 3, 0, 0],
        [0, 1, 2, 3, 0],
        [0, 0, 1, 2, 3],
        [0, 0, 0, 1, 2]
      ]);

      const left = vec([1, 1, 1, 1]);
      const center = vec([2, 2, 2, 2, 2]);
      const right = vec([3, 3, 3, 3]);

      const tridiagonal = matrixBuilder.tridiagonal(left, center, right);
      expect(tridiagonal).toStrictEqual(expected);
    });

    test('rejects a dimension mismatch', () => {
      let left = vec([1, 1, 1, 1, 1]);
      let center = vec([2, 2, 2, 2, 2]);
      let right = vec([3, 3, 3, 3]);
      expect(() => matrixBuilder.tridiagonal(left, center, right)).toThrow();

      left = vec([1, 1, 1, 1]);
      center = vec([2, 2, 2, 2, 2]);
      right = vec([3, 3, 3, 3, 3]);
      expect(() => matrixBuilder.tridiagonal(left, center, right)).toThrow();

      left = vec([1, 1, 1, 1]);
      center = vec([2, 2, 2, 2]);
      right = vec([3, 3, 3, 3]);
      expect(() => matrixBuilder.tridiagonal(left, center, right)).toThrow();
    });
  });

  describe('blockDiagonal', () => {
    test('constructs a block matrix with the provided matrices along the diagonal', () => {
      const ones = matrixBuilder.ones([2, 2]);
      const twos = matrixBuilder.fill(2, [3, 3]);
      const blockDiagonal = matrixBuilder.blockDiagonal([ones, twos, ones]);
      const expected = matrixBuilder.fromArray([
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 1]
      ]);

      expect(blockDiagonal).toStrictEqual(expected);
    });

    test('rejects an array with any non-square matrices', () => {
      const ones = matrixBuilder.ones([2, 2]);
      const twos = matrixBuilder.fill(2, [3, 2]);
      expect(() => matrixBuilder.blockDiagonal([ones, twos, ones])).toThrow();
    });

    test('handles an empty array', () => {
      expect(matrixBuilder.blockDiagonal([])).toStrictEqual(matrixBuilder.empty());
    });
  });

  describe('augment', () => {
    test('horizontally concatenates two matrices', () => {
      const first = eye(2);
      const second = ones([2, 2]);
      const expected = matrixBuilder.fromArray([
        [1, 0, 1, 1],
        [0, 1, 1, 1]
      ]);

      expect(matrixBuilder.augment(first, second).equals(expected)).toBe(true);
    });

    test('handles the degenerate case', () => {
      const empty = matrixBuilder.empty();
      expect(matrixBuilder.augment(empty, empty).equals(empty)).toBe(true);
    });

    test('throws an error when the input dimensions are not compatible', () => {
      const first = eye(2);
      const second = ones([3, 3]);
      expect(() => matrixBuilder.augment(first, second)).toThrow();
    });
  });

  describe('block', () => {
    test('flattens a grid of matrices into a single matrix', () => {
      const A = eye(2);
      const B = ones([2, 2]);
      const C = zeros([2, 2]);
      const D = diag([2, 4]);

      const grid = [
        [A, B],
        [C, D]
      ];

      const expected = matrixBuilder.fromArray([
        [1, 0, 1, 1],
        [0, 1, 1, 1],
        [0, 0, 2, 0],
        [0, 0, 0, 4]
      ]);

      expect(matrixBuilder.block(grid).equals(expected)).toBe(true);
    });

    test('handles unequal dimensions', () => {
      const A = ones([1, 1]);
      const B = zeros([1, 3]);
      const C = zeros([4, 1]);
      const D = ones([4, 3]);

      const grid = [
        [A, B],
        [C, D]
      ];

      const expected = matrixBuilder.fromArray([
        [1, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1]
      ]);

      expect(matrixBuilder.block(grid).equals(expected)).toBe(true);
    });

    test('rejects mismatched dimensions', () => {
      const top = matrixBuilder.ones([1, 2]);
      const bottom = matrixBuilder.zeros([1, 3]);
      expect(() => matrixBuilder.block([[top], [bottom]])).toThrow();
    });
  });

  describe('repeat', () => {
    test('constructs a matrix by repeating a smaller matrix', () => {
      const A = matrixBuilder.fromArray([
        [1, 2],
        [3, 4]
      ]);

      const expected = matrixBuilder.fromArray([
        [1, 2, 1, 2, 1, 2],
        [3, 4, 3, 4, 3, 4],
        [1, 2, 1, 2, 1, 2],
        [3, 4, 3, 4, 3, 4]
      ]);

      expect(matrixBuilder.repeat(A, 2, 3).equals(expected)).toBe(true);
    });
  });

  describe('slice', () => {
    const A = matrixBuilder.fromArray([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12]
    ]);

    test('includes the start indices but excludes the end indices', () => {
      let expectedSlice = matrixBuilder.fromArray([
        [1, 2],
        [5, 6]
      ]);
      expect(matrixBuilder.slice(A, 0, 0, 2, 2)).toStrictEqual(expectedSlice);

      expectedSlice = matrixBuilder.fromArray([[1, 2, 3]]);
      expect(matrixBuilder.slice(A, 0, 0, 1, 3)).toStrictEqual(expectedSlice);

      expectedSlice = matrixBuilder.fromArray([[1], [5], [9]]);
      expect(matrixBuilder.slice(A, 0, 0, 3, 1)).toStrictEqual(expectedSlice);
    });

    test('defaults to the entire matrix when no indices are given', () => {
      expect(matrixBuilder.slice(A)).toStrictEqual(A);
    });

    test('defaults to the end of the matrix when no end indices are given', () => {
      const expectedSlice = matrixBuilder.fromArray([
        [6, 7, 8],
        [10, 11, 12]
      ]);
      expect(matrixBuilder.slice(A, 1, 1)).toStrictEqual(expectedSlice);
    });

    test('returns an empty matrix when a start index matches the end index', () => {
      expect(matrixBuilder.slice(A, 1, 1, 1, 2)).toStrictEqual(matrixBuilder.empty());
      expect(matrixBuilder.slice(A, 1, 1, 2, 1)).toStrictEqual(matrixBuilder.empty());
      expect(matrixBuilder.slice(A, 2, 2, 2, 2)).toStrictEqual(matrixBuilder.empty());
    });

    test('rejects invalid indices', () => {
      expect(() => matrixBuilder.slice(A, -1, 0, 0, 0)).toThrow();
      expect(() => matrixBuilder.slice(A, 0, -1, 0, 0)).toThrow();
      expect(() => matrixBuilder.slice(A, 0, 0, -1, 0)).toThrow();
      expect(() => matrixBuilder.slice(A, 0, 0, 0, -1)).toThrow();
      expect(() => matrixBuilder.slice(A, 4, 0, 0, 0)).toThrow();
      expect(() => matrixBuilder.slice(A, 0, 4, 0, 0)).toThrow();
      expect(() => matrixBuilder.slice(A, 0, 0, 5, 0)).toThrow();
      expect(() => matrixBuilder.slice(A, 0, 0, 0, 5)).toThrow();
      expect(() => matrixBuilder.slice(A, 0, 4, 0, 0)).toThrow();
      expect(() => matrixBuilder.slice(A, 2, 4, 3, 3)).toThrow();
      expect(() => matrixBuilder.slice(A, 4, 2, 3, 3)).toThrow();
    });
  });

  describe('exclude', () => {
    test('removes a row and column from the original matrix', () => {
      const original = matrixBuilder.fromArray([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
      ]);
      const expected = matrixBuilder.fromArray([
        [1, 3],
        [4, 6],
        [10, 12]
      ]);

      const removedRow1Col2 = matrixBuilder.exclude(original, 2, 1);

      expect(removedRow1Col2).toStrictEqual(expected);
    });

    test('rejects invalid indices', () => {
      const original = matrixBuilder.fromArray([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]);

      expect(() => matrixBuilder.exclude(original, -1, 1)).toThrow();
      expect(() => matrixBuilder.exclude(original, 1, -1)).toThrow();
      expect(() => matrixBuilder.exclude(original, 3, 1)).toThrow();
      expect(() => matrixBuilder.exclude(original, 1, 3)).toThrow();
    });
  });
});
