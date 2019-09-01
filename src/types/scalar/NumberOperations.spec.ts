import { expect } from 'chai';
import { describe, it } from 'mocha';
import { approximatelyEqual } from '../../utilities/NumberUtilities';
import { NumberOperations } from './NumberOperations';

describe('NumberOperations', () => {
  const ops = new NumberOperations();

  describe('fromNumber', () => {
    it('creates a number whose real part is the input', () => {
      [-1, 0, 1, 2].forEach(num => {
        expect(ops.fromNumber(num)).to.equal(num);
      });
    });
  });

  describe('fromComplex', () => {
    it('throws if there is an imaginary component', () => {
      expect(() => ops.fromComplex(1, 1)).to.throw();
    });

    it('returns a number for real-valued arguments', () => {
      expect(ops.fromComplex(1, 0)).to.equal(1);
    });
  });

  describe('conjugate', () => {
    it('returns the original number, since real numbers are their own conjugate', () => {
      testNumbers(n => {
        const conj = ops.conjugate(n);

        expect(conj).to.equal(n);

        const product = ops.multiply(n, conj);
        expect(approximatelyEqual(product, 0));
      });
    });
  });

  describe('getAdditiveIdentity', () => {
    it('returns 1', () => {
      expect(ops.getAdditiveIdentity()).to.equal(0);
    });
  });

  describe('getAdditiveInverse', () => {
    it('returns the additive inverse of a complex number', () => {
      testNumbers(n => {
        const inverse = ops.getAdditiveInverse(n);

        let zero = ops.add(n, inverse);
        expect(zero).to.equal(0);

        zero = ops.add(inverse, n);
        expect(zero).to.equal(0);
      });
    });
  });

  describe('getMultiplicativeIdentity', () => {
    it('returns 1', () => {
      expect(ops.getMultiplicativeIdentity()).to.equal(1);
    });
  });

  describe('getMultiplicativeInverse', () => {
    it('returns the multiplicative inverse of a complex number', () => {
      testNumbers(n => {
        const inverse = ops.getMultiplicativeInverse(n);

        if (inverse === undefined) {
          expect(n).to.equal(0);
          return;
        }

        let one = ops.multiply(n, inverse);
        expect(one).to.equal(1);

        one = ops.multiply(inverse, n);
        expect(one).to.equal(1);
      });
    });
  });

  describe('add', () => {
    it('adds two complex numbers', () => {
      testPairs((first, second) => {
        const sum = ops.add(first, second);
        expect(sum).to.equal(first + second);
      });
    });

    it('is reflexive', () => {
      testPairs((first, second) => {
        expect(ops.equals(ops.add(first, second), ops.add(second, first))).to.be.true;
      });
    });
  });

  describe('multiply', () => {
    it('multiplies two complex numbers', () => {
      testPairs((first, second) => {
        const product = ops.multiply(first, second);
        expect(product).to.equal(first * second);
      });
    });
  });

  describe('getPrincipalSquareRoot', () => {
    it('returns the positive square root', () => {
      testNumbers(n => {
        if (n < 0) {
          expect(ops.getPrincipalSquareRoot(n)).to.be.undefined;
        } else {
          expect(ops.getPrincipalSquareRoot(n)).to.equal(Math.sqrt(n));
        }
      });
    });
  });

  describe('norm', () => {
    it('returns the absolute value of the number', () => {
      testNumbers(n => {
        expect(ops.norm(n)).to.equal(Math.abs(n));
      });
    });
  });

  describe('equals', () => {
    it('typical complex numbers equal themselves', () => {
      testNumbers(n => {
        expect(ops.equals(n, n)).to.be.true;
      });
    });

    it('handles NaN', () => {
      expect(ops.equals(NaN, NaN)).to.be.false;
    });

    it('handles infinities', () => {
      expect(ops.equals(Infinity, Infinity)).to.be.false;
      expect(ops.equals(Infinity, -Infinity)).to.be.false;
      expect(ops.equals(-Infinity, Infinity)).to.be.false;
      expect(ops.equals(-Infinity, -Infinity)).to.be.false;
    });

    it('handles -0', () => {
      expect(ops.equals(-0, -0)).to.be.true;
    });
  });

  describe('random', () => {
    const rand = ops.random();
    expect(rand).to.be.lessThan(1);
    expect(rand).to.be.greaterThan(0);
  });

  describe('randomNormal', () => {
    const rand = ops.randomNormal();
    expect(rand).to.not.be.undefined;
    expect(rand).to.not.be.undefined;
  });

  function testNumbers(executeTest: (n: number) => void) {
    const values: number[] = [0, 1, 3.14, -2];
    values.forEach(value => {
      executeTest(value);
    });
  }

  function testPairs(executeTest: (n1: number, n2: number) => void) {
    const values: number[] = [0, 1, 3.14, -2];
    values.forEach(value1 => {
      values.forEach(value2 => {
        executeTest(value1, value2);
      });
    });
  }
});
