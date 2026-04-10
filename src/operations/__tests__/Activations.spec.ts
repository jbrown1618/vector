import { softmax, softmaxArray, relu, reluArray, sigmoid, sigmoidArray } from '../Activations';
import { vec } from '../../utilities/aliases';

describe('Activations', () => {
  describe('softmaxArray', () => {
    it('returns probabilities that sum to 1', () => {
      const result = softmaxArray([1, 2, 3]);
      const sum = result.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0);
    });

    it('assigns the highest probability to the largest logit', () => {
      const result = softmaxArray([1, 5, 2]);
      expect(result[1]).toBeGreaterThan(result[0]);
      expect(result[1]).toBeGreaterThan(result[2]);
    });

    it('returns equal probabilities for equal logits', () => {
      const result = softmaxArray([3, 3, 3]);
      expect(result[0]).toBeCloseTo(1 / 3);
      expect(result[1]).toBeCloseTo(1 / 3);
      expect(result[2]).toBeCloseTo(1 / 3);
    });

    it('handles large values without overflow', () => {
      const result = softmaxArray([1000, 1001, 1002]);
      const sum = result.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0);
      expect(result.every((p) => isFinite(p))).toBe(true);
    });

    it('handles negative values', () => {
      const result = softmaxArray([-1, -2, -3]);
      const sum = result.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0);
      expect(result[0]).toBeGreaterThan(result[1]);
      expect(result[1]).toBeGreaterThan(result[2]);
    });

    it('returns an empty array for empty input', () => {
      expect(softmaxArray([])).toEqual([]);
    });

    it('returns [1] for a single element', () => {
      const result = softmaxArray([42]);
      expect(result).toEqual([1]);
    });
  });

  describe('softmax', () => {
    it('returns a Vector of probabilities that sum to 1', () => {
      const result = softmax(vec([1, 2, 3]));
      const sum = result.toArray().reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0);
      expect(result.getDimension()).toBe(3);
    });

    it('produces the same result as softmaxArray', () => {
      const input = [2, 5, 1, 3];
      const arrayResult = softmaxArray(input);
      const vectorResult = softmax(vec(input)).toArray();
      arrayResult.forEach((val, i) => {
        expect(vectorResult[i]).toBeCloseTo(val);
      });
    });
  });

  describe('reluArray', () => {
    it('zeroes out negative values', () => {
      expect(reluArray([-1, 0, 2, -3, 4])).toEqual([0, 0, 2, 0, 4]);
    });

    it('passes through positive values unchanged', () => {
      expect(reluArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('returns an empty array for empty input', () => {
      expect(reluArray([])).toEqual([]);
    });
  });

  describe('relu', () => {
    it('zeroes out negative entries', () => {
      const result = relu(vec([-1, 0, 2, -3, 4]));
      expect(result.toArray()).toEqual([0, 0, 2, 0, 4]);
    });
  });

  describe('sigmoidArray', () => {
    it('maps 0 to 0.5', () => {
      expect(sigmoidArray([0])[0]).toBeCloseTo(0.5);
    });

    it('maps large positive values close to 1', () => {
      expect(sigmoidArray([10])[0]).toBeCloseTo(1.0, 4);
    });

    it('maps large negative values close to 0', () => {
      expect(sigmoidArray([-10])[0]).toBeCloseTo(0.0, 4);
    });

    it('is symmetric: sigmoid(x) + sigmoid(-x) = 1', () => {
      const values = [0.5, 1, 2, 3];
      const pos = sigmoidArray(values);
      const neg = sigmoidArray(values.map((v) => -v));
      pos.forEach((p, i) => {
        expect(p + neg[i]).toBeCloseTo(1.0);
      });
    });

    it('returns an empty array for empty input', () => {
      expect(sigmoidArray([])).toEqual([]);
    });
  });

  describe('sigmoid', () => {
    it('produces the same result as sigmoidArray', () => {
      const input = [-2, -1, 0, 1, 2];
      const arrayResult = sigmoidArray(input);
      const vectorResult = sigmoid(vec(input)).toArray();
      arrayResult.forEach((val, i) => {
        expect(vectorResult[i]).toBeCloseTo(val);
      });
    });
  });
});
