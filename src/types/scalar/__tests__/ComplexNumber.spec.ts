import { approximatelyEqual } from '../../../utilities/NumberUtilities';
import { ComplexNumber } from '../ComplexNumber';

describe('ComplexNumber', () => {
  describe('getRealPart', () => {
    test('returns the real part of a complex number', () => {
      expect(ComplexNumber.ONE.getRealPart()).toEqual(1);
      expect(ComplexNumber.ZERO.getRealPart()).toEqual(0);
      expect(ComplexNumber.I.getRealPart()).toEqual(0);
      expect(ComplexNumber.NEG_ONE.getRealPart()).toEqual(-1);
      expect(new ComplexNumber(3.14, 2.71).getRealPart()).toEqual(3.14);
    });
  });

  describe('getImaginaryPart', () => {
    test('returns the imaginary part of a complex number', () => {
      expect(ComplexNumber.ONE.getImaginaryPart()).toEqual(0);
      expect(ComplexNumber.ZERO.getImaginaryPart()).toEqual(0);
      expect(ComplexNumber.I.getImaginaryPart()).toEqual(1);
      expect(ComplexNumber.NEG_ONE.getImaginaryPart()).toEqual(0);
      expect(new ComplexNumber(3.14, 2.71).getImaginaryPart()).toEqual(2.71);
    });
  });

  describe('add', () => {
    test('adds two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const sum = first.add(second);
        expect(sum.getRealPart()).toEqual(r1 + r2);
        expect(sum.getImaginaryPart()).toEqual(i1 + i2);
      });
    });

    test('is reflexive', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        expect(first.add(second).equals(second.add(first))).toBe(true);
      });
    });
  });

  describe('multiply', () => {
    test('multiplies two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const product = first.multiply(second);

        const expectedReal = r1 * r2 - i1 * i2;
        const expectedImaginary = r1 * i2 + i1 * r2;
        expect(product.getRealPart()).toBeCloseTo(expectedReal, 5);
        expect(product.getImaginaryPart()).toBeCloseTo(expectedImaginary, 5);
      });
    });
  });

  describe('getAdditiveInverse', () => {
    test('returns the additive inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = value.getAdditiveInverse();

        let zero = value.add(inverse);
        expect(zero.equals(ComplexNumber.ZERO)).toBe(true);

        zero = inverse.add(value);
        expect(zero.equals(ComplexNumber.ZERO)).toBe(true);
      });
    });
  });

  describe('getMultiplicativeInverse', () => {
    test('returns the multiplicative inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = value.getMultiplicativeInverse();

        if (inverse === undefined) {
          expect(r === 0 && i === 0);
          return;
        }

        let one = value.multiply(inverse);
        expect(one.equals(ComplexNumber.ONE)).toBe(true);

        one = inverse.multiply(value);
        expect(one.equals(ComplexNumber.ONE)).toBe(true);
      });
    });
  });

  describe('equals', () => {
    test('typical complex numbers equal themselves', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        expect(value.equals(value)).toBe(true);
      });
    });

    test('handles NaN', () => {
      const value = new ComplexNumber(NaN, NaN);
      expect(value.equals(value)).toBe(false);
    });

    test('handles infinities', () => {
      let value = new ComplexNumber(Infinity, Infinity);
      expect(value.equals(value)).toBe(false);

      value = new ComplexNumber(Infinity, -Infinity);
      expect(value.equals(value)).toBe(false);

      value = new ComplexNumber(-Infinity, Infinity);
      expect(value.equals(value)).toBe(false);

      value = new ComplexNumber(-Infinity, -Infinity);
      expect(value.equals(value)).toBe(false);
    });

    test('handles -0', () => {
      const value = new ComplexNumber(-0, -0);
      expect(value.equals(value)).toBe(true);
    });
  });

  describe('conjugate', () => {
    test('returns the complex conjugate of a number', () => {
      testComplexNumbers((r, i) => {
        const value = new ComplexNumber(r, i);
        const conj = value.conjugate();

        expect(conj.getRealPart()).toEqual(value.getRealPart());
        expect(conj.getImaginaryPart()).toEqual(value.getImaginaryPart() * -1);

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
