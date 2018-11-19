import { describe, it } from 'mocha';
import { expect } from 'chai';
import { NumberVector } from './NumberVector';

describe('VectorBuilder', () => {
  const builder = NumberVector.builder();

  describe('fromSparseData', () => {
    it('builds a vector of all 0s except for the specified entries', () => {
      const sparseData: Map<number, number> = new Map();
      sparseData.set(3, 1);
      sparseData.set(4, 2);
      const V = builder.fromSparseData(6, sparseData);
      const expected = builder.fromData([0, 0, 0, 1, 2, 0]);
      expect(V.equals(expected)).to.be.true;
    });
  });

  describe('empty', () => {
    it('returns an empty vector', () => {
      const E = builder.empty();
      expect(E.getDimension()).to.equal(0);
      expect(E.getData()).to.deep.equal([]);
    });
  });

  describe('zeros', () => {
    it('constructs an all-zero vector', () => {
      const testForDimension = (dim: number) => {
        const zeros = builder.zeros(dim);
        expect(zeros.getDimension()).to.equal(dim);
        const allZero = zeros
          .getData()
          .map((entry: number) => entry === 0)
          .reduce((all: boolean, current: boolean) => all && current, true);
        expect(allZero).to.be.true;
      };

      for (let dim = 0; dim < 100; dim++) {
        testForDimension(dim);
      }
    });

    it('rejects a negative size', () => {
      expect(() => builder.zeros(-1)).to.throw();
    });
  });

  describe('ones', () => {
    it('constructs an all-one vector', () => {
      const testForDimension = (dim: number) => {
        const ones = builder.ones(dim);
        expect(ones.getDimension()).to.equal(dim);
        const allOne = ones
          .getData()
          .map(entry => entry === 1)
          .reduce((all, current) => all && current, true);
        expect(allOne).to.be.true;
      };

      for (let dim = 0; dim < 100; dim++) {
        testForDimension(dim);
      }
    });

    it('rejects a negative size', () => {
      expect(() => builder.ones(-1)).to.throw();
    });
  });

  describe('elementaryVector', () => {
    it('constructs a vector with all zeros, but a one in a particular position', () => {
      const testForDimensionAndPosition = (dim: number, pos: number) => {
        const e = builder.elementaryVector(dim, pos);
        expect(e.getDimension()).to.equal(dim);
        const allCorrect = e
          .getData()
          .map((entry, i) => entry === (i === pos ? 1 : 0))
          .reduce((all, current) => all && current, true);
        expect(allCorrect).to.be.true;
      };

      for (let dim = 0; dim < 25; dim++) {
        for (let pos = 0; pos < dim; pos++) {
          testForDimensionAndPosition(dim, pos);
        }
      }
    });

    it('throws an error when the index is out of bounds', () => {
      for (let dim = 0; dim < 100; dim++) {
        expect(() => builder.elementaryVector(dim, -1)).to.throw();
        if (dim > 0) {
          expect(() => builder.elementaryVector(dim, 0)).not.to.throw();
          expect(() => builder.elementaryVector(dim, dim - 1)).not.to.throw();
        }
        expect(() => builder.elementaryVector(dim, dim)).to.throw();
        expect(() => builder.elementaryVector(dim, dim + 1)).to.throw();
      }
    });
  });

  describe('concatenate', () => {
    it('concatenates two non-empty vectors', () => {
      const first = builder.fromData([1, 2, 3]);
      const second = builder.fromData([4, 5, 6]);
      const firstSecond = builder.fromData([1, 2, 3, 4, 5, 6]);
      const secondFirst = builder.fromData([4, 5, 6, 1, 2, 3]);
      expect(builder.concatenate(first, second).equals(firstSecond)).to.be.true;
      expect(builder.concatenate(second, first).equals(secondFirst)).to.be.true;
    });

    it('handles empty vectors', () => {
      const empty = builder.empty();
      const nonEmpty = builder.fromData([1, 2, 3]);

      expect(builder.concatenate(empty, empty).equals(empty)).to.be.true;
      expect(builder.concatenate(empty, nonEmpty).equals(nonEmpty)).to.be.true;
      expect(builder.concatenate(nonEmpty, empty).equals(nonEmpty)).to.be.true;
    });
  });
});
