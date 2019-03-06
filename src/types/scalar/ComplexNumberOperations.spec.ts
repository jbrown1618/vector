import { expect } from 'chai';
import { describe, it } from 'mocha';
import { approximatelyEqual } from '../../utilities/NumberUtilities';
import { ComplexNumber } from './ComplexNumber';
import { ComplexNumberOperations } from './ComplexNumberOperations';

describe('ComplexNumberOperations', () => {
  const ops = new ComplexNumberOperations();

  describe('fromNumber', () => {
    it('creates a complex number whose real part is the input', () => {
      [-1, 0, 1, 2].forEach(num => {
        expect(ops.fromNumber(num)).to.deep.equal(new ComplexNumber(num, 0));
      });
    });
  });

  describe('conjugate', () => {
    it('returns the complex conjugate of a number', () => {
      testComplexNumbers((r, i) => {
        const value = new ComplexNumber(r, i);
        const conj = ops.conjugate(value);

        expect(conj.getRealPart()).to.equal(value.getRealPart());
        expect(conj.getImaginaryPart()).to.equal(value.getImaginaryPart() * -1);

        const product = ops.multiply(value, conj);
        expect(approximatelyEqual(product.getImaginaryPart(), 0));
      });
    });
  });

  describe('getAdditiveIdentity', () => {
    it('returns 1', () => {
      expect(ops.getAdditiveIdentity()).to.deep.equal(ComplexNumber.ZERO);
    });
  });

  describe('getAdditiveInverse', () => {
    it('returns the additive inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = ops.getAdditiveInverse(value);

        let zero = ops.add(value, inverse);
        expect(zero.equals(ComplexNumber.ZERO)).to.be.true;

        zero = ops.add(inverse, value);
        expect(zero.equals(ComplexNumber.ZERO)).to.be.true;
      });
    });
  });

  describe('getMultiplicativeIdentity', () => {
    it('returns 1', () => {
      expect(ops.getMultiplicativeIdentity()).to.deep.equal(ComplexNumber.ONE);
    });
  });

  describe('getMultiplicativeInverse', () => {
    it('returns the multiplicative inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = ops.getMultiplicativeInverse(value);

        if (inverse === undefined) {
          expect(r === 0 && i === 0);
          return;
        }

        let one = ops.multiply(value, inverse);
        expect(one.equals(ComplexNumber.ONE)).to.be.true;

        one = ops.multiply(inverse, value);
        expect(one.equals(ComplexNumber.ONE)).to.be.true;
      });
    });
  });

  describe('add', () => {
    it('adds two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const sum = ops.add(first, second);
        expect(sum.getRealPart()).to.equal(r1 + r2);
        expect(sum.getImaginaryPart()).to.equal(i1 + i2);
      });
    });

    it('is reflexive', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        expect(ops.equals(ops.add(first, second), ops.add(second, first))).to.be.true;
      });
    });
  });

  describe('multiply', () => {
    it('multiplies two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const product = ops.multiply(first, second);

        const expectedReal = r1 * r2 - i1 * i2;
        const expectedImaginary = r1 * i2 + i1 * r2;
        expect(product.getRealPart()).to.be.approximately(expectedReal, 0.00001);
        expect(product.getImaginaryPart()).to.be.approximately(expectedImaginary, 0.00001);
      });
    });
  });

  describe('getPrincipalSquareRoot', () => {
    it('returns the square root with a positive real part', () => {
      expect(ops.getPrincipalSquareRoot(ComplexNumber.ZERO)).to.deep.equal(ComplexNumber.ZERO);
      expect(ops.getPrincipalSquareRoot(ComplexNumber.ONE)).to.deep.equal(ComplexNumber.ONE);
      expect(ops.getPrincipalSquareRoot(ComplexNumber.I)).to.deep.equal(
        new ComplexNumber(0.7071067811865476, 0.7071067811865475)
      );
      expect(ops.getPrincipalSquareRoot(new ComplexNumber(1, 1))).to.deep.equal(
        new ComplexNumber(1.0986841134678098, 0.45508986056222733)
      );
      expect(ops.getPrincipalSquareRoot(new ComplexNumber(1, -0.2))).to.deep.equal(
        new ComplexNumber(1.0049387799061584, -0.09950854917683442)
      );
    });
  });

  describe('norm', () => {
    it('returns the euclidean norm of the complex number', () => {
      expect(ops.norm(ComplexNumber.ZERO)).to.deep.equal(0);
      expect(ops.norm(ComplexNumber.ONE)).to.deep.equal(1);
      expect(ops.norm(new ComplexNumber(7, 0))).to.deep.equal(7);
      expect(ops.norm(new ComplexNumber(0, 3))).to.deep.equal(3);
      expect(ops.norm(new ComplexNumber(3, 4))).to.deep.equal(5);
    });
  });

  describe('equals', () => {
    it('typical complex numbers equal themselves', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        expect(ops.equals(value, value)).to.be.true;
      });
    });

    it('handles NaN', () => {
      const value = new ComplexNumber(NaN, NaN);
      expect(ops.equals(value, value)).to.be.false;
    });

    it('handles infinities', () => {
      let value = new ComplexNumber(Infinity, Infinity);
      expect(ops.equals(value, value)).to.be.false;

      value = new ComplexNumber(Infinity, -Infinity);
      expect(ops.equals(value, value)).to.be.false;

      value = new ComplexNumber(-Infinity, Infinity);
      expect(ops.equals(value, value)).to.be.false;

      value = new ComplexNumber(-Infinity, -Infinity);
      expect(ops.equals(value, value)).to.be.false;
    });

    it('handles -0', () => {
      const value = new ComplexNumber(-0, -0);
      expect(ops.equals(value, value)).to.be.true;
    });
  });

  describe('random', () => {
    let rand = ops.random();
    expect(rand.getRealPart()).to.be.lessThan(1);
    expect(rand.getRealPart()).to.be.greaterThan(0);
    expect(rand.getImaginaryPart()).to.be.lessThan(1);
    expect(rand.getImaginaryPart()).to.be.greaterThan(0);

    rand = ops.random(-1);
    expect(rand.getRealPart()).to.be.lessThan(1);
    expect(rand.getRealPart()).to.be.greaterThan(-1);
    expect(rand.getImaginaryPart()).to.be.lessThan(1);
    expect(rand.getImaginaryPart()).to.be.greaterThan(-1);

    rand = ops.random(-5, 5);
    expect(rand.getRealPart()).to.be.lessThan(5);
    expect(rand.getRealPart()).to.be.greaterThan(-5);
    expect(rand.getImaginaryPart()).to.be.lessThan(5);
    expect(rand.getImaginaryPart()).to.be.greaterThan(-5);
  });

  describe('randomNormal', () => {
    let rand = ops.randomNormal();
    expect(rand.getRealPart()).to.not.be.undefined;
    expect(rand.getImaginaryPart()).to.not.be.undefined;

    rand = ops.randomNormal(1);
    expect(rand.getRealPart()).to.not.be.undefined;
    expect(rand.getImaginaryPart()).to.not.be.undefined;

    rand = ops.randomNormal(1, 2);
    expect(rand.getRealPart()).to.not.be.undefined;
    expect(rand.getImaginaryPart()).to.not.be.undefined;
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
