/**
 * A character-level tokenizer that maps lowercase a-z and space to integer indices.
 *
 * The vocabulary consists of 27 characters: space (index 0), then 'a' through 'z' (indices 1-26).
 * Input is lowercased before encoding; characters outside the vocabulary are skipped.
 * @public
 */
export class Tokenizer {
  private readonly _charToIndex: Map<string, number>;
  private readonly _indexToChar: Map<number, string>;

  constructor() {
    this._charToIndex = new Map();
    this._indexToChar = new Map();

    this._charToIndex.set(' ', 0);
    this._indexToChar.set(0, ' ');

    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode('a'.charCodeAt(0) + i);
      this._charToIndex.set(char, i + 1);
      this._indexToChar.set(i + 1, char);
    }
  }

  /**
   * The number of tokens in the vocabulary.
   * @public
   */
  public get vocabSize(): number {
    return 27;
  }

  /**
   * Converts a string to an array of token IDs.
   * The input is lowercased before encoding. Characters not in the vocabulary are skipped.
   * @param text - The string to encode
   * @public
   */
  public encode(text: string): number[] {
    const tokens: number[] = [];
    for (const char of text.toLowerCase()) {
      const index = this._charToIndex.get(char);
      if (index !== undefined) {
        tokens.push(index);
      }
    }
    return tokens;
  }

  /**
   * Converts an array of token IDs back to a string.
   * @param tokens - The array of token IDs to decode
   * @public
   */
  public decode(tokens: number[]): string {
    return tokens.map((token) => this._indexToChar.get(token) ?? '').join('');
  }
}
