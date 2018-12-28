import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ComplexVector } from './ComplexVector';
import { ComplexNumber } from '../scalar/ComplexNumber';

describe('ComplexVector', () => {
  const builder = ComplexVector.builder();

  function complexify(data: number[]): ComplexNumber[] {
    return data.map(i => new ComplexNumber(i, 0));
  }

  describe('constructors', () => {
    it('can be constructed from an array', () => {
      const data = [ComplexNumber.ONE, new ComplexNumber(2, 0), new ComplexNumber(3, 0)];
      expect(builder.fromData(data).getData()).to.deep.equal(data);
    });

    it('can be constructed from values', () => {
      const data = complexify([1, 2, 3, 4]);
      expect(builder.fromValues(...data).getData()).to.deep.equal(data);
    });

    it('handles the degenerate case', () => {
      expect(builder.fromData([]).getDimension()).to.equal(0);
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
      const first = builder.fromData(complexify([1, 2, 3]));
      const second = builder.fromData(complexify([4, 5, 6]));

      expect(first.add(second).getData()).to.deep.equal([
        new ComplexNumber(5, 0),
        new ComplexNumber(7, 0),
        new ComplexNumber(9, 0)
      ]);
    });

    it('throws an error when the dimensions do not match', () => {
      const vector2 = builder.fromData([ComplexNumber.ZERO, ComplexNumber.ZERO]);
      const vector3 = builder.fromData([
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
      expect(sum.getData()).to.deep.equal([]);
    });
  });

  describe('scalarMultiply', () => {
    it('multiplies a vector by a scalar', () => {
      const vector = builder.fromData(complexify([1, 2, 3]));
      const scalar = new ComplexNumber(2, 0);

      expect(vector.scalarMultiply(scalar).getData()).to.deep.equal(complexify([2, 4, 6]));
    });

    it('handles the degenerate case', () => {
      const empty = builder.fromValues();

      expect(empty.scalarMultiply(new ComplexNumber(2, 0)).getDimension()).to.equal(0);
      expect(empty.scalarMultiply(new ComplexNumber(2, 0)).getData()).to.deep.equal([]);
    });
  });

  describe('innerProduct', () => {
    it('computes a scalar product of two vectors', () => {
      const two = new ComplexNumber(2, 0);
      const three = new ComplexNumber(3, 0);
      const four = new ComplexNumber(4, 0);
      const five = new ComplexNumber(5, 0);

      const first = builder.fromValues(two, three, four);
      const second = builder.fromValues(three, four, five);

      const expectedInnerProduct = two
        .multiply(three)
        .add(three.multiply(four))
        .add(four.multiply(five));

      expect(first.innerProduct(second)).to.deep.equal(expectedInnerProduct);
    });

    it('throws an error when the dimensions do not match', () => {
      const vector2 = builder.fromData([ComplexNumber.ZERO, ComplexNumber.ZERO]);
      const vector3 = builder.fromData([
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
      const first = builder.fromData(complexify([1, 2]));
      const second = builder.fromData(complexify([3, 4, 5]));
      const expectedData = [complexify([3, 4, 5]), complexify([6, 8, 10])];

      expect(first.outerProduct(second).getData()).to.deep.equal(expectedData);
    });

    it('handles the degenerate case', () => {
      const empty = builder.fromData([]);
      const nonEmpty = builder.fromData(complexify([1, 2, 3]));

      expect(empty.outerProduct(nonEmpty).getData()).to.deep.equal([]);
      expect(nonEmpty.outerProduct(empty).getData()).to.deep.equal([]);
    });
  });

  describe('equals', () => {
    it('returns true for an identical vector', () => {
      const first = builder.fromData(complexify([1, 2, 3]));
      const second = builder.fromData(complexify([1, 2, 3]));

      expect(first.equals(second)).to.be.true;
    });

    it('returns true for itself', () => {
      const vector = builder.fromData(complexify([1, 1, 1]));
      expect(vector.equals(vector)).to.be.true;
    });

    it('handles the degenerate case', () => {
      expect(builder.fromValues().equals(builder.fromValues())).to.be.true;
    });

    it('returns false for a non-identical vector', () => {
      const first = builder.fromData(complexify([1, 2, 3]));
      const second = builder.fromData(complexify([1, 3, 5]));

      expect(first.equals(second)).to.be.false;
    });

    it('returns false when there is a dimension mismatch', () => {
      const first = builder.fromData(complexify([1, 2]));
      const second = builder.fromData(complexify([1, 2, 3]));

      expect(first.equals(second)).to.be.false;
      expect(second.equals(first)).to.be.false;
    });
  });
});
