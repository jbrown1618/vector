import { expect } from 'chai';
import {
  approximatelyEqual,
  binomial,
  factorial,
  mod,
  random,
  randomNormal
} from './NumberUtilities';

describe('NumberUtilities', () => {
  describe('approximatelyEqual', () => {
    it('returns true for numbers within the tolerance', () => {
      const tolerances = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      const numbers = [0, 1, -1, 3.14, -2.71];

      tolerances.forEach(tolerance => {
        numbers.forEach(n => {
          const offByALittle = n + tolerance / 1.1;
          expect(approximatelyEqual(n, offByALittle, tolerance)).to.be.true;
        });
      });
    });

    it('returns false for numbers outside the tolerance', () => {
      const tolerances = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      const numbers = [0, 1, -1, 3.14, -2.71];

      tolerances.forEach(tolerance => {
        numbers.forEach(n => {
          const offByTooMuch = n + tolerance * 1.1;
          expect(approximatelyEqual(n, offByTooMuch, tolerance)).to.be.false;
        });
      });
    });

    it('has a default tolerance of 1e-6', () => {
      const n = 1;
      const offByALittle = 1.0000009;
      const offByTooMuch = 1.0000011;
      expect(approximatelyEqual(n, offByALittle)).to.be.true;
      expect(approximatelyEqual(n, offByTooMuch)).to.be.false;
    });

    it('returns false for two NaNs', () => {
      expect(approximatelyEqual(NaN, NaN)).to.be.false;
    });

    it('returns false for two infinities', () => {
      expect(approximatelyEqual(Infinity, Infinity)).to.be.false;
      expect(approximatelyEqual(-Infinity, -Infinity)).to.be.false;
    });
  });

  describe('mod', () => {
    it('returns the modulus for a positive number, like %', () => {
      expect(mod(5, 3)).to.equal(2);
    });

    it('returns a positive modulus for a negative number, unlike %', () => {
      expect(mod(-1, 3)).to.equal(2);
    });
  });

  describe('factorial', () => {
    it('returns the factorial of the input', () => {
      const inputs = [0, 1, 2, 3, 4, 5, 20];
      const outputs = [1, 1, 2, 6, 24, 120, 2432902008176640000];

      inputs.forEach((num, i) => {
        expect(factorial(num)).to.equal(outputs[i]);
      });
    });
  });

  describe('random', () => {
    it('returns a number between 0 and 1', () => {
      for (let i = 0; i < 100; i++) {
        const result = random();
        expect(result).to.be.at.least(0);
        expect(result).to.be.at.most(1);
      }
    });

    it('returns a number between min and 1', () => {
      for (let i = 0; i < 100; i++) {
        const result = random(-1);
        expect(result).to.be.at.least(-1);
        expect(result).to.be.at.most(1);
      }
    });

    it('returns a number between min and max', () => {
      for (let i = 0; i < 100; i++) {
        const result = random(5, 10);
        expect(result).to.be.at.least(5);
        expect(result).to.be.at.most(10);
      }
    });
  });

  describe('randomNormal', () => {
    const means = [0, -1, 1, 100];
    const stddevs = [1, 2, 3, 50];
    const sampleSizes = [1, 2, 50, 100];

    // Hard to test.  Just exercise the code and make sure you get results.
    it('yields results for the default arguments', () => {
      expect(randomNormal()).to.not.be.undefined;
    });

    it('yields results for a specified mean', () => {
      means.forEach(mean => {
        expect(randomNormal(mean)).to.not.be.undefined;
      });
    });

    it('yields results for a specified mean and standard deviation', () => {
      means.forEach(mean => {
        stddevs.forEach(stddev => {
          expect(randomNormal(mean, stddev)).to.not.be.undefined;
        });
      });
    });

    it('yields results for a specified mean, standard deviation, and number of samples', () => {
      means.forEach(mean => {
        stddevs.forEach(stddev => {
          sampleSizes.forEach(n => {
            expect(randomNormal(mean, stddev, n)).to.not.be.undefined;
          });
        });
      });
    });
  });

  describe('binomial', () => {
    it('returns the binomial coefficients', () => {
      expect(binomial(0, 0)).to.equal(1);
      expect(binomial(1, 2)).to.equal(0);
      expect(binomial(2, 3)).to.equal(0);
      expect(binomial(7, 1)).to.equal(7);
      expect(binomial(10, 5)).to.equal(252);
      expect(binomial(50, 30)).to.equal(47129212243960);
    });
  });
});
