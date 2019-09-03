import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  columnSumSupremumNorm,
  euclideanNorm,
  frobeniusNorm,
  normalize,
  pNorm,
  rowSumSupremumNorm,
  sumNorm,
  supremumNorm
} from './Norms';
import { vec, mat, zeros } from '../utilities/aliases';

describe('Norms', () => {
  describe('Vector norms', () => {
    describe('normalize', () => {
      it('returns a vector scaled to have a norm of 1', () => {
        const v = vec([3, 4]);
        const expected = vec([3 / 5, 4 / 5]);
        const normalized = normalize(v);
        if (normalized === undefined) {
          expect(true).to.be.false; // Should not be undefined
          return;
        }
        expect(normalized.equals(expected)).to.be.true;
        expect(euclideanNorm(normalized)).to.equal(1);
      });

      it('handles the zero vector', () => {
        expect(normalize(vec([0, 0, 0, 0, 0]))).to.be.undefined;
      });

      it('handles the empty vector', () => {
        expect(normalize(vec([]))).to.be.undefined;
      });
    });

    describe('pNorm', () => {
      it('calculates the p-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(pNorm(v, 1)).to.equal(7);
        expect(pNorm(v, 2)).to.equal(5);
        expect(pNorm(v, 3)).to.equal(4.497941445275415);
      });

      it('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(pNorm(zero, 1)).to.equal(0);
        expect(pNorm(zero, 2)).to.equal(0);
        expect(pNorm(zero, 3)).to.equal(0);
      });

      it('handles the empty vector', () => {
        const empty = vec([]);
        expect(pNorm(empty, 1)).to.equal(0);
        expect(pNorm(empty, 2)).to.equal(0);
        expect(pNorm(empty, 3)).to.equal(0);
      });

      it('rejects p < 1', () => {
        const v = vec([3, 4]);
        [0, -1, -2].forEach(p => {
          expect(() => pNorm(v, p)).to.throw();
        });
      });
    });

    describe('sumNorm', () => {
      it('calculates the 1-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(sumNorm(v)).to.equal(7);
      });

      it('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(sumNorm(zero)).to.equal(0);
      });

      it('handles the empty vector', () => {
        const empty = vec([]);
        expect(sumNorm(empty)).to.equal(0);
      });
    });

    describe('euclideanNorm', () => {
      it('calculates the 2-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(euclideanNorm(v)).to.equal(5);
      });

      it('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(euclideanNorm(zero)).to.equal(0);
      });

      it('handles the empty vector', () => {
        const empty = vec([]);
        expect(euclideanNorm(empty)).to.equal(0);
      });
    });

    describe('supremumNorm', () => {
      it('calculates the infinity-norm of a vector', () => {
        const v = vec([3, 4]);
        expect(supremumNorm(v)).to.equal(4);
      });

      it('handles the zero vector', () => {
        const zero = vec([0, 0, 0, 0, 0]);
        expect(supremumNorm(zero)).to.equal(0);
      });

      it('handles the empty vector', () => {
        const empty = vec([]);
        expect(supremumNorm(empty)).to.equal(0);
      });
    });
  });

  describe('Matrix norms', () => {
    describe('frobeniusNorm', () => {
      it('calculates the Frobenius Norm of a matrix', () => {
        const A = mat([[1, 2], [3, 4]]);
        const norm = frobeniusNorm(A);
        expect(norm).to.equal(5.477225575051661);
      });

      it('handles the zero matrix', () => {
        const zero = zeros(5, 5);
        expect(frobeniusNorm(zero)).to.equal(0);
      });

      it('handles the empty matrix', () => {
        const empty = mat([]);
        expect(frobeniusNorm(empty)).to.equal(0);
      });
    });

    describe('columnSumSupremumNorm', () => {
      it('calculates the 1-norm of a matrix', () => {
        const A = mat([[1, 2], [3, 4]]);
        const norm = columnSumSupremumNorm(A);
        expect(norm).to.equal(6);
      });

      it('handles the zero matrix', () => {
        const zero = zeros(5, 5);
        expect(columnSumSupremumNorm(zero)).to.equal(0);
      });

      it('handles the empty matrix', () => {
        const empty = mat([]);
        expect(columnSumSupremumNorm(empty)).to.equal(0);
      });
    });

    describe('rowSumSupremumNorm', () => {
      it('calculates the infinity-norm of a matrix', () => {
        const A = mat([[1, 2], [3, 4]]);
        const norm = rowSumSupremumNorm(A);
        expect(norm).to.equal(7);
      });

      it('handles the zero matrix', () => {
        const zero = zeros(5, 5);
        expect(rowSumSupremumNorm(zero)).to.equal(0);
      });

      it('handles the empty matrix', () => {
        const empty = mat([]);
        expect(rowSumSupremumNorm(empty)).to.equal(0);
      });
    });
  });
});
