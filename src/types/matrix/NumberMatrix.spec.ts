import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberVector } from '../vector/NumberVector';
import { SparseNumberVector } from '../vector/SparseNumberVector';
import { NumberMatrix } from './NumberMatrix';
import { SparseNumberMatrix } from './SparseNumberMatrix';

const configs = [
  {
    testClassName: 'NumberMatrix',
    builder: NumberMatrix.builder(),
    vectorBuilder: NumberVector.builder()
  },
  {
    testClassName: 'SparseNumberMatrix',
    builder: SparseNumberMatrix.builder(),
    vectorBuilder: SparseNumberVector.builder()
  }
];

configs.forEach(({ testClassName, builder, vectorBuilder }) => {
  describe(testClassName, () => {
    describe('constructors', () => {
      const data = [[1, 2, 3], [2, 2, 1], [5, 2, 9]];

      it('can be constructed from a 2d array', () => {
        expect(builder.fromArray(data).getData()).to.deep.equal(data);
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
        const firstRow = vectorBuilder.fromArray(data[0]);
        const secondRow = vectorBuilder.fromArray(data[1]);
        const thirdRow = vectorBuilder.fromArray(data[2]);

        expect(builder.fromRowVectors([firstRow, secondRow, thirdRow]).getData()).to.deep.equal(
          data
        );
      });

      it('handles degenerate cases', () => {
        // 0x0
        expect(builder.fromArray([]).getData()).to.deep.equal([]);
        // Nx0
        expect(builder.fromArray([[], [], []]).getData()).to.deep.equal([]);
        // 0xM
        expect(builder.fromRowVectors([]).getData()).to.deep.equal([]);
        // Nx0
        expect(builder.fromColumnVectors([]).getData()).to.deep.equal([]);
      });

      it('rejects non-rectangular data', () => {
        const badData = [[0], [0, 0], [0, 0, 0]];
        expect(() => builder.fromArray(badData)).to.throw();

        const badVectorData = [
          vectorBuilder.fromValues(0),
          vectorBuilder.fromValues(0, 0),
          vectorBuilder.fromValues(0, 0, 0)
        ];
        expect(() => builder.fromColumnVectors(badVectorData)).to.throw();
        expect(() => builder.fromRowVectors(badVectorData)).to.throw();
      });
    });

    describe('equals', () => {
      configs.forEach(otherConfig => {
        const otherBuilder = otherConfig.builder;
        describe(otherConfig.testClassName, () => {
          it('returns true for matrices with equal entries', () => {
            const first = builder.fromArray([[1, 2], [0, 1]]);
            const second = otherBuilder.fromArray([[1, 2], [0, 1]]);
            expect(first.equals(second)).to.be.true;
          });

          it('returns false when the data does not match', () => {
            const first = builder.fromArray([[1, 2], [0, 1]]);
            const second = otherBuilder.fromArray([[1, 2], [0.001, 1]]);
            expect(first.equals(second)).to.be.false;
          });

          it('returns false when the dimensions do not match', () => {
            const first = builder.fromArray([[1, 2], [0, 1]]);
            const fewerRows = otherBuilder.fromArray([[1, 2]]);
            const fewerColumns = otherBuilder.fromArray([[1], [0]]);
            expect(first.equals(fewerRows)).to.be.false;
            expect(first.equals(fewerColumns)).to.be.false;
          });
        });
      });
    });

    describe('getters', () => {
      const testMatrix = builder.fromArray([[1, 2, 3], [4, 5, 6]]);

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

      describe('getDiagonal', () => {
        it('returns the diagonal entries of a square matrix', () => {
          const A = builder.fromArray([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
          expect(A.getDiagonal().getData()).to.deep.equal([1, 5, 9]);
        });

        it('returns the diagonal entries of a non-square matrix', () => {
          const wide = builder.fromArray([[1, 2, 3], [4, 5, 6]]);
          expect(wide.getDiagonal().getData()).to.deep.equal([1, 5]);

          const tall = builder.fromArray([[1, 2], [3, 4], [5, 6]]);
          expect(tall.getDiagonal().getData()).to.deep.equal([1, 4]);
        });
      });

      describe('getSparseData', () => {
        const A = builder.identity(3);
        const data = A.getSparseData();
        const expected = new Map();
        expected.set(0, new Map().set(0, 1));
        expected.set(1, new Map().set(1, 1));
        expected.set(2, new Map().set(2, 1));
        expect(data).to.deep.equal(expected);
      });
    });

    describe('set', () => {
      it('returns the original matrix with one entry modified', () => {
        const original = builder.zeros(3);
        const expected = builder.fromArray([[0, 0, 0], [0, 4, 0], [0, 0, 0]]);
        const second = builder.fromArray([[0, 0, 0], [0, 4, 5], [0, 0, 0]]);

        expect(original.set(1, 1, 4)).to.deep.equal(expected);
        expect(original.set(1, 1, 4).set(1, 2, 5)).to.deep.equal(second);
      });

      it('throws an error for invalid indices', () => {
        const original = builder.zeros(3);
        expect(() => original.set(3, 1, 4)).to.throw();
        expect(() => original.set(1, 3, 4)).to.throw();
      });
    });

    describe('multiply', () => {
      it('returns the product of two matrices of equal dimension', () => {
        const I = builder.fromArray([[1, 0], [0, 1]]);
        const A = builder.fromArray([[1, 2], [3, 4]]);
        const B = builder.fromArray([[2, 3], [4, 5]]);

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
        const A = builder.fromArray([[1, 2, 3, 4]]);
        const B = builder.fromArray([[1], [2], [3], [4]]);

        expect(A.multiply(B).getData()).to.deep.equal([[30]]);
        expect(B.multiply(A).getData()).to.deep.equal([
          [1, 2, 3, 4],
          [2, 4, 6, 8],
          [3, 6, 9, 12],
          [4, 8, 12, 16]
        ]);
      });

      it('throws an error when the dimensions are not compatible', () => {
        const A = builder.fromArray([[1, 0], [0, 1]]);
        const B = builder.fromArray([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
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

    describe('scalarMultiply', () => {
      it('returns the original matrix with each entry multiplied by a constant', () => {
        const original = builder.ones(4, 5);
        const expected = builder.fill(2, 4, 5);
        expect(original.scalarMultiply(2)).to.deep.equal(expected);
      });
    });

    describe('transpose', () => {
      it('returns the transpose of a matrix', () => {
        const A = builder.fromArray([[1, 2, 3], [4, 5, 6]]);
        const B = builder.fromArray([[1, 4], [2, 5], [3, 6]]);
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
        const A = builder.fromArray([[1, 2, 3], [4, 5, 6]]);
        const B = builder.fromArray([[2, 3, 4], [5, 6, 7]]);

        expect(A.add(B).getData()).to.deep.equal([[3, 5, 7], [9, 11, 13]]);
      });

      it('throws an error when the dimensions do not match', () => {
        const A = builder.fromArray([[1, 2, 3], [4, 5, 6]]);
        const B = builder.fromArray([[2, 3], [5, 6]]);

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
        const I = builder.fromArray([[1, 0], [0, 1]]);
        const A = builder.fromArray([[1, 2], [3, 4]]);
        const x = vectorBuilder.fromValues(1, 2);

        expect(I.apply(x).getData()).to.deep.equal(x.getData());
        expect(A.apply(x).getData()).to.deep.equal([5, 11]);
      });

      it('throws an error when the dimensions are not compatible', () => {
        const A = builder.fromArray([[1, 2], [3, 4]]);
        const x = vectorBuilder.fromValues(1, 2, 3);
        expect(() => A.apply(x)).to.throw();
      });
    });

    describe('adjoint', () => {
      it('returns the transpose of the original matrix', () => {
        const M = builder.fromArray([[1, 2], [3, 4]]);
        const mStar = M.adjoint();
        const mTrans = M.transpose();
        expect(mStar.equals(mTrans)).to.be.true;
      });
    });

    describe('trace', () => {
      it('computes the trace of a matrix', () => {
        expect(builder.fromArray([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).trace()).to.equal(15);
      });
    });

    describe('forEachEntry', () => {
      it('runs a function for each entry in the matrix', () => {
        let numCalls = 0;
        const A = builder.zeros(6, 7);
        A.forEachEntry(() => ++numCalls);
        expect(numCalls).to.equal(6 * 7);
      });
    });
  });
});
