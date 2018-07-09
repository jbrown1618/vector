import { describe, it } from 'mocha';
import { expect } from 'chai';
import { NumberVector } from './NumberVector';

describe('NumberVector', () => {
  describe('constructors', () => {
    it('can be constructed from an array', () => {
      expect(NumberVector.fromData([1, 2, 3]).getData()).to.deep.equal([1, 2, 3]);
    });

    it('can be constructed from values', () => {
      expect(NumberVector.fromValues(1, 2, 3, 4).getData()).to.deep.equal([1, 2, 3, 4]);
    });

    it('handles the degenerate case', () => {
      expect(NumberVector.fromData([]).getDimension()).to.equal(0);
      expect(NumberVector.fromValues().getDimension()).to.equal(0);
    });
  });

  describe('getDimension', () => {
    it('returns the dimension of the vector', () => {
      expect(NumberVector.fromValues().getDimension()).to.equal(0);
      expect(NumberVector.fromValues(0).getDimension()).to.equal(1);
      expect(NumberVector.fromValues(0, 0).getDimension()).to.equal(2);
      expect(NumberVector.fromValues(0, 0, 0).getDimension()).to.equal(3);
    });
  });

  describe('add', () => {
    it('adds two vectors of equal dimension', () => {
      const first = NumberVector.fromData([1, 2, 3]);
      const second = NumberVector.fromData([4, 5, 6]);

      expect(first.add(second).getData()).to.deep.equal([5, 7, 9]);
    });

    it('throws an error when the dimensions do not match', () => {
      const vector2 = NumberVector.fromData([0, 0]);
      const vector3 = NumberVector.fromData([0, 0, 0]);

      expect(() => vector2.add(vector3)).to.throw();
    });

    it('handles the degenerate case', () => {
      const firstEmpty = NumberVector.fromValues();
      const secondEmpty = NumberVector.fromValues();
      const sum = firstEmpty.add(secondEmpty);

      expect(sum.getDimension()).to.equal(0);
      expect(sum.getData()).to.deep.equal([]);
    });
  });

  describe('scalarMultiply', () => {
    it('multiplies a vector by a scalar', () => {
      const vector = NumberVector.fromData([1, 2, 3]);

      expect(vector.scalarMultiply(2).getData()).to.deep.equal([2, 4, 6]);
    });

    it('handles the degenerate case', () => {
      const empty = NumberVector.fromValues();

      expect(empty.scalarMultiply(2).getDimension()).to.equal(0);
      expect(empty.scalarMultiply(2).getData()).to.deep.equal([]);
    });
  });

  describe('innerProduct', () => {
    it('computes a scalar product of two vectors', () => {
      const first = NumberVector.fromValues(2, 3, 4);
      const second = NumberVector.fromValues(3, 4, 5);

      expect(first.innerProduct(second)).to.equal(2 * 3 + 3 * 4 + 4 * 5);
    });

    it('throws an error when the dimensions do not match', () => {
      const vector2 = NumberVector.fromData([0, 0]);
      const vector3 = NumberVector.fromData([0, 0, 0]);

      expect(() => vector2.innerProduct(vector3)).to.throw();
    });

    it('handles the degenerate case', () => {
      const firstEmpty = NumberVector.fromValues();
      const secondEmpty = NumberVector.fromValues();

      expect(firstEmpty.innerProduct(secondEmpty)).to.equal(0);
    });
  });

  describe('outerProduct', () => {
    it('computes a matrix product of two vectors', () => {
      const first = NumberVector.fromValues(1, 2);
      const second = NumberVector.fromValues(3, 4, 5);
      const expectedData = [[3, 4, 5], [6, 8, 10]];

      expect(first.outerProduct(second).getData()).to.deep.equal(expectedData);
    });

    it('handles the degenerate case', () => {
      const empty = NumberVector.fromValues();
      const nonEmpty = NumberVector.fromValues(1, 2, 3);

      expect(empty.outerProduct(nonEmpty).getData()).to.deep.equal([]);
      expect(nonEmpty.outerProduct(empty).getData()).to.deep.equal([]);
    });
  });

  describe('equals', () => {
    it('returns true for an identical vector', () => {
      expect(NumberVector.fromValues(1, 2, 3).equals(NumberVector.fromValues(1, 2, 3))).to.be.true;
    });

    it('returns true for itself', () => {
      const vector = NumberVector.fromValues(1, 1, 1);
      expect(vector.equals(vector)).to.be.true;
    });

    it('handles the degenerate case', () => {
      expect(NumberVector.fromValues().equals(NumberVector.fromValues())).to.be.true;
    });

    it('returns false for a non-identical vector', () => {
      expect(NumberVector.fromValues(1, 2, 3).equals(NumberVector.fromValues(1, 3, 5))).to.be.false;
    });

    it('returns false when there is a dimension mismatch', () => {
      expect(NumberVector.fromValues(1, 2).equals(NumberVector.fromValues(1, 2, 3))).to.be.false;
      expect(NumberVector.fromValues(1, 2, 3).equals(NumberVector.fromValues(1, 2))).to.be.false;
    });
  });
});
