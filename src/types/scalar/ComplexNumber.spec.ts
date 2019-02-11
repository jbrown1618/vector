import { expect } from 'chai';
import { describe, it } from 'mocha';
import { approximatelyEqual } from '../../utilities/NumberUtilities';
import { ComplexNumber } from './ComplexNumber';

describe('ComplexNumber', () => {
  describe('getRealPart', () => {
    it('returns the real part of a complex number', () => {
      expect(ComplexNumber.ONE.getRealPart()).to.equal(1);
      expect(ComplexNumber.ZERO.getRealPart()).to.equal(0);
      expect(ComplexNumber.I.getRealPart()).to.equal(0);
      expect(ComplexNumber.NEG_ONE.getRealPart()).to.equal(-1);
      expect(new ComplexNumber(3.14, 2.71).getRealPart()).to.equal(3.14);
    });
  });

  describe('getImaginaryPart', () => {
    it('returns the imaginary part of a complex number', () => {
      expect(ComplexNumber.ONE.getImaginaryPart()).to.equal(0);
      expect(ComplexNumber.ZERO.getImaginaryPart()).to.equal(0);
      expect(ComplexNumber.I.getImaginaryPart()).to.equal(1);
      expect(ComplexNumber.NEG_ONE.getImaginaryPart()).to.equal(0);
      expect(new ComplexNumber(3.14, 2.71).getImaginaryPart()).to.equal(2.71);
    });
  });

  describe('add', () => {
    it('adds two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const sum = first.add(second);
        expect(sum.getRealPart()).to.equal(r1 + r2);
        expect(sum.getImaginaryPart()).to.equal(i1 + i2);
      });
    });

    it('is reflexive', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        expect(first.add(second).equals(second.add(first))).to.be.true;
      });
    });
  });

  describe('multiply', () => {
    it('multiplies two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const product = first.multiply(second);

        const expectedReal = r1 * r2 - i1 * i2;
        const expectedImaginary = r1 * i2 + i1 * r2;
        expect(product.getRealPart()).to.be.approximately(expectedReal, 0.00001);
        expect(product.getImaginaryPart()).to.be.approximately(expectedImaginary, 0.00001);
      });
    });
  });

  describe('getAdditiveInverse', () => {
    it('returns the additive inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = value.getAdditiveInverse();

        let zero = value.add(inverse);
        expect(zero.equals(ComplexNumber.ZERO)).to.be.true;

        zero = inverse.add(value);
        expect(zero.equals(ComplexNumber.ZERO)).to.be.true;
      });
    });
  });

  describe('getMultiplicativeInverse', () => {
    it('returns the multiplicative inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = value.getMultiplicativeInverse();

        if (inverse === undefined) {
          expect(r === 0 && i === 0);
          return;
        }

        let one = value.multiply(inverse);
        expect(one.equals(ComplexNumber.ONE)).to.be.true;

        one = inverse.multiply(value);
        expect(one.equals(ComplexNumber.ONE)).to.be.true;
      });
    });
  });

  describe('equals', () => {
    it('typical complex numbers equal themselves', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        expect(value.equals(value)).to.be.true;
      });
    });

    it('handles NaN', () => {
      const value = new ComplexNumber(NaN, NaN);
      expect(value.equals(value)).to.be.false;
    });

    it('handles infinities', () => {
      let value = new ComplexNumber(Infinity, Infinity);
      expect(value.equals(value)).to.be.false;

      value = new ComplexNumber(Infinity, -Infinity);
      expect(value.equals(value)).to.be.false;

      value = new ComplexNumber(-Infinity, Infinity);
      expect(value.equals(value)).to.be.false;

      value = new ComplexNumber(-Infinity, -Infinity);
      expect(value.equals(value)).to.be.false;
    });

    it('handles -0', () => {
      const value = new ComplexNumber(-0, -0);
      expect(value.equals(value)).to.be.true;
    });
  });

  describe('conjugate', () => {
    it('returns the complex conjugate of a number', () => {
      testComplexNumbers((r, i) => {
        const value = new ComplexNumber(r, i);
        const conj = value.conjugate();

        expect(conj.getRealPart()).to.equal(value.getRealPart());
        expect(conj.getImaginaryPart()).to.equal(value.getImaginaryPart() * -1);

        const product = value.multiply(conj);
        expect(approximatelyEqual(product.getImaginaryPart(), 0));
      });
    });
  });

  function testComplexNumbers(executeTest: (r: number, i: number) => void) {
    const values: number[] = [0, 1, 3.14, -2];
    values.forEach(realPart => {
      values.forEach(imaginaryPart => {
        executeTest(realPart, imaginaryPart);
      });
    });
  }

  function testComplexPairs(executeTest: (r1: number, i1: number, r2: number, i2: number) => void) {
    testComplexNumbers((r1, i1) => {
      testComplexNumbers((r2, i2) => {
        executeTest(r1, i1, r2, i2);
      });
    });
  }
});
