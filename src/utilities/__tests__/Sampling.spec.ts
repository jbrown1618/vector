import { sampleFromDistribution, argmax } from '../Sampling';

describe('Sampling', () => {
  describe('sampleFromDistribution', () => {
    it('returns an index within the valid range', () => {
      const probs = [0.2, 0.3, 0.5];
      for (let i = 0; i < 50; i++) {
        const index = sampleFromDistribution(probs);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(probs.length);
      }
    });

    it('returns 0 for a single-element distribution', () => {
      expect(sampleFromDistribution([1.0])).toBe(0);
    });

    it('never picks a zero-probability option', () => {
      const probs = [0, 1, 0];
      for (let i = 0; i < 50; i++) {
        expect(sampleFromDistribution(probs)).toBe(1);
      }
    });

    it('throws for an empty distribution', () => {
      expect(() => sampleFromDistribution([])).toThrow('empty');
    });

    it('respects the distribution approximately', () => {
      const probs = [0.9, 0.1];
      const counts = [0, 0];
      const trials = 1000;
      for (let i = 0; i < trials; i++) {
        counts[sampleFromDistribution(probs)]++;
      }
      // With 1000 trials, p=0.9 should win the vast majority
      expect(counts[0]).toBeGreaterThan(trials * 0.7);
    });
  });

  describe('argmax', () => {
    it('returns the index of the largest value', () => {
      expect(argmax([1, 5, 3, 2])).toBe(1);
    });

    it('returns 0 for a single-element array', () => {
      expect(argmax([42])).toBe(0);
    });

    it('returns the first index in case of ties', () => {
      expect(argmax([3, 3, 1])).toBe(0);
    });

    it('handles negative values', () => {
      expect(argmax([-5, -1, -3])).toBe(1);
    });

    it('throws for an empty array', () => {
      expect(() => argmax([])).toThrow('empty');
    });
  });
});
