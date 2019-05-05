import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberVector } from './NumberVector';
import { SparseNumberVector } from './SparseNumberVector';

const configs = [
  {
    testClassName: 'NumberVector',
    builder: NumberVector.builder()
  },
  {
    testClassName: 'SparseNumberVector',
    builder: SparseNumberVector.builder()
  }
];

configs.forEach(({ testClassName, builder }) => {
  describe(testClassName, () => {
    describe('constructors', () => {
      it('can be constructed from an array', () => {
        expect(builder.fromData([1, 2, 3]).getData()).to.deep.equal([1, 2, 3]);
      });

      it('can be constructed from values', () => {
        expect(builder.fromValues(1, 2, 3, 4).getData()).to.deep.equal([1, 2, 3, 4]);
      });

      it('handles the degenerate case', () => {
        expect(builder.fromData([]).getDimension()).to.equal(0);
        expect(builder.fromValues().getDimension()).to.equal(0);
      });
    });

    describe('getDimension', () => {
      it('returns the dimension of the vector', () => {
        expect(builder.fromValues().getDimension()).to.equal(0);
        expect(builder.fromValues(0).getDimension()).to.equal(1);
        expect(builder.fromValues(0, 0).getDimension()).to.equal(2);
        expect(builder.fromValues(0, 0, 0).getDimension()).to.equal(3);
      });
    });

    describe('add', () => {
      it('adds two vectors of equal dimension', () => {
        const first = builder.fromData([1, 2, 3]);
        const second = builder.fromData([4, 5, 6]);

        expect(first.add(second).getData()).to.deep.equal([5, 7, 9]);
      });

      it('throws an error when the dimensions do not match', () => {
        const vector2 = builder.fromData([0, 0]);
        const vector3 = builder.fromData([0, 0, 0]);

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
        const vector = builder.fromData([1, 2, 3]);

        expect(vector.scalarMultiply(2).getData()).to.deep.equal([2, 4, 6]);
      });

      it('handles the degenerate case', () => {
        const empty = builder.fromValues();

        expect(empty.scalarMultiply(2).getDimension()).to.equal(0);
        expect(empty.scalarMultiply(2).getData()).to.deep.equal([]);
      });
    });

    describe('innerProduct', () => {
      it('computes a scalar product of two vectors', () => {
        const first = builder.fromValues(2, 3, 4);
        const second = builder.fromValues(3, 4, 5);

        expect(first.innerProduct(second)).to.equal(2 * 3 + 3 * 4 + 4 * 5);
      });

      it('throws an error when the dimensions do not match', () => {
        const vector2 = builder.fromData([0, 0]);
        const vector3 = builder.fromData([0, 0, 0]);

        expect(() => vector2.innerProduct(vector3)).to.throw();
      });

      it('handles the degenerate case', () => {
        const firstEmpty = builder.fromValues();
        const secondEmpty = builder.fromValues();

        expect(firstEmpty.innerProduct(secondEmpty)).to.equal(0);
      });
    });

    describe('outerProduct', () => {
      it('computes a matrix product of two vectors', () => {
        const first = builder.fromValues(1, 2);
        const second = builder.fromValues(3, 4, 5);
        const expectedData = [[3, 4, 5], [6, 8, 10]];

        expect(first.outerProduct(second).getData()).to.deep.equal(expectedData);
      });

      it('handles the degenerate case', () => {
        const empty = builder.fromValues();
        const nonEmpty = builder.fromValues(1, 2, 3);

        expect(empty.outerProduct(nonEmpty).getData()).to.deep.equal([]);
        expect(nonEmpty.outerProduct(empty).getData()).to.deep.equal([]);
      });
    });

    describe('equals', () => {
      it('returns true for an identical vector', () => {
        expect(builder.fromValues(1, 2, 3).equals(builder.fromValues(1, 2, 3))).to.be.true;
      });

      it('returns true for itself', () => {
        const vector = builder.fromValues(1, 1, 1);
        expect(vector.equals(vector)).to.be.true;
      });

      it('handles the degenerate case', () => {
        expect(builder.fromValues().equals(builder.fromValues())).to.be.true;
      });

      it('returns false for a non-identical vector', () => {
        expect(builder.fromValues(1, 2, 3).equals(builder.fromValues(1, 3, 5))).to.be.false;
      });

      it('returns false when there is a dimension mismatch', () => {
        expect(builder.fromValues(1, 2).equals(builder.fromValues(1, 2, 3))).to.be.false;
        expect(builder.fromValues(1, 2, 3).equals(builder.fromValues(1, 2))).to.be.false;
      });
    });

    describe('projectOnto', () => {
      it('calculates the projection of one vector onto another', () => {
        const v = builder.fromData([3, 2]);
        const e1 = builder.elementaryVector(2, 0);
        const e2 = builder.elementaryVector(2, 1);
        expect(v.projectOnto(e1)).to.deep.equal(builder.fromData([3, 0]));
        expect(v.projectOnto(e2)).to.deep.equal(builder.fromData([0, 2]));
      });

      it('rejects the zero-vector', () => {
        const v = builder.fromData([3, 2]);
        const zero = builder.zeros(2);
        expect(() => v.projectOnto(zero)).to.throw();
      });

      it('rejects a dimension mismatch', () => {
        const v1 = builder.ones(3);
        const v2 = builder.ones(2);
        expect(() => v1.projectOnto(v2)).to.throw();
      });
    });
  });
});
