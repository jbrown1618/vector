import { describe, it } from 'mocha';
import { expect } from 'chai';
import { MatrixBuilder } from './MatrixBuilder';
import { Vector } from '../Vector';
import { Matrix } from '../Matrix';
import { VectorBuilder } from './VectorBuilder';

describe('MatrixBuilder', () => {
  describe('empty', () => {
    it('returns an empty vector', () => {
      const E = MatrixBuilder.empty();
      expect(E.getDimension()).to.equal(0);
      expect(E.getNumberOfRows()).to.equal(0);
      expect(E.getNumberOfColumns()).to.equal(0);
      expect(E.getData()).to.deep.equal([]);
    });
  });

  describe('zeros', () => {
    it('builds a square matrix of zeros', () => {
      for (let n = 0; n < 10; n++) {
        const zeros = MatrixBuilder.zeros(n);
        expect(zeros.getNumberOfRows()).to.equal(n);
        expect(zeros.getNumberOfColumns()).to.equal(n);

        zeros.forEachEntry(entry => {
          expect(entry).to.equal(0);
        });
      }
    });

    it('builds a rectangular matrix of zeros', () => {
      for (let r = 1; r < 5; r++) {
        for (let c = 1; c < 5; c++) {
          const zeros = MatrixBuilder.zeros(r, c);
          expect(zeros.getNumberOfRows()).to.equal(r);
          expect(zeros.getNumberOfColumns()).to.equal(c);

          zeros.forEachEntry(entry => {
            expect(entry).to.equal(0);
          });
        }
      }
    });
  });

  describe('ones', () => {
    it('builds a square matrix of ones', () => {
      for (let n = 0; n < 10; n++) {
        const ones = MatrixBuilder.ones(n);
        expect(ones.getNumberOfRows()).to.equal(n);
        expect(ones.getNumberOfColumns()).to.equal(n);

        ones.forEachEntry(entry => {
          expect(entry).to.equal(1);
        });
      }
    });

    it('builds a rectangular matrix of ones', () => {
      for (let r = 1; r < 5; r++) {
        for (let c = 1; c < 5; c++) {
          const ones = MatrixBuilder.ones(r, c);
          expect(ones.getNumberOfRows()).to.equal(r);
          expect(ones.getNumberOfColumns()).to.equal(c);

          ones.forEachEntry(entry => {
            expect(entry).to.equal(1);
          });
        }
      }
    });
  });

  describe('identity', () => {
    it('constructs an identity matrix', () => {
      for (let n = 0; n < 10; n++) {
        const I = MatrixBuilder.identity(n);
        expect(I.getNumberOfColumns()).to.equal(n);
        expect(I.getNumberOfRows()).to.equal(n);

        I.forEachEntry((entry, i, j) => {
          expect(entry).to.equal(i === j ? 1 : 0);
        });
      }
    });
  });

  describe('diagonal', () => {
    it('constructs a diagonal matrix with the given diagonal entries', () => {
      const diagonalEntries = Vector.fromData([1, 2, 3]);
      const expected = Matrix.fromData([[1, 0, 0], [0, 2, 0], [0, 0, 3]]);

      expect(MatrixBuilder.diagonal(diagonalEntries).approxEquals(expected)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const diagonalEntries = VectorBuilder.empty();
      const expected = MatrixBuilder.empty();
      expect(MatrixBuilder.diagonal(diagonalEntries).approxEquals(expected)).to.be.true;
    });
  });

  describe('augment', () => {
    it('horizontally concatenates two matrices', () => {
      const first = MatrixBuilder.identity(2);
      const second = MatrixBuilder.ones(2);
      const expected = Matrix.fromData([[1, 0, 1, 1], [0, 1, 1, 1]]);

      expect(MatrixBuilder.augment(first, second).approxEquals(expected)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const empty = MatrixBuilder.empty();
      expect(MatrixBuilder.augment(empty, empty).approxEquals(empty)).to.be.true;
    });

    it('throws an error when the input dimensions are not compatible', () => {
      const first = MatrixBuilder.identity(2);
      const second = MatrixBuilder.ones(3);
      expect(() => MatrixBuilder.augment(first, second)).to.throw();
    });
  });

  describe('slice', () => {
    const A = Matrix.fromData([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);

    it('includes the start indices but excludes the end indices', () => {
      let expectedSlice = Matrix.fromData([[1, 2], [5, 6]]);
      expect(MatrixBuilder.slice(A, 0, 0, 2, 2).approxEquals(expectedSlice)).to.be.true;

      expectedSlice = Matrix.fromData([[1, 2, 3]]);
      expect(MatrixBuilder.slice(A, 0, 0, 1, 3).approxEquals(expectedSlice)).to.be.true;

      expectedSlice = Matrix.fromData([[1], [5], [9]]);
      expect(MatrixBuilder.slice(A, 0, 0, 3, 1).approxEquals(expectedSlice)).to.be.true;
    });

    it('defaults to the entire matrix when no indices are given', () => {
      expect(MatrixBuilder.slice(A).approxEquals(A)).to.be.true;
    });

    it('defaults to the end of the matrix when no end indices are given', () => {
      let expectedSlice = Matrix.fromData([[6, 7, 8], [10, 11, 12]]);
      expect(MatrixBuilder.slice(A, 1, 1).approxEquals(expectedSlice)).to.be.true;
    });

    it('returns an empty matrix when a start index matches the end index', () => {
      expect(MatrixBuilder.slice(A, 1, 1, 1, 2).approxEquals(MatrixBuilder.empty())).to.be.true;
      expect(MatrixBuilder.slice(A, 1, 1, 2, 1).approxEquals(MatrixBuilder.empty())).to.be.true;
    });
  });
});
