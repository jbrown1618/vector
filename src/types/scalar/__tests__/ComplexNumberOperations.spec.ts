import { approximatelyEqual } from '../../../utilities/NumberUtilities';
import { ComplexNumber } from '../ComplexNumber';
import { ComplexNumberOperations } from '../ComplexNumberOperations';

describe('ComplexNumberOperations', () => {
  const ops = new ComplexNumberOperations();

  describe('fromNumber', () => {
    test('creates a complex number whose real part is the input', () => {
      [-1, 0, 1, 2].forEach(num => {
        expect(ops.fromNumber(num)).toStrictEqual(new ComplexNumber(num, 0));
      });
    });
  });

  describe('fromComplex', () => {
    test('returns a complex number with the correct components', () => {
      expect(ops.fromComplex(2, 3)).toStrictEqual(new ComplexNumber(2, 3));
    });
  });

  describe('conjugate', () => {
    test('returns the complex conjugate of a number', () => {
      testComplexNumbers((r, i) => {
        const value = new ComplexNumber(r, i);
        const conj = ops.conjugate(value);

        expect(conj.getRealPart()).toEqual(value.getRealPart());
        expect(conj.getImaginaryPart()).toEqual(value.getImaginaryPart() * -1);

        const product = ops.multiply(value, conj);
        expect(approximatelyEqual(product.getImaginaryPart(), 0));
      });
    });
  });

  describe('getAdditiveIdentity', () => {
    test('returns 1', () => {
      expect(ops.getAdditiveIdentity()).toStrictEqual(ComplexNumber.ZERO);
    });
  });

  describe('getAdditiveInverse', () => {
    test('returns the additive inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = ops.getAdditiveInverse(value);

        let zero = ops.add(value, inverse);
        expect(zero.equals(ComplexNumber.ZERO)).toBe(true);

        zero = ops.add(inverse, value);
        expect(zero.equals(ComplexNumber.ZERO)).toBe(true);
      });
    });
  });

  describe('getMultiplicativeIdentity', () => {
    test('returns 1', () => {
      expect(ops.getMultiplicativeIdentity()).toStrictEqual(ComplexNumber.ONE);
    });
  });

  describe('getMultiplicativeInverse', () => {
    test('returns the multiplicative inverse of a complex number', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        const inverse = ops.getMultiplicativeInverse(value);

        if (inverse === undefined) {
          expect(r === 0 && i === 0);
          return;
        }

        let one = ops.multiply(value, inverse);
        expect(one.equals(ComplexNumber.ONE)).toBe(true);

        one = ops.multiply(inverse, value);
        expect(one.equals(ComplexNumber.ONE)).toBe(true);
      });
    });
  });

  describe('add', () => {
    test('adds two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const sum = ops.add(first, second);
        expect(sum.getRealPart()).toEqual(r1 + r2);
        expect(sum.getImaginaryPart()).toEqual(i1 + i2);
      });
    });

    test('is reflexive', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        expect(ops.equals(ops.add(first, second), ops.add(second, first))).toBe(true);
      });
    });
  });

  describe('multiply', () => {
    test('multiplies two complex numbers', () => {
      testComplexPairs((r1: number, i1: number, r2: number, i2: number) => {
        const first = new ComplexNumber(r1, i1);
        const second = new ComplexNumber(r2, i2);
        const product = ops.multiply(first, second);

        const expectedReal = r1 * r2 - i1 * i2;
        const expectedImaginary = r1 * i2 + i1 * r2;
        expect(product.getRealPart()).toBeCloseTo(expectedReal, 5);
        expect(product.getImaginaryPart()).toBeCloseTo(expectedImaginary, 5);
      });
    });
  });

  describe('getPrincipalSquareRoot', () => {
    test('returns the square root with a positive real part', () => {
      expect(ops.getPrincipalSquareRoot(ComplexNumber.ZERO)).toStrictEqual(ComplexNumber.ZERO);
      expect(ops.getPrincipalSquareRoot(ComplexNumber.ONE)).toStrictEqual(ComplexNumber.ONE);
      expect(ops.getPrincipalSquareRoot(ComplexNumber.I)).toStrictEqual(
        new ComplexNumber(0.7071067811865476, 0.7071067811865475)
      );
      expect(ops.getPrincipalSquareRoot(new ComplexNumber(1, 1))).toStrictEqual(
        new ComplexNumber(1.0986841134678098, 0.45508986056222733)
      );
      expect(ops.getPrincipalSquareRoot(new ComplexNumber(1, -0.2))).toStrictEqual(
        new ComplexNumber(1.0049387799061584, -0.09950854917683442)
      );
    });

    test('returns the square root of a negative number', () => {
      expect(ops.getPrincipalSquareRoot(ComplexNumber.NEG_ONE)).toStrictEqual(ComplexNumber.I);
    });
  });

  describe('norm', () => {
    test('returns the euclidean norm of the complex number', () => {
      expect(ops.norm(ComplexNumber.ZERO)).toStrictEqual(0);
      expect(ops.norm(ComplexNumber.ONE)).toStrictEqual(1);
      expect(ops.norm(new ComplexNumber(7, 0))).toStrictEqual(7);
      expect(ops.norm(new ComplexNumber(0, 3))).toStrictEqual(3);
      expect(ops.norm(new ComplexNumber(3, 4))).toStrictEqual(5);
    });
  });

  describe('equals', () => {
    test('typical complex numbers equal themselves', () => {
      testComplexNumbers((r: number, i: number) => {
        const value = new ComplexNumber(r, i);
        expect(ops.equals(value, value)).toBe(true);
      });
    });

    test('handles NaN', () => {
      const value = new ComplexNumber(NaN, NaN);
      expect(ops.equals(value, value)).toBe(false);
    });

    test('handles infinities', () => {
      let value = new ComplexNumber(Infinity, Infinity);
      expect(ops.equals(value, value)).toBe(false);

      value = new ComplexNumber(Infinity, -Infinity);
      expect(ops.equals(value, value)).toBe(false);

      value = new ComplexNumber(-Infinity, Infinity);
      expect(ops.equals(value, value)).toBe(false);

      value = new ComplexNumber(-Infinity, -Infinity);
      expect(ops.equals(value, value)).toBe(false);
    });

    test('handles -0', () => {
      const value = new ComplexNumber(-0, -0);
      expect(ops.equals(value, value)).toBe(true);
    });
  });

  describe('random', () => {
    let rand = ops.random();
    expect(rand.getRealPart()).toBeLessThan(1);
    expect(rand.getRealPart()).toBeGreaterThan(0);
    expect(rand.getImaginaryPart()).toBeLessThan(1);
    expect(rand.getImaginaryPart()).toBeGreaterThan(0);

    rand = ops.random(-1);
    expect(rand.getRealPart()).toBeLessThan(1);
    expect(rand.getRealPart()).toBeGreaterThan(-1);
    expect(rand.getImaginaryPart()).toBeLessThan(1);
    expect(rand.getImaginaryPart()).toBeGreaterThan(-1);

    rand = ops.random(-5, 5);
    expect(rand.getRealPart()).toBeLessThan(5);
    expect(rand.getRealPart()).toBeGreaterThan(-5);
    expect(rand.getImaginaryPart()).toBeLessThan(5);
    expect(rand.getImaginaryPart()).toBeGreaterThan(-5);
  });

  describe('randomNormal', () => {
    let rand = ops.randomNormal();
    expect(rand.getRealPart()).not.toBeUndefined;
    expect(rand.getImaginaryPart()).not.toBeUndefined;

    rand = ops.randomNormal(1);
    expect(rand.getRealPart()).not.toBeUndefined;
    expect(rand.getImaginaryPart()).not.toBeUndefined;

    rand = ops.randomNormal(1, 2);
    expect(rand.getRealPart()).not.toBeUndefined;
    expect(rand.getImaginaryPart()).not.toBeUndefined;
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
