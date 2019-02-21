import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberVector } from './NumberVector';

describe('VectorBuilder', () => {
  const builder = NumberVector.builder();

  describe('fromValues', () => {
    it('builds a vector whose elements are the provided arguments', () => {
      const data = [1, 2, 3, 4, 5];
      expect(builder.fromValues(...data).getData()).to.deep.equal(data);
    });

    it('handles no arguments', () => {
      expect(builder.fromValues().getData()).to.deep.equal([]);
    });
  });

  describe('fromData', () => {
    it('builds a vector from an array of data values', () => {
      const data = [1, 2, 3, 4, 5];
      expect(builder.fromData(data).getData()).to.deep.equal(data);
    });

    it('handles an empty array', () => {
      expect(builder.fromData([]).getData()).to.deep.equal([]);
    });
  });

  describe('fromSparseData', () => {
    it('builds a vector of all 0s except for the specified entries', () => {
      const sparseData: Map<number, number> = new Map();
      sparseData.set(3, 1);
      sparseData.set(4, 2);
      const V = builder.fromSparseData(6, sparseData);
      const expected = builder.fromData([0, 0, 0, 1, 2, 0]);
      expect(V.equals(expected)).to.be.true;
    });

    it('handles an empty map', () => {
      expect(builder.fromSparseData(5, new Map())).to.deep.equal(builder.zeros(5));
    });
  });

  describe('fromIndexFunction', () => {
    it('builds a vector whose values are determined by a function of their index', () => {
      const expected = builder.fromData([0, 2, 4, 6, 8]);
      expect(builder.fromIndexFunction(5, i => i * 2)).to.deep.equal(expected);
    });

    it('handles size 0', () => {
      expect(builder.fromIndexFunction(0, i => i)).to.deep.equal(builder.empty());
    });

    it('rejects a negative size', () => {
      expect(() => builder.fromIndexFunction(-1, i => i)).to.throw();
    });
  });

  describe('map', () => {
    it('builds a vector by transforming the values of another vector', () => {
      const original = builder.fromValues(1, 2, 3, 4);
      const expected = builder.fromValues(1, 3, 5, 7);
      expect(builder.map(original, (value, index) => value + index)).to.deep.equal(expected);
    });

    it('handles an empty vector', () => {
      expect(builder.map(builder.empty(), value => value + 1)).to.deep.equal(builder.empty());
    });
  });

  describe('empty', () => {
    it('returns an empty vector', () => {
      const E = builder.empty();
      expect(E.getDimension()).to.equal(0);
      expect(E.getData()).to.deep.equal([]);
    });
  });

  describe('fill', () => {
    it('builds a vector whose entries are all equal to the provided value', () => {
      const testForDimension = (dim: number, value: number) => {
        const filled = builder.fill(value, dim);
        expect(filled.getDimension()).to.equal(dim);
        const allCorrectValue = filled
          .getData()
          .map((entry: number) => entry === value)
          .reduce((all: boolean, current: boolean) => all && current, true);
        expect(allCorrectValue).to.be.true;
      };

      for (let dim = 0; dim < 10; dim++) {
        [-1, 0, 1, 2].forEach(value => {
          testForDimension(dim, value);
        });
      }
    });

    it('rejects a negative size', () => {
      expect(() => builder.fill(2, -1)).to.throw();
    });
  });

  describe('zeros', () => {
    it('constructs an all-zero vector', () => {
      const testForDimension = (dim: number) => {
        const zeros = builder.zeros(dim);
        expect(zeros.getDimension()).to.equal(dim);
        const allZero = zeros
          .getData()
          .map((entry: number) => entry === 0)
          .reduce((all: boolean, current: boolean) => all && current, true);
        expect(allZero).to.be.true;
      };

      for (let dim = 0; dim < 100; dim++) {
        testForDimension(dim);
      }
    });

    it('rejects a negative size', () => {
      expect(() => builder.zeros(-1)).to.throw();
    });
  });

  describe('ones', () => {
    it('constructs an all-one vector', () => {
      const testForDimension = (dim: number) => {
        const ones = builder.ones(dim);
        expect(ones.getDimension()).to.equal(dim);
        const allOne = ones
          .getData()
          .map(entry => entry === 1)
          .reduce((all, current) => all && current, true);
        expect(allOne).to.be.true;
      };

      for (let dim = 0; dim < 100; dim++) {
        testForDimension(dim);
      }
    });

    it('rejects a negative size', () => {
      expect(() => builder.ones(-1)).to.throw();
    });
  });

  describe('elementaryVector', () => {
    it('constructs a vector with all zeros, but a one in a particular position', () => {
      const testForDimensionAndPosition = (dim: number, pos: number) => {
        const e = builder.elementaryVector(dim, pos);
        expect(e.getDimension()).to.equal(dim);
        const allCorrect = e
          .getData()
          .map((entry, i) => entry === (i === pos ? 1 : 0))
          .reduce((all, current) => all && current, true);
        expect(allCorrect).to.be.true;
      };

      for (let dim = 0; dim < 25; dim++) {
        for (let pos = 0; pos < dim; pos++) {
          testForDimensionAndPosition(dim, pos);
        }
      }
    });

    it('throws an error when the index is out of bounds', () => {
      for (let dim = 0; dim < 100; dim++) {
        expect(() => builder.elementaryVector(dim, -1)).to.throw();
        if (dim > 0) {
          expect(() => builder.elementaryVector(dim, 0)).not.to.throw();
          expect(() => builder.elementaryVector(dim, dim - 1)).not.to.throw();
        }
        expect(() => builder.elementaryVector(dim, dim)).to.throw();
        expect(() => builder.elementaryVector(dim, dim + 1)).to.throw();
      }
    });
  });

  describe('rotate', () => {
    it('returns a new vector with the entries rotated', () => {
      const original = builder.fromData([1, 2, 3]);
      const rightOne = builder.rotate(original);
      const rightTwo = builder.rotate(original, 2);
      const rightThree = builder.rotate(original, 3);
      const leftOne = builder.rotate(original, 1, true);
      const leftTwo = builder.rotate(original, 2, true);

      const twoThreeOne = builder.fromData([2, 3, 1]);
      const threeOneTwo = builder.fromData([3, 1, 2]);

      expect(rightOne).to.deep.equal(twoThreeOne);
      expect(rightTwo).to.deep.equal(threeOneTwo);
      expect(rightThree).to.deep.equal(original);
      expect(leftOne).to.deep.equal(threeOneTwo);
      expect(leftTwo).to.deep.equal(twoThreeOne);
    });
  });

  describe('random', () => {
    it('constructs a vector of random numbers between min and max', () => {
      const bounds = [-1, 0, 1, 2];

      bounds.forEach(min => {
        bounds.forEach(max => {
          if (max > min) {
            const randomVector = builder.random(100, min, max);
            randomVector.getData().forEach(value => {
              expect(value).to.be.greaterThan(min);
              expect(value).to.be.lessThan(max);
            });
          }
        });
      });
    });

    it('defaults to min = 0 and max = 1', () => {
      const randomVector = builder.random(50);
      randomVector.getData().forEach(value => {
        expect(value).to.be.greaterThan(0);
        expect(value).to.be.lessThan(1);
      });
    });

    it('throws an error when min > max', () => {
      expect(() => builder.random(10, 1, 0)).to.throw();
    });
  });

  describe('randomNormal', () => {
    // Technically this test is non-deterministic and will fail in about 0.006% of cases
    // Ideally we would seed the RNG, but there doesn't seem to be a good way to do that

    it('constructs a vector of numbers randomly drawn from a normal distribution', () => {
      const means = [-1, 0, 1];
      const standardDeviations = [1, 2, 10];
      means.forEach(mean => {
        standardDeviations.forEach(standardDeviation => {
          const randomVector = builder.randomNormal(100, mean, standardDeviation);
          const average = randomVector.getData().reduce((accum, next) => accum + next, 0) / 100;

          const fourSamplingSDFromMean =
            4 * Math.sqrt((standardDeviation * standardDeviation) / 100);
          expect(Math.abs(average - mean)).to.be.lessThan(fourSamplingSDFromMean);
        });
      });
    });

    it('defaults to mean=0 and sd=1', () => {
      const randomVector = builder.randomNormal(100);
      const average = randomVector.getData().reduce((accum, next) => accum + next, 0) / 100;

      const fourSamplingSDFromMean = 0.4;
      expect(Math.abs(average)).to.be.lessThan(fourSamplingSDFromMean);
    });

    it('rejects a negative standard deviation', () => {
      expect(() => builder.randomNormal(1, 0, -1)).to.throw();
    });
  });

  describe('concatenate', () => {
    it('concatenates two non-empty vectors', () => {
      const first = builder.fromData([1, 2, 3]);
      const second = builder.fromData([4, 5, 6]);
      const firstSecond = builder.fromData([1, 2, 3, 4, 5, 6]);
      const secondFirst = builder.fromData([4, 5, 6, 1, 2, 3]);
      expect(builder.concatenate(first, second).equals(firstSecond)).to.be.true;
      expect(builder.concatenate(second, first).equals(secondFirst)).to.be.true;
    });

    it('handles empty vectors', () => {
      const empty = builder.empty();
      const nonEmpty = builder.fromData([1, 2, 3]);

      expect(builder.concatenate(empty, empty).equals(empty)).to.be.true;
      expect(builder.concatenate(empty, nonEmpty).equals(nonEmpty)).to.be.true;
      expect(builder.concatenate(nonEmpty, empty).equals(nonEmpty)).to.be.true;
    });
  });
});
