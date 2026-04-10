import { BigramLanguageModel } from '../BigramLanguageModel';

describe('BigramLanguageModel', () => {
  // A tiny deterministic corpus: a always precedes b, b always precedes c, c always precedes a
  const corpus = 'abcabcabcabcabcabc';

  describe('train', () => {
    it('learns deterministic bigram transitions', () => {
      const model = new BigramLanguageModel({ iterations: 200 });
      model.train(corpus);

      // After training, the most probable next character should match the pattern
      const probsA = model.nextCharacterProbabilities('a');
      const probsB = model.nextCharacterProbabilities('b');
      const probsC = model.nextCharacterProbabilities('c');

      // a -> b should be the dominant transition
      expect(probsA.get('b')!).toBeGreaterThan(0.8);
      // b -> c should be the dominant transition
      expect(probsB.get('c')!).toBeGreaterThan(0.8);
      // c -> a should be the dominant transition
      expect(probsC.get('a')!).toBeGreaterThan(0.8);
    });

    it('throws for text shorter than 2 characters', () => {
      const model = new BigramLanguageModel();
      expect(() => model.train('')).toThrow('at least 2 characters');
      expect(() => model.train('a')).toThrow('at least 2 characters');
    });
  });

  describe('loss', () => {
    it('returns a lower loss after training than a random baseline', () => {
      const model = new BigramLanguageModel({ iterations: 200 });
      model.train(corpus);

      const loss = model.loss(corpus);

      // For a 3-character vocab, random guessing gives -ln(1/3) ≈ 1.099
      // A well-trained model should do much better on its own training data
      expect(loss).toBeLessThan(0.5);
      expect(loss).toBeGreaterThanOrEqual(0);
    });

    it('throws before training', () => {
      const model = new BigramLanguageModel();
      expect(() => model.loss('ab')).toThrow('before training');
    });

    it('throws for short text', () => {
      const model = new BigramLanguageModel({ iterations: 10 });
      model.train(corpus);
      expect(() => model.loss('a')).toThrow('at least 2 characters');
    });

    it('throws for unknown characters', () => {
      const model = new BigramLanguageModel({ iterations: 10 });
      model.train(corpus);
      expect(() => model.loss('az')).toThrow('Unknown character');
    });
  });

  describe('generate', () => {
    it('produces output of the correct length', () => {
      const model = new BigramLanguageModel({ iterations: 50 });
      model.train(corpus);

      const result = model.generate('a', 10);
      // seed (1 char) + 10 generated chars
      expect(result.length).toBe(11);
      expect(result[0]).toBe('a');
    });

    it('only generates characters from the vocabulary', () => {
      const model = new BigramLanguageModel({ iterations: 50 });
      model.train(corpus);

      const result = model.generate('a', 20);
      for (const c of result) {
        expect(['a', 'b', 'c']).toContain(c);
      }
    });

    it('throws before training', () => {
      const model = new BigramLanguageModel();
      expect(() => model.generate('a', 5)).toThrow('before training');
    });

    it('throws for empty seed', () => {
      const model = new BigramLanguageModel({ iterations: 10 });
      model.train(corpus);
      expect(() => model.generate('', 5)).toThrow('non-empty');
    });

    it('throws for unknown seed characters', () => {
      const model = new BigramLanguageModel({ iterations: 10 });
      model.train(corpus);
      expect(() => model.generate('z', 5)).toThrow('Unknown character');
    });
  });

  describe('getHyperParameters', () => {
    it('returns defaults when none are provided', () => {
      const model = new BigramLanguageModel();
      const params = model.getHyperParameters();
      expect(params.learningRate).toBe(1.0);
      expect(params.iterations).toBe(100);
    });

    it('merges provided values with defaults', () => {
      const model = new BigramLanguageModel({ learningRate: 0.5 });
      const params = model.getHyperParameters();
      expect(params.learningRate).toBe(0.5);
      expect(params.iterations).toBe(100);
    });
  });

  describe('getLogits', () => {
    it('returns undefined before training', () => {
      const model = new BigramLanguageModel();
      expect(model.getLogits()).toBeUndefined();
    });

    it('returns a square matrix after training', () => {
      const model = new BigramLanguageModel({ iterations: 10 });
      model.train(corpus);
      const logits = model.getLogits()!;
      // vocab is {a, b, c} => 3x3
      expect(logits.getNumberOfRows()).toBe(3);
      expect(logits.getNumberOfColumns()).toBe(3);
    });
  });

  describe('getVocabulary', () => {
    it('returns undefined before training', () => {
      const model = new BigramLanguageModel();
      expect(model.getVocabulary()).toBeUndefined();
    });

    it('returns sorted unique characters after training', () => {
      const model = new BigramLanguageModel({ iterations: 10 });
      model.train(corpus);
      expect(model.getVocabulary()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('nextCharacterProbabilities', () => {
    it('returns a valid probability distribution', () => {
      const model = new BigramLanguageModel({ iterations: 50 });
      model.train(corpus);

      const probs = model.nextCharacterProbabilities('a');
      let sum = 0;
      probs.forEach((p) => {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
        sum += p;
      });
      expect(sum).toBeCloseTo(1.0);
    });

    it('throws for multi-character input', () => {
      const model = new BigramLanguageModel({ iterations: 10 });
      model.train(corpus);
      expect(() => model.nextCharacterProbabilities('ab')).toThrow('single character');
    });

    it('throws before training', () => {
      const model = new BigramLanguageModel();
      expect(() => model.nextCharacterProbabilities('a')).toThrow('before training');
    });
  });
});
