import { Tokenizer } from '../Tokenizer';

describe('Tokenizer', () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  describe('vocabSize', () => {
    it('returns 27', () => {
      expect(tokenizer.vocabSize).toBe(27);
    });
  });

  describe('encode', () => {
    it('encodes a simple string', () => {
      expect(tokenizer.encode('abc')).toEqual([1, 2, 3]);
    });

    it('encodes a space as 0', () => {
      expect(tokenizer.encode(' ')).toEqual([0]);
    });

    it('encodes a string with spaces', () => {
      expect(tokenizer.encode('hello world')).toEqual([8, 5, 12, 12, 15, 0, 23, 15, 18, 12, 4]);
    });

    it('lowercases input before encoding', () => {
      expect(tokenizer.encode('Hello')).toEqual(tokenizer.encode('hello'));
    });

    it('skips unknown characters such as digits and punctuation', () => {
      expect(tokenizer.encode('a1b!c')).toEqual([1, 2, 3]);
    });

    it('returns an empty array for an empty string', () => {
      expect(tokenizer.encode('')).toEqual([]);
    });

    it('returns an empty array for a string with only unknown characters', () => {
      expect(tokenizer.encode('123!@#')).toEqual([]);
    });

    it('encodes z as 26', () => {
      expect(tokenizer.encode('z')).toEqual([26]);
    });
  });

  describe('decode', () => {
    it('decodes a simple token array', () => {
      expect(tokenizer.decode([1, 2, 3])).toBe('abc');
    });

    it('decodes 0 as a space', () => {
      expect(tokenizer.decode([0])).toBe(' ');
    });

    it('decodes an empty array to an empty string', () => {
      expect(tokenizer.decode([])).toBe('');
    });

    it('skips out-of-range token IDs', () => {
      expect(tokenizer.decode([1, 99, 2])).toBe('ab');
    });
  });

  describe('encode/decode roundtrip', () => {
    it('roundtrips a lowercase string', () => {
      const text = 'the quick brown fox';
      expect(tokenizer.decode(tokenizer.encode(text))).toBe(text);
    });

    it('roundtrips a single character', () => {
      expect(tokenizer.decode(tokenizer.encode('a'))).toBe('a');
    });

    it('roundtrips a space', () => {
      expect(tokenizer.decode(tokenizer.encode(' '))).toBe(' ');
    });

    it('roundtrips after lowercasing', () => {
      expect(tokenizer.decode(tokenizer.encode('ABC'))).toBe('abc');
    });
  });
});
