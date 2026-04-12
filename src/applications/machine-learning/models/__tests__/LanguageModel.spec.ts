import { LanguageModel } from '../LanguageModel';

describe('LanguageModel', () => {
  const tinyParams = {
    embedDim: 2,
    ffDim: 2,
    contextLength: 4,
    learningRate: 0.01,
    maxIterations: 2,
  };

  describe('constructor and defaults', () => {
    it('applies default hyperparameters', () => {
      const model = new LanguageModel();
      const hp = model.getHyperParameters();
      expect(hp.embedDim).toBe(8);
      expect(hp.ffDim).toBe(16);
      expect(hp.contextLength).toBe(16);
      expect(hp.learningRate).toBe(0.01);
      expect(hp.maxIterations).toBe(100);
    });

    it('merges partial hyperparameters with defaults', () => {
      const model = new LanguageModel({ embedDim: 4 });
      const hp = model.getHyperParameters();
      expect(hp.embedDim).toBe(4);
      expect(hp.ffDim).toBe(16);
    });
  });

  describe('forward', () => {
    it('produces valid probabilities', () => {
      const model = new LanguageModel(tinyParams);
      const probs = model.forward([1, 2, 3]);

      expect(probs.length).toBe(27);
      const sum = probs.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
      probs.forEach((p) => {
        expect(p).toBeGreaterThanOrEqual(0);
      });
    });

    it('works on an untrained model', () => {
      const model = new LanguageModel(tinyParams);
      const probs = model.forward([0]);

      expect(probs.length).toBe(27);
      const sum = probs.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });
  });

  describe('getParameterCount', () => {
    it('returns the correct count', () => {
      const model = new LanguageModel(tinyParams);
      const { embedDim, contextLength } = tinyParams;
      const vocabSize = 27;

      // Token embeddings + positional encodings + transformer block + output projection
      // Transformer block: 4*d*d + d*f + f + f*d + d
      const d = embedDim;
      const f = tinyParams.ffDim;
      const blockParams = 4 * d * d + d * f + f + f * d + d;
      const expected = vocabSize * d + contextLength * d + blockParams + d * vocabSize;

      expect(model.getParameterCount()).toBe(expected);
    });
  });

  describe('getParameters / setParameters', () => {
    it('survives a roundtrip', () => {
      const model = new LanguageModel(tinyParams);
      const params = model.getParameters();

      expect(params.length).toBe(model.getParameterCount());

      // Create a second model and load the same parameters
      const model2 = new LanguageModel(tinyParams);
      model2.setParameters(params);

      const params2 = model2.getParameters();
      expect(params2.length).toBe(params.length);
      params.forEach((val, i) => {
        expect(params2[i]).toBeCloseTo(val, 10);
      });
    });

    it('produces identical forward results after parameter transfer', () => {
      const model = new LanguageModel(tinyParams);
      const params = model.getParameters();
      const probs1 = model.forward([1, 2]);

      const model2 = new LanguageModel(tinyParams);
      model2.setParameters(params);
      const probs2 = model2.forward([1, 2]);

      probs1.forEach((val, i) => {
        expect(probs2[i]).toBeCloseTo(val, 10);
      });
    });
  });

  describe('train', () => {
    it('runs without error on a tiny corpus', () => {
      const model = new LanguageModel(tinyParams);
      expect(() => model.train('aaa')).not.toThrow();
    });
  });

  describe('generate', () => {
    it('produces a non-empty string', () => {
      const model = new LanguageModel(tinyParams);
      const result = model.generate('a', 2);
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result).toBe('string');
    });

    it('starts with the prompt', () => {
      const model = new LanguageModel(tinyParams);
      const result = model.generate('ab', 1);
      expect(result.slice(0, 2)).toBe('ab');
      expect(result.length).toBe(3);
    });
  });
});
