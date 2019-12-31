import { ComplexNumber } from '../../scalar/ComplexNumber';
import { ComplexVector } from '../ComplexVector';
import { NumberVector } from '../NumberVector';

describe('VectorBuilder', () => {
  const builder = NumberVector.builder();

  describe('fromValues', () => {
    test('builds a vector whose elements are the provided arguments', () => {
      const data = [1, 2, 3, 4, 5];
      expect(builder.fromValues(...data).toArray()).toStrictEqual(data);
    });

    test('handles no arguments', () => {
      expect(builder.fromValues().toArray()).toStrictEqual([]);
    });
  });

  describe('fromArray', () => {
    test('builds a vector from an array of data values', () => {
      const data = [1, 2, 3, 4, 5];
      expect(builder.fromArray(data).toArray()).toStrictEqual(data);
    });

    test('handles an empty array', () => {
      expect(builder.fromArray([]).toArray()).toStrictEqual([]);
    });
  });

  describe('fromNumberArray', () => {
    test('builds a vector from an array of numbers', () => {
      const data = [1, 2, 3, 4, 5];
      expect(builder.fromNumberArray(data).toArray()).toStrictEqual(data);
    });

    test('builds a complex vector from numbers', () => {
      const data = [1, 2, 3];
      const expected = ComplexVector.builder().fromArray([
        new ComplexNumber(1, 0),
        new ComplexNumber(2, 0),
        new ComplexNumber(3, 0)
      ]);
      expect(ComplexVector.builder().fromNumberArray(data)).toStrictEqual(expected);
    });

    test('handles an empty array', () => {
      expect(builder.fromArray([]).toArray()).toStrictEqual([]);
    });
  });

  describe('fromSparseData', () => {
    test('builds a vector of all 0s except for the specified entries', () => {
      const sparseData: Map<number, number> = new Map();
      sparseData.set(3, 1);
      sparseData.set(4, 2);
      const V = builder.fromSparseData(6, sparseData);
      const expected = builder.fromArray([0, 0, 0, 1, 2, 0]);
      expect(V.equals(expected)).toBe(true);
    });

    test('handles an empty map', () => {
      expect(builder.fromSparseData(5, new Map())).toStrictEqual(builder.zeros(5));
    });
  });

  describe('fromIndexFunction', () => {
    test('builds a vector whose values are determined by a function of their index', () => {
      const expected = builder.fromArray([0, 2, 4, 6, 8]);
      expect(builder.fromIndexFunction(5, i => i * 2)).toStrictEqual(expected);
    });

    test('handles size 0', () => {
      expect(builder.fromIndexFunction(0, i => i)).toStrictEqual(builder.empty());
    });

    test('rejects a negative size', () => {
      expect(() => builder.fromIndexFunction(-1, i => i)).toThrow();
    });
  });

  describe('empty', () => {
    test('returns an empty vector', () => {
      const E = builder.empty();
      expect(E.getDimension()).toEqual(0);
      expect(E.toArray()).toStrictEqual([]);
    });
  });

  describe('fill', () => {
    test('builds a vector whose entries are all equal to the provided value', () => {
      const testForDimension = (dim: number, value: number) => {
        const filled = builder.fill(value, dim);
        expect(filled.getDimension()).toEqual(dim);
        const allCorrectValue = filled
          .toArray()
          .map((entry: number) => entry === value)
          .reduce((all: boolean, current: boolean) => all && current, true);
        expect(allCorrectValue).toBe(true);
      };

      for (let dim = 0; dim < 10; dim++) {
        [-1, 0, 1, 2].forEach(value => {
          testForDimension(dim, value);
        });
      }
    });

    test('rejects a negative size', () => {
      expect(() => builder.fill(2, -1)).toThrow();
    });
  });

  describe('zeros', () => {
    test('constructs an all-zero vector', () => {
      const testForDimension = (dim: number) => {
        const zeros = builder.zeros(dim);
        expect(zeros.getDimension()).toEqual(dim);
        const allZero = zeros
          .toArray()
          .map((entry: number) => entry === 0)
          .reduce((all: boolean, current: boolean) => all && current, true);
        expect(allZero).toBe(true);
      };

      for (let dim = 0; dim < 100; dim++) {
        testForDimension(dim);
      }
    });

    test('rejects a negative size', () => {
      expect(() => builder.zeros(-1)).toThrow();
    });
  });

  describe('ones', () => {
    test('constructs an all-one vector', () => {
      const testForDimension = (dim: number) => {
        const ones = builder.ones(dim);
        expect(ones.getDimension()).toEqual(dim);
        const allOne = ones
          .toArray()
          .map(entry => entry === 1)
          .reduce((all, current) => all && current, true);
        expect(allOne).toBe(true);
      };

      for (let dim = 0; dim < 100; dim++) {
        testForDimension(dim);
      }
    });

    test('rejects a negative size', () => {
      expect(() => builder.ones(-1)).toThrow();
    });
  });

  describe('elementaryVector', () => {
    test('constructs a vector with all zeros, but a one in a particular position', () => {
      const testForDimensionAndPosition = (dim: number, pos: number) => {
        const e = builder.elementaryVector(dim, pos);
        expect(e.getDimension()).toEqual(dim);
        const allCorrect = e
          .toArray()
          .map((entry, i) => entry === (i === pos ? 1 : 0))
          .reduce((all, current) => all && current, true);
        expect(allCorrect).toBe(true);
      };

      for (let dim = 0; dim < 25; dim++) {
        for (let pos = 0; pos < dim; pos++) {
          testForDimensionAndPosition(dim, pos);
        }
      }
    });

    test('throws an error when the index is out of bounds', () => {
      for (let dim = 0; dim < 100; dim++) {
        expect(() => builder.elementaryVector(dim, -1)).toThrow();
        if (dim > 0) {
          expect(() => builder.elementaryVector(dim, 0)).not.toThrow();
          expect(() => builder.elementaryVector(dim, dim - 1)).not.toThrow();
        }
        expect(() => builder.elementaryVector(dim, dim)).toThrow();
        expect(() => builder.elementaryVector(dim, dim + 1)).toThrow();
      }
    });
  });

  describe('shifted', () => {
    test('returns a new vector with the entries shifted by an offset', () => {
      const original = builder.fromArray([1, 2, 3]);
      const rightOne = builder.shift(original);
      const rightTwo = builder.shift(original, 2);
      const rightThree = builder.shift(original, 3);
      const leftOne = builder.shift(original, 1, true);
      const leftTwo = builder.shift(original, 2, true);

      const twoThreeOne = builder.fromArray([2, 3, 1]);
      const threeOneTwo = builder.fromArray([3, 1, 2]);

      expect(rightOne).toStrictEqual(twoThreeOne);
      expect(rightTwo).toStrictEqual(threeOneTwo);
      expect(rightThree).toStrictEqual(original);
      expect(leftOne).toStrictEqual(threeOneTwo);
      expect(leftTwo).toStrictEqual(twoThreeOne);
    });
  });

  describe('random', () => {
    test('constructs a vector of random numbers between min and max', () => {
      const bounds = [-1, 0, 1, 2];

      bounds.forEach(min => {
        bounds.forEach(max => {
          if (max > min) {
            const randomVector = builder.random(100, min, max);
            randomVector.toArray().forEach(value => {
              expect(value).toBeGreaterThan(min);
              expect(value).toBeLessThan(max);
            });
          }
        });
      });
    });

    test('defaults to min = 0 and max = 1', () => {
      const randomVector = builder.random(50);
      randomVector.toArray().forEach(value => {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThan(1);
      });
    });

    test('throws an error when min > max', () => {
      expect(() => builder.random(10, 1, 0)).toThrow();
    });
  });

  describe('randomNormal', () => {
    // Technically this test is non-deterministic and will fail in about 0.006% of cases
    // Ideally we would seed the RNG, but there doesn't seem to be a good way to do that

    test('constructs a vector of numbers randomly drawn from a normal distribution', () => {
      const means = [-1, 0, 1];
      const standardDeviations = [1, 2, 10];
      means.forEach(mean => {
        standardDeviations.forEach(standardDeviation => {
          const randomVector = builder.randomNormal(100, mean, standardDeviation);
          const average = randomVector.toArray().reduce((accum, next) => accum + next, 0) / 100;

          const fourSamplingSDFromMean =
            4 * Math.sqrt((standardDeviation * standardDeviation) / 100);
          expect(Math.abs(average - mean)).toBeLessThan(fourSamplingSDFromMean);
        });
      });
    });

    test('defaults to mean=0 and sd=1', () => {
      const randomVector = builder.randomNormal(100);
      const average = randomVector.toArray().reduce((accum, next) => accum + next, 0) / 100;

      const fourSamplingSDFromMean = 0.4;
      expect(Math.abs(average)).toBeLessThan(fourSamplingSDFromMean);
    });

    test('rejects a negative standard deviation', () => {
      expect(() => builder.randomNormal(1, 0, -1)).toThrow();
    });
  });

  describe('concatenate', () => {
    test('concatenates two non-empty vectors', () => {
      const first = builder.fromArray([1, 2, 3]);
      const second = builder.fromArray([4, 5, 6]);
      const firstSecond = builder.fromArray([1, 2, 3, 4, 5, 6]);
      const secondFirst = builder.fromArray([4, 5, 6, 1, 2, 3]);
      expect(builder.concatenate(first, second).equals(firstSecond)).toBe(true);
      expect(builder.concatenate(second, first).equals(secondFirst)).toBe(true);
    });

    test('handles empty vectors', () => {
      const empty = builder.empty();
      const nonEmpty = builder.fromArray([1, 2, 3]);

      expect(builder.concatenate(empty, empty).equals(empty)).toBe(true);
      expect(builder.concatenate(empty, nonEmpty).equals(nonEmpty)).toBe(true);
      expect(builder.concatenate(nonEmpty, empty).equals(nonEmpty)).toBe(true);
    });
  });
});
