import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberVector } from '../types/vector/NumberVector';
import { crossProduct, tripleProduct } from './CrossProduct';

describe('CrossProduct', () => {
  describe('crossProduct', () => {
    it('calculates the cross product of two vectors', () => {
      const v = NumberVector.builder().fromArray([1, 2, 3]);
      const u = NumberVector.builder().fromArray([4, 5, 6]);
      const vCrossU = NumberVector.builder().fromArray([-3, 6, -3]);

      expect(crossProduct(v, u)).to.deep.equal(vCrossU);
      expect(crossProduct(u, v)).to.deep.equal(vCrossU.scalarMultiply(-1));
    });

    it('preserves the relationships among the unit vectors in R3', () => {
      const i = NumberVector.builder().fromArray([1, 0, 0]);
      const j = NumberVector.builder().fromArray([0, 1, 0]);
      const k = NumberVector.builder().fromArray([0, 0, 1]);

      expect(crossProduct(i, j)).to.deep.equal(k);
      expect(crossProduct(j, k)).to.deep.equal(i);
      expect(crossProduct(k, i)).to.deep.equal(j);
    });

    it('rejects vectors not in R3', () => {
      const v = NumberVector.builder().fromArray([1, 2, 3]);
      const u = NumberVector.builder().fromArray([1, 2]);

      expect(() => crossProduct(v, u)).to.throw();
      expect(() => crossProduct(u, v)).to.throw();
      expect(() => crossProduct(u, u)).to.throw();
    });
  });

  describe('tripleProduct', () => {
    it('caluclates the scalar triple product of two vectors', () => {
      const v = NumberVector.builder().fromArray([-2, 3, 1]);
      const u = NumberVector.builder().fromArray([0, 4, 0]);
      const w = NumberVector.builder().fromArray([-1, 3, 3]);

      const product = tripleProduct(v, u, w);
      expect(product).to.equal(-20);
    });

    it('rejects vectors not in R3', () => {
      const v = NumberVector.builder().fromArray([1, 2, 3]);
      const u = NumberVector.builder().fromArray([1, 2]);

      expect(() => tripleProduct(v, v, u)).to.throw();
      expect(() => tripleProduct(v, u, v)).to.throw();
      expect(() => tripleProduct(u, v, v)).to.throw();
      expect(() => tripleProduct(v, u, u)).to.throw();
      expect(() => tripleProduct(u, v, u)).to.throw();
      expect(() => tripleProduct(u, u, v)).to.throw();
      expect(() => tripleProduct(u, u, u)).to.throw();
    });
  });
});
