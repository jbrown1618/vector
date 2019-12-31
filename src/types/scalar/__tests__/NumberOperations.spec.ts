import { approximatelyEqual } from '../../../utilities/NumberUtilities';
import { NumberOperations } from '../NumberOperations';

describe('NumberOperations', () => {
  const ops = new NumberOperations();

  describe('fromNumber', () => {
    test('creates a number whose real part is the input', () => {
      [-1, 0, 1, 2].forEach(num => {
        expect(ops.fromNumber(num)).toEqual(num);
      });
    });
  });

  describe('fromComplex', () => {
    test('throws if there is an imaginary component', () => {
      expect(() => ops.fromComplex(1, 1)).toThrow();
    });

    test('returns a number for real-valued arguments', () => {
      expect(ops.fromComplex(1, 0)).toEqual(1);
    });
  });

  describe('conjugate', () => {
    test('returns the original number, since real numbers are their own conjugate', () => {
      testNumbers(n => {
        const conj = ops.conjugate(n);

        expect(conj).toEqual(n);

        const product = ops.multiply(n, conj);
        expect(approximatelyEqual(product, 0));
      });
    });
  });

  describe('getAdditiveIdentity', () => {
    test('returns 1', () => {
      expect(ops.getAdditiveIdentity()).toEqual(0);
    });
  });

  describe('getAdditiveInverse', () => {
    test('returns the additive inverse of a complex number', () => {
      testNumbers(n => {
        const inverse = ops.getAdditiveInverse(n);

        let zero = ops.add(n, inverse);
        expect(zero).toEqual(0);

        zero = ops.add(inverse, n);
        expect(zero).toEqual(0);
      });
    });
  });

  describe('getMultiplicativeIdentity', () => {
    test('returns 1', () => {
      expect(ops.getMultiplicativeIdentity()).toEqual(1);
    });
  });

  describe('getMultiplicativeInverse', () => {
    test('returns the multiplicative inverse of a complex number', () => {
      testNumbers(n => {
        const inverse = ops.getMultiplicativeInverse(n);

        if (inverse === undefined) {
          expect(n).toEqual(0);
          return;
        }

        let one = ops.multiply(n, inverse);
        expect(one).toEqual(1);

        one = ops.multiply(inverse, n);
        expect(one).toEqual(1);
      });
    });
  });

  describe('add', () => {
    test('adds two complex numbers', () => {
      testPairs((first, second) => {
        const sum = ops.add(first, second);
        expect(sum).toEqual(first + second);
      });
    });

    test('is reflexive', () => {
      testPairs((first, second) => {
        expect(ops.equals(ops.add(first, second), ops.add(second, first))).toBe(true);
      });
    });
  });

  describe('multiply', () => {
    test('multiplies two complex numbers', () => {
      testPairs((first, second) => {
        const product = ops.multiply(first, second);
        expect(product).toEqual(first * second);
      });
    });
  });

  describe('getPrincipalSquareRoot', () => {
    test('returns the positive square root', () => {
      testNumbers(n => {
        if (n < 0) {
          expect(ops.getPrincipalSquareRoot(n)).toBeUndefined;
        } else {
          expect(ops.getPrincipalSquareRoot(n)).toEqual(Math.sqrt(n));
        }
      });
    });
  });

  describe('norm', () => {
    test('returns the absolute value of the number', () => {
      testNumbers(n => {
        expect(ops.norm(n)).toEqual(Math.abs(n));
      });
    });
  });

  describe('equals', () => {
    test('typical complex numbers equal themselves', () => {
      testNumbers(n => {
        expect(ops.equals(n, n)).toBe(true);
      });
    });

    test('handles NaN', () => {
      expect(ops.equals(NaN, NaN)).toBe(false);
    });

    test('handles infinities', () => {
      expect(ops.equals(Infinity, Infinity)).toBe(false);
      expect(ops.equals(Infinity, -Infinity)).toBe(false);
      expect(ops.equals(-Infinity, Infinity)).toBe(false);
      expect(ops.equals(-Infinity, -Infinity)).toBe(false);
    });

    test('handles -0', () => {
      expect(ops.equals(-0, -0)).toBe(true);
    });
  });

  describe('random', () => {
    const rand = ops.random();
    expect(rand).toBeLessThan(1);
    expect(rand).toBeGreaterThan(0);
  });

  describe('randomNormal', () => {
    const rand = ops.randomNormal();
    expect(rand).not.toBeUndefined;
    expect(rand).not.toBeUndefined;
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
