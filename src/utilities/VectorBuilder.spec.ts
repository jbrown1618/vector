import { describe, it } from 'mocha';
import { expect } from 'chai';
import { VectorBuilder } from './VectorBuilder';
import { NumberVector } from '../types/vector/NumberVector';

describe('VectorBuilder', () => {
  describe('empty', () => {
    it('returns an empty vector', () => {
      const E = new VectorBuilder(NumberVector).empty();
      expect(E.getDimension()).to.equal(0);
      expect(E.getData()).to.deep.equal([]);
    });
  });

  describe('zeros', () => {
    it('constructs an all-zero vector', () => {
      const testForDimension = (dim: number) => {
        const zeros = new VectorBuilder(NumberVector).zeros(dim);
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
  });

  describe('ones', () => {
    it('constructs an all-one vector', () => {
      const testForDimension = (dim: number) => {
        const ones = new VectorBuilder(NumberVector).ones(dim);
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
  });

  describe('elementaryVector', () => {
    it('constructs a vector with all zeros, but a one in a particular position', () => {
      const testForDimensionAndPosition = (dim: number, pos: number) => {
        const e = new VectorBuilder(NumberVector).elementaryVector(dim, pos);
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
        expect(() => new VectorBuilder(NumberVector).elementaryVector(dim, -1)).to.throw();
        if (dim > 0) {
          expect(() => new VectorBuilder(NumberVector).elementaryVector(dim, 0)).not.to.throw();
          expect(() =>
            new VectorBuilder(NumberVector).elementaryVector(dim, dim - 1)
          ).not.to.throw();
        }
        expect(() => new VectorBuilder(NumberVector).elementaryVector(dim, dim)).to.throw();
        expect(() => new VectorBuilder(NumberVector).elementaryVector(dim, dim + 1)).to.throw();
      }
    });
  });

  describe('concatenate', () => {
    it('concatenates two non-empty vectors', () => {
      const first = new VectorBuilder(NumberVector).fromData([1, 2, 3]);
      const second = new VectorBuilder(NumberVector).fromData([4, 5, 6]);
      const firstSecond = new VectorBuilder(NumberVector).fromData([1, 2, 3, 4, 5, 6]);
      const secondFirst = new VectorBuilder(NumberVector).fromData([4, 5, 6, 1, 2, 3]);
      expect(new VectorBuilder(NumberVector).concatenate(first, second).equals(firstSecond)).to.be
        .true;
      expect(new VectorBuilder(NumberVector).concatenate(second, first).equals(secondFirst)).to.be
        .true;
    });

    it('handles empty vectors', () => {
      const empty = new VectorBuilder(NumberVector).empty();
      const nonEmpty = new VectorBuilder(NumberVector).fromData([1, 2, 3]);

      expect(new VectorBuilder(NumberVector).concatenate(empty, empty).equals(empty)).to.be.true;
      expect(new VectorBuilder(NumberVector).concatenate(empty, nonEmpty).equals(nonEmpty)).to.be
        .true;
      expect(new VectorBuilder(NumberVector).concatenate(nonEmpty, empty).equals(nonEmpty)).to.be
        .true;
    });
  });
});
