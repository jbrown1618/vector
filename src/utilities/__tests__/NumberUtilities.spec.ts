import {
  approximatelyEqual,
  binomial,
  factorial,
  mod,
  random,
  randomNormal
} from '../NumberUtilities';

describe('NumberUtilities', () => {
  describe('approximatelyEqual', () => {
    test('returns true for numbers within the tolerance', () => {
      const tolerances = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      const numbers = [0, 1, -1, 3.14, -2.71];

      tolerances.forEach(tolerance => {
        numbers.forEach(n => {
          const offByALittle = n + tolerance / 1.1;
          expect(approximatelyEqual(n, offByALittle, tolerance)).toBe(true);
        });
      });
    });

    test('returns false for numbers outside the tolerance', () => {
      const tolerances = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      const numbers = [0, 1, -1, 3.14, -2.71];

      tolerances.forEach(tolerance => {
        numbers.forEach(n => {
          const offByTooMuch = n + tolerance * 1.1;
          expect(approximatelyEqual(n, offByTooMuch, tolerance)).toBe(false);
        });
      });
    });

    test('has a default tolerance of 1e-6', () => {
      const n = 1;
      const offByALittle = 1.0000009;
      const offByTooMuch = 1.0000011;
      expect(approximatelyEqual(n, offByALittle)).toBe(true);
      expect(approximatelyEqual(n, offByTooMuch)).toBe(false);
    });

    test('returns false for two NaNs', () => {
      expect(approximatelyEqual(NaN, NaN)).toBe(false);
    });

    test('returns false for two infinities', () => {
      expect(approximatelyEqual(Infinity, Infinity)).toBe(false);
      expect(approximatelyEqual(-Infinity, -Infinity)).toBe(false);
    });
  });

  describe('mod', () => {
    test('returns the modulus for a positive number, like %', () => {
      expect(mod(5, 3)).toEqual(2);
    });

    test('returns a positive modulus for a negative number, unlike %', () => {
      expect(mod(-1, 3)).toEqual(2);
    });
  });

  describe('factorial', () => {
    test('returns the factorial of the input', () => {
      const inputs = [0, 1, 2, 3, 4, 5, 20];
      const outputs = [1, 1, 2, 6, 24, 120, 2432902008176640000];

      inputs.forEach((num, i) => {
        expect(factorial(num)).toEqual(outputs[i]);
      });
    });
  });

  describe('random', () => {
    test('returns a number between 0 and 1', () => {
      for (let i = 0; i < 100; i++) {
        const result = random();
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    });

    test('returns a number between min and 1', () => {
      for (let i = 0; i < 100; i++) {
        const result = random(-1);
        expect(result).toBeGreaterThanOrEqual(-1);
        expect(result).toBeLessThanOrEqual(1);
      }
    });

    test('returns a number between min and max', () => {
      for (let i = 0; i < 100; i++) {
        const result = random(5, 10);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('randomNormal', () => {
    const means = [0, -1, 1, 100];
    const stddevs = [1, 2, 3, 50];
    const sampleSizes = [1, 2, 50, 100];

    // Hard to test.  Just exercise the code and make sure you get results.
    test('yields results for the default arguments', () => {
      expect(randomNormal()).not.toBeUndefined;
    });

    test('yields results for a specified mean', () => {
      means.forEach(mean => {
        expect(randomNormal(mean)).not.toBeUndefined;
      });
    });

    test('yields results for a specified mean and standard deviation', () => {
      means.forEach(mean => {
        stddevs.forEach(stddev => {
          expect(randomNormal(mean, stddev)).not.toBeUndefined;
        });
      });
    });

    test('yields results for a specified mean, standard deviation, and number of samples', () => {
      means.forEach(mean => {
        stddevs.forEach(stddev => {
          sampleSizes.forEach(n => {
            expect(randomNormal(mean, stddev, n)).not.toBeUndefined;
          });
        });
      });
    });
  });

  describe('binomial', () => {
    test('returns the binomial coefficients', () => {
      expect(binomial(0, 0)).toEqual(1);
      expect(binomial(1, 2)).toEqual(0);
      expect(binomial(2, 3)).toEqual(0);
      expect(binomial(7, 1)).toEqual(7);
      expect(binomial(10, 5)).toEqual(252);
      expect(binomial(50, 30)).toEqual(47129212243960);
    });
  });
});
