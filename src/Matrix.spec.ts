import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Vector } from './Vector';
import { Matrix } from './Matrix';
import { MatrixBuilder } from './utilities/MatrixBuilder';

describe('Matrix', () => {
  describe('constructors', () => {
    const data = [[1, 2, 3], [2, 2, 1], [5, 2, 9]];

    it('can be constructed from a 2d array', () => {
      expect(Matrix.fromData(data).getData()).to.deep.equal(data);
    });

    it('can be constructed from column vectors', () => {
      const firstColumn = Vector.fromValues(1, 2, 5);
      const secondColumn = Vector.fromValues(2, 2, 2);
      const thirdColumn = Vector.fromValues(3, 1, 9);

      expect(
        Matrix.fromColumnVectors([firstColumn, secondColumn, thirdColumn]).getData()
      ).to.deep.equal(data);
    });

    it('can be constructed from row vectors', () => {
      const firstRow = Vector.fromData(data[0]);
      const secondRow = Vector.fromData(data[1]);
      const thirdRow = Vector.fromData(data[2]);

      expect(Matrix.fromRowVectors([firstRow, secondRow, thirdRow]).getData()).to.deep.equal(data);
    });

    it('handles degenerate cases', () => {
      // 0x0
      expect(Matrix.fromData([]).getData()).to.deep.equal([]);
      // Nx0
      expect(Matrix.fromData([[], [], []]).getData()).to.deep.equal([]);
      // 0xM
      expect(Matrix.fromRowVectors([]).getData()).to.deep.equal([]);
      // Nx0
      expect(Matrix.fromColumnVectors([]).getData()).to.deep.equal([]);
    });

    it('rejects non-rectangular data', () => {
      const badData = [[0], [0, 0], [0, 0, 0]];
      expect(() => Matrix.fromData(badData)).to.throw();

      const badVectorData = [
        Vector.fromValues(0),
        Vector.fromValues(0, 0),
        Vector.fromValues(0, 0, 0)
      ];
      expect(() => Matrix.fromColumnVectors(badVectorData)).to.throw();
      expect(() => Matrix.fromRowVectors(badVectorData)).to.throw();
    });
  });

  describe('getters', () => {
    const testMatrix = Matrix.fromData([[1, 2, 3], [4, 5, 6]]);

    describe('getDimension', () => {
      it('returns the dimension of the matrix', () => {
        expect(MatrixBuilder.empty().getDimension()).to.equal(0);
        expect(Matrix.fromData([[1]]).getDimension()).to.equal(1);
        expect(Matrix.fromData([[1, 0]]).getDimension()).to.equal(2);
        expect(Matrix.fromData([[1], [0]]).getDimension()).to.equal(2);
        expect(Matrix.fromData([[1, 0], [0, 1]]).getDimension()).to.equal(4);
      });
    });

    describe('getColumnVectors', () => {
      it('returns the column vectors that make up the matrix', () => {
        expect(MatrixBuilder.empty().getColumnVectors()).to.deep.equal([]);
        const columns = testMatrix.getColumnVectors();
        expect(columns.length).to.equal(3);
        expect(columns[0].getData()).to.deep.equal([1, 4]);
        expect(columns[1].getData()).to.deep.equal([2, 5]);
        expect(columns[2].getData()).to.deep.equal([3, 6]);
      });
    });

    describe('getColumn', () => {
      it('returns the column at the given index', () => {
        expect(testMatrix.getColumn(0).getData()).to.deep.equal([1, 4]);
        expect(testMatrix.getColumn(1).getData()).to.deep.equal([2, 5]);
        expect(testMatrix.getColumn(2).getData()).to.deep.equal([3, 6]);
        expect(() => testMatrix.getColumn(3)).to.throw();
      });
    });

    describe('getRowVectors', () => {
      it('returns the row vectors that make up the matrix', () => {
        expect(MatrixBuilder.empty().getRowVectors()).to.deep.equal([]);
        const rows = testMatrix.getRowVectors();
        expect(rows.length).to.equal(2);
        expect(rows[0].getData()).to.deep.equal([1, 2, 3]);
        expect(rows[1].getData()).to.deep.equal([4, 5, 6]);
      });
    });

    describe('getRow', () => {
      it('returns the row at the given index', () => {
        expect(testMatrix.getRow(0).getData()).to.deep.equal([1, 2, 3]);
        expect(testMatrix.getRow(1).getData()).to.deep.equal([4, 5, 6]);
        expect(() => testMatrix.getRow(2)).to.throw();
      });
    });

    describe('getEntry', () => {
      it('returns the entry at the given coordinates', () => {
        expect(testMatrix.getEntry(0, 0)).to.equal(1);
        expect(testMatrix.getEntry(0, 1)).to.equal(2);
        expect(testMatrix.getEntry(0, 2)).to.equal(3);
        expect(testMatrix.getEntry(1, 0)).to.equal(4);
        expect(testMatrix.getEntry(1, 1)).to.equal(5);
        expect(testMatrix.getEntry(1, 2)).to.equal(6);
        expect(() => testMatrix.getEntry(2, 0)).to.throw();
        expect(() => testMatrix.getEntry(0, 3)).to.throw();
        expect(() => testMatrix.getEntry(2, 3)).to.throw();
      });
    });
  });

  describe('multiply', () => {
    it('returns the product of two matrices of equal dimension', () => {
      const I = Matrix.fromData([[1, 0], [0, 1]]);
      const A = Matrix.fromData([[1, 2], [3, 4]]);
      const B = Matrix.fromData([[2, 3], [4, 5]]);

      expect(A.multiply(A).getData()).to.deep.equal([[7, 10], [15, 22]]);
      expect(A.multiply(B).getData()).to.deep.equal([[10, 13], [22, 29]]);
      expect(A.multiply(I).getData()).to.deep.equal(A.getData());
      expect(B.multiply(A).getData()).to.deep.equal([[11, 16], [19, 28]]);
      expect(B.multiply(B).getData()).to.deep.equal([[16, 21], [28, 37]]);
      expect(B.multiply(I).getData()).to.deep.equal(B.getData());
      expect(I.multiply(A).getData()).to.deep.equal(A.getData());
      expect(I.multiply(B).getData()).to.deep.equal(B.getData());
      expect(I.multiply(I).getData()).to.deep.equal(I.getData());
    });

    it('returns the product of two matrices of unequal dimension', () => {
      const A = Matrix.fromData([[1, 2, 3, 4]]);
      const B = Matrix.fromData([[1], [2], [3], [4]]);

      expect(A.multiply(B).getData()).to.deep.equal([[30]]);
      expect(B.multiply(A).getData()).to.deep.equal([
        [1, 2, 3, 4],
        [2, 4, 6, 8],
        [3, 6, 9, 12],
        [4, 8, 12, 16]
      ]);
    });

    it('throws an error when the dimensions are not compatible', () => {
      const A = Matrix.fromData([[1, 0], [0, 1]]);
      const B = Matrix.fromData([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
      expect(() => A.multiply(B)).to.throw();
    });

    it('handles the degenerate case', () => {
      expect(
        MatrixBuilder.empty()
          .multiply(MatrixBuilder.empty())
          .getData()
      ).to.deep.equal([]);
    });
  });

  describe('transpose', () => {
    it('returns the transpose of a matrix', () => {
      const A = Matrix.fromData([[1, 2, 3], [4, 5, 6]]);
      const B = Matrix.fromData([[1, 4], [2, 5], [3, 6]]);
      expect(A.transpose().approxEquals(B)).to.be.true;
      expect(B.transpose().approxEquals(A)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const E = MatrixBuilder.empty();
      expect(E.transpose().approxEquals(E)).to.be.true;
    });
  });

  describe('inverse', () => {
    it('returns the inverse of a square matrix', () => {
      const A = Matrix.fromData([[2, 3], [3, 5]]);
      const Ainv = Matrix.fromData([[5, -3], [-3, 2]]);
      expect(A.inverse().approxEquals(Ainv)).to.be.true;
    });

    it('does not affect an identity matrix', () => {
      const I = MatrixBuilder.identity(10);
      expect(I.inverse().approxEquals(I)).to.be.true;
    });

    it('throws an error for a non-square matrix', () => {
      const A = Matrix.fromData([[1, 1]]);
      expect(() => A.inverse()).to.throw();
    });
  });

  describe('add', () => {
    it('adds two matrices of equal dimension', () => {
      const A = Matrix.fromData([[1, 2, 3], [4, 5, 6]]);
      const B = Matrix.fromData([[2, 3, 4], [5, 6, 7]]);

      expect(A.add(B).getData()).to.deep.equal([[3, 5, 7], [9, 11, 13]]);
    });

    it('throws an error when the dimensions do not match', () => {
      const A = Matrix.fromData([[1, 2, 3], [4, 5, 6]]);
      const B = Matrix.fromData([[2, 3], [5, 6]]);

      expect(() => A.add(B)).to.throw();
    });

    it('handles the degenerate case', () => {
      expect(
        MatrixBuilder.empty()
          .add(MatrixBuilder.empty())
          .getData()
      ).to.deep.equal([]);
    });
  });

  describe('apply', () => {
    it('transforms a vector with the correct dimension', () => {
      const I = Matrix.fromData([[1, 0], [0, 1]]);
      const A = Matrix.fromData([[1, 2], [3, 4]]);
      const x = Vector.fromValues(1, 2);

      expect(I.apply(x).getData()).to.deep.equal(x.getData());
      expect(A.apply(x).getData()).to.deep.equal([5, 11]);
    });

    it('throws an error when the dimensions are not compatible', () => {
      const A = Matrix.fromData([[1, 2], [3, 4]]);
      const x = Vector.fromValues(1, 2, 3);
      expect(() => A.apply(x)).to.throw();
    });
  });
});
