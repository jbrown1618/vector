import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberVector } from '../vector/NumberVector';
import { VectorBuilder } from '../vector/VectorBuilder';
import { MatrixBuilder, MatrixIndexFunction } from './MatrixBuilder';
import { NumberMatrix } from './NumberMatrix';

describe('MatrixBuilder', () => {
  const matrixBuilder = new MatrixBuilder(NumberMatrix);
  const vectorBuilder = new VectorBuilder(NumberVector);

  describe('fromData', () => {
    it('builds a matrix from a 2D array of values', () => {
      const data = [[1, 2, 3], [4, 5, 6]];
      expect(matrixBuilder.fromData(data).getData()).to.deep.equal(data);
    });

    it('handles an empty array', () => {
      expect(matrixBuilder.fromData([]).getData()).to.deep.equal([]);
    });

    it('handles an array of empty arrays', () => {
      expect(matrixBuilder.fromData([[], [], []]).getData()).to.deep.equal([]);
    });
  });

  describe('fromColumnVectors', () => {
    it('builds a matrix from column vectors', () => {
      const first = vectorBuilder.fromValues(1, 2, 3);
      const second = vectorBuilder.fromValues(4, 5, 6);
      const expected = matrixBuilder.fromData([[1, 4], [2, 5], [3, 6]]);

      expect(matrixBuilder.fromColumnVectors([first, second])).to.deep.equal(expected);
    });

    it('handles an empty array', () => {
      expect(matrixBuilder.fromColumnVectors([]).getData()).to.deep.equal([]);
    });
  });

  describe('fromRowVectors', () => {
    it('builds a matrix from row vectors', () => {
      const first = vectorBuilder.fromValues(1, 2, 3);
      const second = vectorBuilder.fromValues(4, 5, 6);
      const expected = matrixBuilder.fromData([[1, 2, 3], [4, 5, 6]]);

      expect(matrixBuilder.fromRowVectors([first, second])).to.deep.equal(expected);
    });

    it('handles an empty array', () => {
      expect(matrixBuilder.fromRowVectors([]).getData()).to.deep.equal([]);
    });
  });

  describe('fromIndexFunction', () => {
    it('builds a matrix whose entries are determined by a function of their indices', () => {
      const fn: MatrixIndexFunction<number> = (i, j) => i + j;
      const expected = [[0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
      const result = matrixBuilder.fromIndexFunction(4, 4, fn);
      expect(result.getData()).to.deep.equal(expected);
    });

    it('handles size 0', () => {
      const fn = () => 1;
      expect(matrixBuilder.fromIndexFunction(0, 0, fn).getData()).to.deep.equal([]);
      expect(matrixBuilder.fromIndexFunction(1, 0, fn).getData()).to.deep.equal([]);
      expect(matrixBuilder.fromIndexFunction(0, 1, fn).getData()).to.deep.equal([]);
    });

    it('rejects invalid sizes', () => {
      const fn = () => 1;
      expect(() => matrixBuilder.fromIndexFunction(-1, -1, fn)).to.throw();
      expect(() => matrixBuilder.fromIndexFunction(-1, 1, fn)).to.throw();
      expect(() => matrixBuilder.fromIndexFunction(1, -1, fn)).to.throw();
    });
  });

  describe('map', () => {
    it('builds a matrix by transforming the values of another matrix', () => {
      const original = matrixBuilder.fromData([[1, 2, 3], [4, 5, 6]]);

      const mapped = matrixBuilder.map(original, (entry, i, j) => entry + i - j);

      const expected = matrixBuilder.fromData([[1, 1, 1], [5, 5, 5]]);

      expect(mapped).to.deep.equal(expected);
    });

    it('handles an empty matrix', () => {
      expect(matrixBuilder.map(matrixBuilder.empty(), () => 1)).to.deep.equal(
        matrixBuilder.empty()
      );
    });
  });

  describe('empty', () => {
    it('returns an empty vector', () => {
      const E = matrixBuilder.empty();
      expect(E.getNumberOfRows()).to.equal(0);
      expect(E.getNumberOfColumns()).to.equal(0);
      expect(E.getData()).to.deep.equal([]);
    });
  });

  describe('fill', () => {
    it('builds a square matrix of all the same value', () => {
      const values = [-1, 0, 1, 2];
      const sizes = [0, 1, 2, 3];

      sizes.forEach(size => {
        values.forEach(value => {
          const filled = matrixBuilder.fill(value, size);
          expect(filled.getNumberOfRows()).to.equal(size);
          expect(filled.getNumberOfColumns()).to.equal(size);
          filled.forEachEntry(entry => {
            expect(entry).to.equal(value);
          });
        });
      });
    });

    it('builds a rectangular matrix of all the same value', () => {
      const values = [-1, 0, 1, 2];
      const sizes = [1, 2, 3];

      sizes.forEach(m => {
        sizes.forEach(n => {
          values.forEach(value => {
            const filled = matrixBuilder.fill(value, m, n);
            expect(filled.getNumberOfRows()).to.equal(m);
            expect(filled.getNumberOfColumns()).to.equal(n);
            filled.forEachEntry(entry => {
              expect(entry).to.equal(value);
            });
          });
        });
      });
    });

    it('rejects invalid sizes', () => {
      expect(() => matrixBuilder.fill(2, -1, -1)).to.throw();
      expect(() => matrixBuilder.fill(2, -1, 1)).to.throw();
      expect(() => matrixBuilder.fill(2, 1, -1)).to.throw();
    });
  });

  describe('zeros', () => {
    it('builds a square matrix of zeros', () => {
      for (let n = 0; n < 10; n++) {
        const zeros = matrixBuilder.zeros(n);
        expect(zeros.getNumberOfRows()).to.equal(n);
        expect(zeros.getNumberOfColumns()).to.equal(n);

        zeros.forEachEntry((entry: number) => {
          expect(entry).to.equal(0);
        });
      }
    });

    it('builds a rectangular matrix of zeros', () => {
      for (let r = 1; r < 5; r++) {
        for (let c = 1; c < 5; c++) {
          const zeros = matrixBuilder.zeros(r, c);
          expect(zeros.getNumberOfRows()).to.equal(r);
          expect(zeros.getNumberOfColumns()).to.equal(c);

          zeros.forEachEntry((entry: number) => {
            expect(entry).to.equal(0);
          });
        }
      }
    });
  });

  describe('ones', () => {
    it('builds a square matrix of ones', () => {
      for (let n = 0; n < 10; n++) {
        const ones = matrixBuilder.ones(n);
        expect(ones.getNumberOfRows()).to.equal(n);
        expect(ones.getNumberOfColumns()).to.equal(n);

        ones.forEachEntry((entry: number) => {
          expect(entry).to.equal(1);
        });
      }
    });

    it('builds a rectangular matrix of ones', () => {
      for (let r = 1; r < 5; r++) {
        for (let c = 1; c < 5; c++) {
          const ones = matrixBuilder.ones(r, c);
          expect(ones.getNumberOfRows()).to.equal(r);
          expect(ones.getNumberOfColumns()).to.equal(c);

          ones.forEachEntry((entry: number) => {
            expect(entry).to.equal(1);
          });
        }
      }
    });
  });

  describe('identity', () => {
    it('constructs an identity matrix', () => {
      for (let n = 0; n < 10; n++) {
        const I = matrixBuilder.identity(n);
        expect(I.getNumberOfColumns()).to.equal(n);
        expect(I.getNumberOfRows()).to.equal(n);

        I.forEachEntry((entry: number, i: number, j: number) => {
          expect(entry).to.equal(i === j ? 1 : 0);
        });
      }
    });
  });

  describe('random', () => {
    it('constructs a matrix of random numbers between min and max', () => {
      const bounds = [-1, 0, 1, 2];

      bounds.forEach(min => {
        bounds.forEach(max => {
          if (max > min) {
            const randomMatrix = matrixBuilder.random(10, 10, min, max);
            randomMatrix.forEachEntry(value => {
              expect(value).to.be.greaterThan(min);
              expect(value).to.be.lessThan(max);
            });
          }
        });
      });
    });

    it('defaults to min = 0 and max = 1', () => {
      const randomMatrix = matrixBuilder.random(10, 10);
      randomMatrix.forEachEntry(value => {
        expect(value).to.be.greaterThan(0);
        expect(value).to.be.lessThan(1);
      });
    });

    it('throws an error when min > max', () => {
      expect(() => matrixBuilder.random(5, 5, 1, 0)).to.throw();
    });
  });

  describe('randomNormal', () => {
    // Technically this test is non-deterministic and will fail in about 0.006% of cases
    // Ideally we would seed the RNG, but there doesn't seem to be a good way to do that

    it('constructs a matrix of numbers randomly drawn from a normal distribution', () => {
      const means = [-1, 0, 1];
      const standardDeviations = [1, 2, 10];
      means.forEach(mean => {
        standardDeviations.forEach(standardDeviation => {
          const randomVector = matrixBuilder.randomNormal(10, 10, mean, standardDeviation);
          const average =
            randomVector
              .getData()
              .reduce((accum, next) => [...accum, ...next])
              .reduce((accum, next) => accum + next, 0) / 100;

          const fourSamplingSDFromMean = (4 * standardDeviation) / 10;
          expect(Math.abs(average - mean)).to.be.lessThan(fourSamplingSDFromMean);
        });
      });
    });

    it('defaults to mean=0 and sd=1', () => {
      const randomVector = matrixBuilder.randomNormal(10, 10);
      const average =
        randomVector
          .getData()
          .reduce((accum, next) => [...accum, ...next])
          .reduce((accum, next) => accum + next, 0) / 100;

      const fourSamplingSDFromMean = 0.4;
      expect(Math.abs(average)).to.be.lessThan(fourSamplingSDFromMean);
    });

    it('rejects a negative standard deviation', () => {
      expect(() => matrixBuilder.randomNormal(1, 1, 0, -1)).to.throw();
    });
  });

  describe('diagonal', () => {
    it('constructs a diagonal matrix with the given diagonal entries', () => {
      const diagonalEntries = vectorBuilder.fromData([1, 2, 3]);
      const expected = matrixBuilder.fromData([[1, 0, 0], [0, 2, 0], [0, 0, 3]]);

      expect(matrixBuilder.diagonal(diagonalEntries).equals(expected)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const diagonalEntries = vectorBuilder.empty();
      const expected = matrixBuilder.empty();
      expect(matrixBuilder.diagonal(diagonalEntries).equals(expected)).to.be.true;
    });
  });

  describe('tridiagonal', () => {
    it('constructs a tridiagonal matrix based on the primary diagonal and two off-diagonals', () => {
      const expected = matrixBuilder.fromData([
        [2, 3, 0, 0, 0],
        [1, 2, 3, 0, 0],
        [0, 1, 2, 3, 0],
        [0, 0, 1, 2, 3],
        [0, 0, 0, 1, 2]
      ]);

      const left = vectorBuilder.fill(1, 4);
      const center = vectorBuilder.fill(2, 5);
      const right = vectorBuilder.fill(3, 4);

      const tridiagonal = matrixBuilder.tridiagonal(left, center, right);
      expect(tridiagonal).to.deep.equal(expected);
    });

    it('rejects a dimension mismatch', () => {
      let left = vectorBuilder.fill(1, 5);
      let center = vectorBuilder.fill(2, 5);
      let right = vectorBuilder.fill(3, 4);
      expect(() => matrixBuilder.tridiagonal(left, center, right)).to.throw();

      left = vectorBuilder.fill(1, 4);
      center = vectorBuilder.fill(2, 5);
      right = vectorBuilder.fill(3, 5);
      expect(() => matrixBuilder.tridiagonal(left, center, right)).to.throw();

      left = vectorBuilder.fill(1, 5);
      center = vectorBuilder.fill(2, 5);
      right = vectorBuilder.fill(3, 5);
      expect(() => matrixBuilder.tridiagonal(left, center, right)).to.throw();
    });
  });

  describe('blockDiagonal', () => {
    it('constructs a block matrix with the provided matrices along the diagonal', () => {
      const ones = matrixBuilder.ones(2);
      const twos = matrixBuilder.fill(2, 3);
      const blockDiagonal = matrixBuilder.blockDiagonal([ones, twos, ones]);
      const expected = matrixBuilder.fromData([
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 1]
      ]);

      expect(blockDiagonal).to.deep.equal(expected);
    });

    it('rejects an array with any non-square matrices', () => {
      const ones = matrixBuilder.ones(2);
      const twos = matrixBuilder.fill(2, 3, 2);
      expect(() => matrixBuilder.blockDiagonal([ones, twos, ones])).to.throw();
    });

    it('handles an empty array', () => {
      expect(matrixBuilder.blockDiagonal([])).to.deep.equal(matrixBuilder.empty());
    });
  });

  describe('augment', () => {
    it('horizontally concatenates two matrices', () => {
      const first = matrixBuilder.identity(2);
      const second = matrixBuilder.ones(2);
      const expected = matrixBuilder.fromData([[1, 0, 1, 1], [0, 1, 1, 1]]);

      expect(matrixBuilder.augment(first, second).equals(expected)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const empty = matrixBuilder.empty();
      expect(matrixBuilder.augment(empty, empty).equals(empty)).to.be.true;
    });

    it('throws an error when the input dimensions are not compatible', () => {
      const first = matrixBuilder.identity(2);
      const second = matrixBuilder.ones(3);
      expect(() => matrixBuilder.augment(first, second)).to.throw();
    });
  });

  describe('flatten', () => {
    it('flattens a grid of matrices into a single matrix', () => {
      const A = matrixBuilder.identity(2);
      const B = matrixBuilder.ones(2);
      const C = matrixBuilder.zeros(2);
      const D = matrixBuilder.diagonal(vectorBuilder.fromValues(2, 4));

      const grid = [[A, B], [C, D]];

      const expected = matrixBuilder.fromData([
        [1, 0, 1, 1],
        [0, 1, 1, 1],
        [0, 0, 2, 0],
        [0, 0, 0, 4]
      ]);

      expect(matrixBuilder.flatten(grid).equals(expected)).to.be.true;
    });

    it('handles mismatched dimensions', () => {
      const A = matrixBuilder.ones(1);
      const B = matrixBuilder.zeros(1, 3);
      const C = matrixBuilder.zeros(4, 1);
      const D = matrixBuilder.ones(4, 3);

      const grid = [[A, B], [C, D]];

      const expected = matrixBuilder.fromData([
        [1, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1]
      ]);

      expect(matrixBuilder.flatten(grid).equals(expected)).to.be.true;
    });
  });

  describe('repeat', () => {
    it('constructs a matrix by repeating a smaller matrix', () => {
      const A = matrixBuilder.fromData([[1, 2], [3, 4]]);

      const expected = matrixBuilder.fromData([
        [1, 2, 1, 2, 1, 2],
        [3, 4, 3, 4, 3, 4],
        [1, 2, 1, 2, 1, 2],
        [3, 4, 3, 4, 3, 4]
      ]);

      expect(matrixBuilder.repeat(A, 2, 3).equals(expected)).to.be.true;
    });
  });

  describe('slice', () => {
    const A = matrixBuilder.fromData([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);

    it('includes the start indices but excludes the end indices', () => {
      let expectedSlice = matrixBuilder.fromData([[1, 2], [5, 6]]);
      expect(matrixBuilder.slice(A, 0, 0, 2, 2).equals(expectedSlice)).to.be.true;

      expectedSlice = matrixBuilder.fromData([[1, 2, 3]]);
      expect(matrixBuilder.slice(A, 0, 0, 1, 3).equals(expectedSlice)).to.be.true;

      expectedSlice = matrixBuilder.fromData([[1], [5], [9]]);
      expect(matrixBuilder.slice(A, 0, 0, 3, 1).equals(expectedSlice)).to.be.true;
    });

    it('defaults to the entire matrix when no indices are given', () => {
      expect(matrixBuilder.slice(A).equals(A)).to.be.true;
    });

    it('defaults to the end of the matrix when no end indices are given', () => {
      const expectedSlice = matrixBuilder.fromData([[6, 7, 8], [10, 11, 12]]);
      expect(matrixBuilder.slice(A, 1, 1).equals(expectedSlice)).to.be.true;
    });

    it('returns an empty matrix when a start index matches the end index', () => {
      expect(matrixBuilder.slice(A, 1, 1, 1, 2).equals(matrixBuilder.empty())).to.be.true;
      expect(matrixBuilder.slice(A, 1, 1, 2, 1).equals(matrixBuilder.empty())).to.be.true;
    });
  });

  describe('exclude', () => {
    it('removes a row and column from the original matrix', () => {
      const original = matrixBuilder.fromData([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

      const expected = matrixBuilder.fromData([[1, 2], [7, 8]]);

      const removedRow1Col2 = matrixBuilder.exclude(original, 1, 2);

      expect(removedRow1Col2).to.deep.equal(expected);
    });

    it('rejects invalid indices', () => {
      const original = matrixBuilder.fromData([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

      expect(() => matrixBuilder.exclude(original, -1, 1)).to.throw();
      expect(() => matrixBuilder.exclude(original, 1, -1)).to.throw();
      expect(() => matrixBuilder.exclude(original, 3, 1)).to.throw();
      expect(() => matrixBuilder.exclude(original, 1, 3)).to.throw();
    });
  });
});
