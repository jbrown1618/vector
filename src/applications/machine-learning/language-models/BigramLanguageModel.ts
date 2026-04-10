import { Matrix } from '../../../types/matrix/Matrix';
import { mat } from '../../../utilities/aliases';
import { softmax, softmaxArray } from '../../../operations/Activations';
import { sampleFromDistribution } from '../../../utilities/Sampling';

/**
 * The set of hyperparameters for a {@link BigramLanguageModel}
 * @public
 */
export interface BigramLanguageModelHyperParameters {
  /** The step size for gradient descent */
  learningRate: number;
  /** The number of training iterations */
  iterations: number;
}

/**
 * A character-level bigram language model.
 *
 * @remarks
 * Given a character, the model learns a probability distribution over the next character
 * using a vocabulary-sized logit matrix trained with gradient descent on cross-entropy loss.
 *
 * This is intentionally a toy model — suitable for tiny vocabularies and short texts.
 *
 * @public
 */
export class BigramLanguageModel {
  private readonly _hyperParameters: Readonly<Required<BigramLanguageModelHyperParameters>>;
  private _logits: Matrix<number> | undefined;
  private _charToIndex: Map<string, number> = new Map();
  private _indexToChar: Map<number, string> = new Map();
  private _vocabSize: number = 0;

  constructor(hyperParameters?: Partial<BigramLanguageModelHyperParameters>) {
    this._hyperParameters = Object.freeze({
      learningRate: 1.0,
      iterations: 100,
      ...hyperParameters,
    });
  }

  /**
   * Returns the full set of hyperparameters, including defaults.
   * @public
   */
  public getHyperParameters(): BigramLanguageModelHyperParameters {
    return { ...this._hyperParameters };
  }

  /**
   * Returns the learned logit matrix, or `undefined` if the model has not been trained.
   * Row `i` contains the logits for the next-character distribution given character `i`.
   * @public
   */
  public getLogits(): Matrix<number> | undefined {
    return this._logits;
  }

  /**
   * Returns the vocabulary as a sorted array of characters,
   * or `undefined` if the model has not been trained.
   * @public
   */
  public getVocabulary(): string[] | undefined {
    if (this._vocabSize === 0) return undefined;
    return Array.from({ length: this._vocabSize }, (_, i) => this._indexToChar.get(i)!);
  }

  /**
   * Trains the model on a string of text.
   *
   * @param text - The training corpus; must contain at least 2 characters
   * @public
   */
  public train(text: string): void {
    if (text.length < 2) {
      throw new Error('Training text must contain at least 2 characters');
    }

    // Build vocabulary
    const chars = Array.from(new Set(text.split(''))).sort();
    this._vocabSize = chars.length;
    this._charToIndex = new Map(chars.map((c, i) => [c, i]));
    this._indexToChar = new Map(chars.map((c, i) => [i, c]));

    // Precompute bigram counts
    const counts: number[][] = Array.from({ length: this._vocabSize }, () =>
      new Array(this._vocabSize).fill(0),
    );
    const totalBigrams = text.length - 1;

    for (let t = 0; t < totalBigrams; t++) {
      const src = this._charToIndex.get(text[t])!;
      const tgt = this._charToIndex.get(text[t + 1])!;
      counts[src][tgt]++;
    }

    const rowCounts = counts.map((row) => row.reduce((a, b) => a + b, 0));

    // Initialize logits to small random values
    const logits: number[][] = Array.from({ length: this._vocabSize }, () =>
      Array.from({ length: this._vocabSize }, () => (Math.random() - 0.5) * 0.1),
    );

    const { learningRate, iterations } = this._hyperParameters;

    // Gradient descent on cross-entropy loss
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < this._vocabSize; i++) {
        if (rowCounts[i] === 0) continue;

        const probs = softmaxArray(logits[i]);

        for (let j = 0; j < this._vocabSize; j++) {
          const grad = (rowCounts[i] * probs[j] - counts[i][j]) / totalBigrams;
          logits[i][j] -= learningRate * grad;
        }
      }
    }

    this._logits = mat(logits);
  }

  /**
   * Computes the average cross-entropy loss on a string of text.
   *
   * @param text - The text to evaluate; must contain at least 2 characters
   *               and only characters seen during training
   * @public
   */
  public loss(text: string): number {
    if (!this._logits) {
      throw new Error('Cannot compute loss before training');
    }
    if (text.length < 2) {
      throw new Error('Text must contain at least 2 characters');
    }
    this.assertKnownCharacters(text);

    const totalBigrams = text.length - 1;
    let totalLoss = 0;

    for (let t = 0; t < totalBigrams; t++) {
      const src = this._charToIndex.get(text[t])!;
      const tgt = this._charToIndex.get(text[t + 1])!;
      const probs = softmax(this._logits.getRow(src));
      totalLoss -= Math.log(Math.max(probs.getEntry(tgt), Number.EPSILON));
    }

    return totalLoss / totalBigrams;
  }

  /**
   * Generates text by repeatedly sampling from the learned next-character distribution.
   *
   * @param seed - A non-empty string whose last character seeds generation;
   *               all characters must have been seen during training
   * @param length - The number of characters to generate (appended after the seed)
   * @public
   */
  public generate(seed: string, length: number): string {
    if (!this._logits) {
      throw new Error('Cannot generate before training');
    }
    if (seed.length === 0) {
      throw new Error('Seed must be non-empty');
    }
    this.assertKnownCharacters(seed);

    let result = seed;
    let currentChar = seed[seed.length - 1];

    for (let i = 0; i < length; i++) {
      const src = this._charToIndex.get(currentChar)!;
      const probs = softmax(this._logits.getRow(src));
      const nextIndex = sampleFromDistribution(probs.toArray());
      currentChar = this._indexToChar.get(nextIndex)!;
      result += currentChar;
    }

    return result;
  }

  /**
   * Returns the learned probability distribution over the next character,
   * given a single input character.
   *
   * @param char - A single character that was seen during training
   * @public
   */
  public nextCharacterProbabilities(char: string): Map<string, number> {
    if (!this._logits) {
      throw new Error('Cannot get probabilities before training');
    }
    if (char.length !== 1) {
      throw new Error('Input must be a single character');
    }
    this.assertKnownCharacters(char);

    const src = this._charToIndex.get(char)!;
    const probs = softmax(this._logits.getRow(src));
    const result = new Map<string, number>();
    probs.forEach((p, i) => {
      result.set(this._indexToChar.get(i)!, p);
    });
    return result;
  }

  private assertKnownCharacters(text: string): void {
    for (const c of text) {
      if (!this._charToIndex.has(c)) {
        throw new Error(`Unknown character: "${c}"`);
      }
    }
  }
}
