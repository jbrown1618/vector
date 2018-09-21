import { describe, it } from 'mocha';
import { expect } from 'chai';
import { NumberVector } from '../vector/NumberVector';
import { NumberMatrix } from './NumberMatrix';

describe('NumberMatrix', () => {
  const builder = NumberMatrix.builder();
  const vectorBuilder = NumberVector.builder();

  describe('constructors', () => {
    const data = [[1, 2, 3], [2, 2, 1], [5, 2, 9]];

    it('can be constructed from a 2d array', () => {
      expect(builder.fromData(data).getData()).to.deep.equal(data);
    });

    it('can be constructed from column vectors', () => {
      const firstColumn = vectorBuilder.fromValues(1, 2, 5);
      const secondColumn = vectorBuilder.fromValues(2, 2, 2);
      const thirdColumn = vectorBuilder.fromValues(3, 1, 9);

      expect(
        builder.fromColumnVectors([firstColumn, secondColumn, thirdColumn]).getData()
      ).to.deep.equal(data);
    });

    it('can be constructed from row vectors', () => {
      const firstRow = vectorBuilder.fromData(data[0]);
      const secondRow = vectorBuilder.fromData(data[1]);
      const thirdRow = vectorBuilder.fromData(data[2]);

      expect(builder.fromRowVectors([firstRow, secondRow, thirdRow]).getData()).to.deep.equal(data);
    });

    it('handles degenerate cases', () => {
      // 0x0
      expect(builder.fromData([]).getData()).to.deep.equal([]);
      // Nx0
      expect(builder.fromData([[], [], []]).getData()).to.deep.equal([]);
      // 0xM
      expect(builder.fromRowVectors([]).getData()).to.deep.equal([]);
      // Nx0
      expect(builder.fromColumnVectors([]).getData()).to.deep.equal([]);
    });

    it('rejects non-rectangular data', () => {
      const badData = [[0], [0, 0], [0, 0, 0]];
      expect(() => builder.fromData(badData)).to.throw();

      const badVectorData = [
        vectorBuilder.fromValues(0),
        vectorBuilder.fromValues(0, 0),
        vectorBuilder.fromValues(0, 0, 0)
      ];
      expect(() => builder.fromColumnVectors(badVectorData)).to.throw();
      expect(() => builder.fromRowVectors(badVectorData)).to.throw();
    });
  });

  describe('getters', () => {
    const testMatrix = builder.fromData([[1, 2, 3], [4, 5, 6]]);

    describe('getColumnVectors', () => {
      it('returns the column vectors that make up the matrix', () => {
        expect(builder.empty().getColumnVectors()).to.deep.equal([]);
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
        expect(builder.empty().getRowVectors()).to.deep.equal([]);
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
      const I = builder.fromData([[1, 0], [0, 1]]);
      const A = builder.fromData([[1, 2], [3, 4]]);
      const B = builder.fromData([[2, 3], [4, 5]]);

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
      const A = builder.fromData([[1, 2, 3, 4]]);
      const B = builder.fromData([[1], [2], [3], [4]]);

      expect(A.multiply(B).getData()).to.deep.equal([[30]]);
      expect(B.multiply(A).getData()).to.deep.equal([
        [1, 2, 3, 4],
        [2, 4, 6, 8],
        [3, 6, 9, 12],
        [4, 8, 12, 16]
      ]);
    });

    it('throws an error when the dimensions are not compatible', () => {
      const A = builder.fromData([[1, 0], [0, 1]]);
      const B = builder.fromData([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
      expect(() => A.multiply(B)).to.throw();
    });

    it('handles the degenerate case', () => {
      expect(
        builder
          .empty()
          .multiply(builder.empty())
          .getData()
      ).to.deep.equal([]);
    });
  });

  describe('transpose', () => {
    it('returns the transpose of a matrix', () => {
      const A = builder.fromData([[1, 2, 3], [4, 5, 6]]);
      const B = builder.fromData([[1, 4], [2, 5], [3, 6]]);
      expect(A.transpose().equals(B)).to.be.true;
      expect(B.transpose().equals(A)).to.be.true;
    });

    it('handles the degenerate case', () => {
      const E = builder.empty();
      expect(E.transpose().equals(E)).to.be.true;
    });
  });

  describe('add', () => {
    it('adds two matrices of equal dimension', () => {
      const A = builder.fromData([[1, 2, 3], [4, 5, 6]]);
      const B = builder.fromData([[2, 3, 4], [5, 6, 7]]);

      expect(A.add(B).getData()).to.deep.equal([[3, 5, 7], [9, 11, 13]]);
    });

    it('throws an error when the dimensions do not match', () => {
      const A = builder.fromData([[1, 2, 3], [4, 5, 6]]);
      const B = builder.fromData([[2, 3], [5, 6]]);

      expect(() => A.add(B)).to.throw();
    });

    it('handles the degenerate case', () => {
      expect(
        builder
          .empty()
          .add(builder.empty())
          .getData()
      ).to.deep.equal([]);
    });
  });

  describe('apply', () => {
    it('transforms a vector with the correct dimension', () => {
      const I = builder.fromData([[1, 0], [0, 1]]);
      const A = builder.fromData([[1, 2], [3, 4]]);
      const x = vectorBuilder.fromValues(1, 2);

      expect(I.apply(x).getData()).to.deep.equal(x.getData());
      expect(A.apply(x).getData()).to.deep.equal([5, 11]);
    });

    it('throws an error when the dimensions are not compatible', () => {
      const A = builder.fromData([[1, 2], [3, 4]]);
      const x = vectorBuilder.fromValues(1, 2, 3);
      expect(() => A.apply(x)).to.throw();
    });
  });
});
