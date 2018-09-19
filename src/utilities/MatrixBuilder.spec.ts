import { describe, it } from 'mocha';
import { expect } from 'chai';
import { MatrixBuilder, NumberVector, VectorBuilder } from '..';
import { NumberMatrix } from '..';

describe('MatrixBuilder', () => {
  const matrixBuilder = new MatrixBuilder(NumberMatrix);
  const vectorBuilder = new VectorBuilder(NumberVector);

  describe('empty', () => {
    it('returns an empty vector', () => {
      const E = matrixBuilder.empty();
      expect(E.getNumberOfRows()).to.equal(0);
      expect(E.getNumberOfColumns()).to.equal(0);
      expect(E.getData()).to.deep.equal([]);
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
      let expectedSlice = matrixBuilder.fromData([[6, 7, 8], [10, 11, 12]]);
      expect(matrixBuilder.slice(A, 1, 1).equals(expectedSlice)).to.be.true;
    });

    it('returns an empty matrix when a start index matches the end index', () => {
      expect(matrixBuilder.slice(A, 1, 1, 1, 2).equals(matrixBuilder.empty())).to.be.true;
      expect(matrixBuilder.slice(A, 1, 1, 2, 1).equals(matrixBuilder.empty())).to.be.true;
    });
  });
});
