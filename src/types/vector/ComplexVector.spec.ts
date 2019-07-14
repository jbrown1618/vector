import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ComplexNumber } from '../scalar/ComplexNumber';
import { ComplexVector } from './ComplexVector';

describe('ComplexVector', () => {
  const builder = ComplexVector.builder();

  function complexify(data: number[]): ComplexNumber[] {
    return data.map(i => new ComplexNumber(i, 0));
  }

  describe('constructors', () => {
    it('can be constructed from an array', () => {
      const data = [ComplexNumber.ONE, new ComplexNumber(2, 0), new ComplexNumber(3, 0)];
      expect(builder.fromArray(data).toArray()).to.deep.equal(data);
    });

    it('can be constructed from values', () => {
      const data = complexify([1, 2, 3, 4]);
      expect(builder.fromValues(...data).toArray()).to.deep.equal(data);
    });

    it('handles the degenerate case', () => {
      expect(builder.fromArray([]).getDimension()).to.equal(0);
      expect(builder.fromValues().getDimension()).to.equal(0);
    });
  });

  describe('getDimension', () => {
    it('returns the dimension of the vector', () => {
      const vector0 = builder.fromValues();
      const vector1 = builder.fromValues(ComplexNumber.ZERO);
      const vector2 = builder.fromValues(ComplexNumber.ZERO, ComplexNumber.ZERO);
      const vector3 = builder.fromValues(
        ComplexNumber.ZERO,
        ComplexNumber.ZERO,
        ComplexNumber.ZERO
      );

      expect(vector0.getDimension()).to.equal(0);
      expect(vector1.getDimension()).to.equal(1);
      expect(vector2.getDimension()).to.equal(2);
      expect(vector3.getDimension()).to.equal(3);
    });
  });

  describe('add', () => {
    it('adds two vectors of equal dimension', () => {
      const first = builder.fromArray(complexify([1, 2, 3]));
      const second = builder.fromArray(complexify([4, 5, 6]));

      expect(first.add(second).toArray()).to.deep.equal([
        new ComplexNumber(5, 0),
        new ComplexNumber(7, 0),
        new ComplexNumber(9, 0)
      ]);
    });

    it('throws an error when the dimensions do not match', () => {
      const vector2 = builder.fromArray([ComplexNumber.ZERO, ComplexNumber.ZERO]);
      const vector3 = builder.fromArray([
        ComplexNumber.ZERO,
        ComplexNumber.ZERO,
        ComplexNumber.ZERO
      ]);

      expect(() => vector2.add(vector3)).to.throw();
    });

    it('handles the degenerate case', () => {
      const firstEmpty = builder.fromValues();
      const secondEmpty = builder.fromValues();
      const sum = firstEmpty.add(secondEmpty);

      expect(sum.getDimension()).to.equal(0);
      expect(sum.toArray()).to.deep.equal([]);
    });
  });

  describe('scalarMultiply', () => {
    it('multiplies a vector by a scalar', () => {
      const vector = builder.fromArray(complexify([1, 2, 3]));
      const scalar = new ComplexNumber(2, 0);

      expect(vector.scalarMultiply(scalar).toArray()).to.deep.equal(complexify([2, 4, 6]));
    });

    it('handles the degenerate case', () => {
      const empty = builder.fromValues();

      expect(empty.scalarMultiply(new ComplexNumber(2, 0)).getDimension()).to.equal(0);
      expect(empty.scalarMultiply(new ComplexNumber(2, 0)).toArray()).to.deep.equal([]);
    });
  });

  describe('innerProduct', () => {
    it('computes a scalar product of two vectors', () => {
      const first = new ComplexNumber(2, 1);
      const second = new ComplexNumber(3, -2);
      const third = new ComplexNumber(4, -1);
      const fourth = new ComplexNumber(5, 2);

      const v1 = builder.fromValues(first, second);
      const v2 = builder.fromValues(third, fourth);

      const expectedInnerProduct = first
        .multiply(third.conjugate())
        .add(second.multiply(fourth.conjugate())); // 18 - 10i

      expect(v1.innerProduct(v2)).to.deep.equal(expectedInnerProduct);
    });

    it('throws an error when the dimensions do not match', () => {
      const vector2 = builder.fromArray([ComplexNumber.ZERO, ComplexNumber.ZERO]);
      const vector3 = builder.fromArray([
        ComplexNumber.ZERO,
        ComplexNumber.ZERO,
        ComplexNumber.ZERO
      ]);

      expect(() => vector2.innerProduct(vector3)).to.throw();
    });

    it('handles the degenerate case', () => {
      const firstEmpty = builder.fromValues();
      const secondEmpty = builder.fromValues();

      expect(firstEmpty.innerProduct(secondEmpty)).to.deep.equal(ComplexNumber.ZERO);
    });
  });

  describe('outerProduct', () => {
    it('computes a matrix product of two vectors', () => {
      const first = builder.fromArray(complexify([1, 2]));
      const second = builder.fromArray(complexify([3, 4, 5]));
      const expectedData = [complexify([3, 4, 5]), complexify([6, 8, 10])];

      expect(first.outerProduct(second).toArray()).to.deep.equal(expectedData);
    });

    it('handles the degenerate case', () => {
      const empty = builder.fromArray([]);
      const nonEmpty = builder.fromArray(complexify([1, 2, 3]));

      expect(empty.outerProduct(nonEmpty).toArray()).to.deep.equal([]);
      expect(nonEmpty.outerProduct(empty).toArray()).to.deep.equal([]);
    });
  });

  describe('equals', () => {
    it('returns true for an identical vector', () => {
      const first = builder.fromArray(complexify([1, 2, 3]));
      const second = builder.fromArray(complexify([1, 2, 3]));

      expect(first.equals(second)).to.be.true;
    });

    it('returns true for itself', () => {
      const vector = builder.fromArray(complexify([1, 1, 1]));
      expect(vector.equals(vector)).to.be.true;
    });

    it('handles the degenerate case', () => {
      expect(builder.fromValues().equals(builder.fromValues())).to.be.true;
    });

    it('returns false for a non-identical vector', () => {
      const first = builder.fromArray(complexify([1, 2, 3]));
      const second = builder.fromArray(complexify([1, 3, 5]));

      expect(first.equals(second)).to.be.false;
    });

    it('returns false when there is a dimension mismatch', () => {
      const first = builder.fromArray(complexify([1, 2]));
      const second = builder.fromArray(complexify([1, 2, 3]));

      expect(first.equals(second)).to.be.false;
      expect(second.equals(first)).to.be.false;
    });
  });
});
