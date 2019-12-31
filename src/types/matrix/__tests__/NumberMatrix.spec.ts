import { NumberMatrix } from '../NumberMatrix';
import { SparseNumberMatrix } from '../SparseNumberMatrix';
import { FloatMatrix } from '../FloatMatrix';

const configs = [
  {
    testClassName: 'NumberMatrix',
    builder: NumberMatrix.builder(),
    vectorBuilder: NumberMatrix.vectorBuilder()
  },
  {
    testClassName: 'SparseNumberMatrix',
    builder: SparseNumberMatrix.builder(),
    vectorBuilder: SparseNumberMatrix.vectorBuilder()
  },
  {
    testClassName: 'FloatMatrix',
    builder: FloatMatrix.builder(),
    vectorBuilder: FloatMatrix.vectorBuilder()
  }
];

configs.forEach(({ testClassName, builder, vectorBuilder }) => {
  describe(testClassName, () => {
    describe('builders and ops', () => {
      test('can be created from an instance', () => {
        const instance = builder.empty();
        expect(instance.builder()).toBeTruthy();
        expect(instance.vectorBuilder()).toBeTruthy();
        expect(instance.ops()).toBeTruthy();
      });
    });

    describe('constructors', () => {
      const data = [
        [1, 2, 3],
        [2, 2, 1],
        [5, 2, 9]
      ];

      test('can be constructed from a 2d array', () => {
        expect(builder.fromArray(data).toArray()).toStrictEqual(data);
      });

      test('can be constructed from column vectors', () => {
        const firstColumn = vectorBuilder.fromValues(1, 2, 5);
        const secondColumn = vectorBuilder.fromValues(2, 2, 2);
        const thirdColumn = vectorBuilder.fromValues(3, 1, 9);

        expect(
          builder.fromColumnVectors([firstColumn, secondColumn, thirdColumn]).toArray()
        ).toStrictEqual(data);
      });

      test('can be constructed from row vectors', () => {
        const firstRow = vectorBuilder.fromArray(data[0]);
        const secondRow = vectorBuilder.fromArray(data[1]);
        const thirdRow = vectorBuilder.fromArray(data[2]);

        expect(builder.fromRowVectors([firstRow, secondRow, thirdRow]).toArray()).toStrictEqual(
          data
        );
      });

      test('handles degenerate cases', () => {
        // 0x0
        expect(builder.fromArray([]).toArray()).toStrictEqual([]);
        // Nx0
        expect(builder.fromArray([[], [], []]).toArray()).toStrictEqual([]);
        // 0xM
        expect(builder.fromRowVectors([]).toArray()).toStrictEqual([]);
        // Nx0
        expect(builder.fromColumnVectors([]).toArray()).toStrictEqual([]);
      });

      test('rejects non-rectangular data', () => {
        const badData = [[0], [0, 0], [0, 0, 0]];
        expect(() => builder.fromArray(badData)).toThrow();

        const badVectorData = [
          vectorBuilder.fromValues(0),
          vectorBuilder.fromValues(0, 0),
          vectorBuilder.fromValues(0, 0, 0)
        ];
        expect(() => builder.fromColumnVectors(badVectorData)).toThrow();
        expect(() => builder.fromRowVectors(badVectorData)).toThrow();
      });
    });

    describe('equals', () => {
      configs.forEach(otherConfig => {
        const otherBuilder = otherConfig.builder;
        describe(otherConfig.testClassName, () => {
          test('returns true for matrices with equal entries', () => {
            const first = builder.fromArray([
              [1, 2],
              [0, 1]
            ]);
            const second = otherBuilder.fromArray([
              [1, 2],
              [0, 1]
            ]);
            expect(first.equals(second)).toBe(true);
          });

          test('returns false when the data does not match', () => {
            const first = builder.fromArray([
              [1, 2],
              [0, 1]
            ]);
            const second = otherBuilder.fromArray([
              [1, 2],
              [0.001, 1]
            ]);
            expect(first.equals(second)).toBe(false);
          });

          test('returns false when the dimensions do not match', () => {
            const first = builder.fromArray([
              [1, 2],
              [0, 1]
            ]);
            const fewerRows = otherBuilder.fromArray([[1, 2]]);
            const fewerColumns = otherBuilder.fromArray([[1], [0]]);
            expect(first.equals(fewerRows)).toBe(false);
            expect(first.equals(fewerColumns)).toBe(false);
          });
        });
      });
    });

    describe('getters', () => {
      const testMatrix = builder.fromArray([
        [1, 2, 3],
        [4, 5, 6]
      ]);

      describe('getColumnVectors', () => {
        test('returns the column vectors that make up the matrix', () => {
          expect(builder.empty().getColumnVectors()).toStrictEqual([]);
          const columns = testMatrix.getColumnVectors();
          expect(columns.length).toEqual(3);
          expect(columns[0].toArray()).toStrictEqual([1, 4]);
          expect(columns[1].toArray()).toStrictEqual([2, 5]);
          expect(columns[2].toArray()).toStrictEqual([3, 6]);
        });
      });

      describe('getColumn', () => {
        test('returns the column at the given index', () => {
          expect(testMatrix.getColumn(0).toArray()).toStrictEqual([1, 4]);
          expect(testMatrix.getColumn(1).toArray()).toStrictEqual([2, 5]);
          expect(testMatrix.getColumn(2).toArray()).toStrictEqual([3, 6]);
          expect(() => testMatrix.getColumn(3)).toThrow();
        });
      });

      describe('getRowVectors', () => {
        test('returns the row vectors that make up the matrix', () => {
          expect(builder.empty().getRowVectors()).toStrictEqual([]);
          const rows = testMatrix.getRowVectors();
          expect(rows.length).toEqual(2);
          expect(rows[0].toArray()).toStrictEqual([1, 2, 3]);
          expect(rows[1].toArray()).toStrictEqual([4, 5, 6]);
        });
      });

      describe('getRow', () => {
        test('returns the row at the given index', () => {
          expect(testMatrix.getRow(0).toArray()).toStrictEqual([1, 2, 3]);
          expect(testMatrix.getRow(1).toArray()).toStrictEqual([4, 5, 6]);
          expect(() => testMatrix.getRow(2)).toThrow();
        });
      });

      describe('getEntry', () => {
        test('returns the entry at the given coordinates', () => {
          expect(testMatrix.getEntry(0, 0)).toEqual(1);
          expect(testMatrix.getEntry(0, 1)).toEqual(2);
          expect(testMatrix.getEntry(0, 2)).toEqual(3);
          expect(testMatrix.getEntry(1, 0)).toEqual(4);
          expect(testMatrix.getEntry(1, 1)).toEqual(5);
          expect(testMatrix.getEntry(1, 2)).toEqual(6);
          expect(() => testMatrix.getEntry(2, 0)).toThrow();
          expect(() => testMatrix.getEntry(0, 3)).toThrow();
          expect(() => testMatrix.getEntry(2, 3)).toThrow();
        });
      });

      describe('getDiagonal', () => {
        test('returns the diagonal entries of a square matrix', () => {
          const A = builder.fromArray([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
          ]);
          expect(A.getDiagonal().toArray()).toStrictEqual([1, 5, 9]);
        });

        test('returns the diagonal entries of a non-square matrix', () => {
          const wide = builder.fromArray([
            [1, 2, 3],
            [4, 5, 6]
          ]);
          expect(wide.getDiagonal().toArray()).toStrictEqual([1, 5]);

          const tall = builder.fromArray([
            [1, 2],
            [3, 4],
            [5, 6]
          ]);
          expect(tall.getDiagonal().toArray()).toStrictEqual([1, 4]);
        });
      });

      describe('getSparseData', () => {
        const A = builder.identity(3);
        const data = A.getSparseData();
        const expected = new Map();
        expected.set(0, new Map().set(0, 1));
        expected.set(1, new Map().set(1, 1));
        expected.set(2, new Map().set(2, 1));
        expect(data).toStrictEqual(expected);
      });
    });

    describe('set', () => {
      test('returns the original matrix with one entry modified', () => {
        const original = builder.zeros([3, 3]);
        const expected = builder.fromArray([
          [0, 0, 0],
          [0, 4, 0],
          [0, 0, 0]
        ]);
        const second = builder.fromArray([
          [0, 0, 0],
          [0, 4, 5],
          [0, 0, 0]
        ]);

        expect(original.set(1, 1, 4)).toStrictEqual(expected);
        expect(original.set(1, 1, 4).set(1, 2, 5)).toStrictEqual(second);
      });

      test('throws an error for invalid indices', () => {
        const original = builder.zeros([3, 3]);
        expect(() => original.set(3, 1, 4)).toThrow();
        expect(() => original.set(1, 3, 4)).toThrow();
      });
    });

    describe('multiply', () => {
      test('returns the product of two matrices of equal dimension', () => {
        const I = builder.fromArray([
          [1, 0],
          [0, 1]
        ]);
        const A = builder.fromArray([
          [1, 2],
          [3, 4]
        ]);
        const B = builder.fromArray([
          [2, 3],
          [4, 5]
        ]);

        expect(A.multiply(A).toArray()).toStrictEqual([
          [7, 10],
          [15, 22]
        ]);
        expect(A.multiply(B).toArray()).toStrictEqual([
          [10, 13],
          [22, 29]
        ]);
        expect(A.multiply(I).toArray()).toStrictEqual(A.toArray());
        expect(B.multiply(A).toArray()).toStrictEqual([
          [11, 16],
          [19, 28]
        ]);
        expect(B.multiply(B).toArray()).toStrictEqual([
          [16, 21],
          [28, 37]
        ]);
        expect(B.multiply(I).toArray()).toStrictEqual(B.toArray());
        expect(I.multiply(A).toArray()).toStrictEqual(A.toArray());
        expect(I.multiply(B).toArray()).toStrictEqual(B.toArray());
        expect(I.multiply(I).toArray()).toStrictEqual(I.toArray());
      });

      test('returns the product of two matrices of unequal dimension', () => {
        const A = builder.fromArray([[1, 2, 3, 4]]);
        const B = builder.fromArray([[1], [2], [3], [4]]);

        expect(A.multiply(B).toArray()).toStrictEqual([[30]]);
        expect(B.multiply(A).toArray()).toStrictEqual([
          [1, 2, 3, 4],
          [2, 4, 6, 8],
          [3, 6, 9, 12],
          [4, 8, 12, 16]
        ]);
      });

      test('throws an error when the dimensions are not compatible', () => {
        const A = builder.fromArray([
          [1, 0],
          [0, 1]
        ]);
        const B = builder.fromArray([
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ]);
        expect(() => A.multiply(B)).toThrow();
      });

      test('handles the degenerate case', () => {
        expect(
          builder
            .empty()
            .multiply(builder.empty())
            .toArray()
        ).toStrictEqual([]);
      });
    });

    describe('scalarMultiply', () => {
      test('returns the original matrix with each entry multiplied by a constant', () => {
        const original = builder.ones([4, 5]);
        const expected = builder.fill(2, [4, 5]);
        expect(original.scalarMultiply(2)).toStrictEqual(expected);
      });
    });

    describe('transpose', () => {
      test('returns the transpose of a matrix', () => {
        const A = builder.fromArray([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        const B = builder.fromArray([
          [1, 4],
          [2, 5],
          [3, 6]
        ]);
        expect(A.transpose().equals(B)).toBe(true);
        expect(B.transpose().equals(A)).toBe(true);
      });

      test('handles the degenerate case', () => {
        const E = builder.empty();
        expect(E.transpose().equals(E)).toBe(true);
      });
    });

    describe('add', () => {
      test('adds two matrices of equal dimension', () => {
        const A = builder.fromArray([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        const B = builder.fromArray([
          [2, 3, 4],
          [5, 6, 7]
        ]);

        expect(A.add(B).toArray()).toStrictEqual([
          [3, 5, 7],
          [9, 11, 13]
        ]);
      });

      test('throws an error when the dimensions do not match', () => {
        const A = builder.fromArray([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        const B = builder.fromArray([
          [2, 3],
          [5, 6]
        ]);

        expect(() => A.add(B)).toThrow();
      });

      test('handles the degenerate case', () => {
        expect(
          builder
            .empty()
            .add(builder.empty())
            .toArray()
        ).toStrictEqual([]);
      });
    });

    describe('apply', () => {
      test('transforms a vector with the correct dimension', () => {
        const I = builder.fromArray([
          [1, 0],
          [0, 1]
        ]);
        const A = builder.fromArray([
          [1, 2],
          [3, 4]
        ]);
        const x = vectorBuilder.fromValues(1, 2);

        expect(I.apply(x).toArray()).toStrictEqual(x.toArray());
        expect(A.apply(x).toArray()).toStrictEqual([5, 11]);
      });

      test('throws an error when the dimensions are not compatible', () => {
        const A = builder.fromArray([
          [1, 2],
          [3, 4]
        ]);
        const x = vectorBuilder.fromValues(1, 2, 3);
        expect(() => A.apply(x)).toThrow();
      });
    });

    describe('adjoint', () => {
      test('returns the transpose of the original matrix', () => {
        const M = builder.fromArray([
          [1, 2],
          [3, 4]
        ]);
        const mStar = M.adjoint();
        const mTrans = M.transpose();
        expect(mStar.equals(mTrans)).toBe(true);
      });
    });

    describe('trace', () => {
      test('computes the trace of a matrix', () => {
        expect(
          builder
            .fromArray([
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]
            ])
            .trace()
        ).toEqual(15);
      });
    });

    describe('forEach', () => {
      test('runs a function for each entry in the matrix', () => {
        let numCalls = 0;
        const A = builder.zeros([6, 7]);
        A.forEach(() => ++numCalls);
        expect(numCalls).toEqual(6 * 7);
      });
    });

    describe('map', () => {
      test('builds a matrix by transforming the values of another matrix', () => {
        const original = builder.fromArray([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        const mapped = original.map((entry, i, j) => entry + i - j);
        const expected = builder.fromArray([
          [1, 1, 1],
          [5, 5, 5]
        ]);

        expect(mapped).toStrictEqual(expected);
      });

      test('handles an empty matrix', () => {
        expect(builder.empty().map(() => 1)).toStrictEqual(builder.empty());
      });
    });
  });
});
