import { Matrix } from '../../../types/matrix/Matrix';
import { FloatMatrix } from '../../../types/matrix/FloatMatrix';
import { softmax } from '../../../utilities/NumberUtilities';
import { Tokenizer } from './Tokenizer';
import { TransformerBlock } from './TransformerBlock';

const mb = FloatMatrix.builder();

/**
 * The set of hyperparameters for a {@link LanguageModel}.
 * @public
 */
export type LanguageModelHyperparams = {
  /** The dimension of token and positional embeddings */
  embedDim: number;
  /** The hidden dimension of the feed-forward network in the transformer block */
  ffDim: number;
  /** The maximum number of tokens in the input context */
  contextLength: number;
  /** The step size for gradient descent */
  learningRate: number;
  /** The number of gradient descent iterations during training */
  maxIterations: number;
};

const DEFAULT_HYPERPARAMS: LanguageModelHyperparams = {
  embedDim: 8,
  ffDim: 16,
  contextLength: 16,
  learningRate: 0.01,
  maxIterations: 100,
};

/**
 * A character-level language model that composes a {@link Tokenizer},
 * learned token and positional embeddings, a single {@link TransformerBlock},
 * and an output projection layer into a trainable autoregressive model.
 *
 * @remarks
 * Training uses finite-difference gradient estimation, which is suitable only
 * for toy-sized models.  Keep dimensions small (embedDim ≤ 8, ffDim ≤ 16).
 *
 * @public
 */
export class LanguageModel {
  private readonly _hyperparams: Readonly<LanguageModelHyperparams>;
  private readonly _tokenizer: Tokenizer;
  private readonly _block: TransformerBlock;

  private _tokenEmbeddings: Matrix<number>;
  private _positionalEncodings: Matrix<number>;
  private _outputProjection: Matrix<number>;

  /**
   * Creates a new LanguageModel with randomly initialised weights.
   *
   * @param hyperparams - Optional partial hyperparameters merged with defaults
   * @public
   */
  constructor(hyperparams?: Partial<LanguageModelHyperparams>) {
    this._hyperparams = Object.freeze({ ...DEFAULT_HYPERPARAMS, ...hyperparams });

    const { embedDim, ffDim, contextLength } = this._hyperparams;
    const std = 0.02;

    this._tokenizer = new Tokenizer();

    this._tokenEmbeddings = mb.randomNormal([this._tokenizer.vocabSize, embedDim], 0, std);
    this._positionalEncodings = mb.randomNormal([contextLength, embedDim], 0, std);
    this._block = new TransformerBlock(embedDim, ffDim, contextLength);
    this._outputProjection = mb.randomNormal([embedDim, this._tokenizer.vocabSize], 0, std);
  }

  /**
   * Returns the full set of hyperparameters (with defaults filled in).
   * @public
   */
  public getHyperParameters(): LanguageModelHyperparams {
    return { ...this._hyperparams };
  }

  /**
   * Runs the forward pass of the language model on a sequence of token IDs.
   *
   * @param tokenIds - An array of integer token IDs
   * @returns A probability distribution over the vocabulary for the next token
   * @public
   */
  public forward(tokenIds: number[]): number[] {
    const { embedDim, contextLength } = this._hyperparams;
    const vocabSize = this._tokenizer.vocabSize;
    const seqLen = tokenIds.length;

    // Look up token embeddings and add positional encodings
    const embData: number[][] = [];
    const tokArr = this._tokenEmbeddings.toArray();
    const posArr = this._positionalEncodings.toArray();

    for (let t = 0; t < seqLen; t++) {
      const tokRow = tokArr[tokenIds[t]];
      const posRow = posArr[t % contextLength];
      const row: number[] = new Array(embedDim);
      for (let j = 0; j < embedDim; j++) {
        row[j] = tokRow[j] + posRow[j];
      }
      embData.push(row);
    }

    const input = mb.fromArray(embData);

    // Transformer block
    const transformed = this._block.forward(input);

    // Take last row and project to vocabulary logits
    const lastRow = transformed.getRow(seqLen - 1).toArray();
    const projArr = this._outputProjection.toArray();
    const logits: number[] = new Array(vocabSize);
    for (let v = 0; v < vocabSize; v++) {
      let sum = 0;
      for (let j = 0; j < embedDim; j++) {
        sum += lastRow[j] * projArr[j][v];
      }
      logits[v] = sum;
    }

    return softmax(logits);
  }

  /**
   * Trains the model on a text corpus using finite-difference gradient descent.
   *
   * @param corpus - The training text
   * @public
   */
  public train(corpus: string): void {
    const { learningRate, maxIterations } = this._hyperparams;
    const tokens = this._tokenizer.encode(corpus);

    if (tokens.length < 2) {
      return;
    }

    // Build training examples
    const examples: { input: number[]; target: number }[] = [];
    for (let i = 1; i < tokens.length; i++) {
      const start = Math.max(0, i - this._hyperparams.contextLength);
      examples.push({ input: tokens.slice(start, i), target: tokens[i] });
    }

    const params = this.getParameters();
    const eps = 1e-5;

    for (let iter = 0; iter < maxIterations; iter++) {
      this.setParameters(params);

      // Finite-difference gradients
      const gradient: number[] = new Array(params.length);
      for (let p = 0; p < params.length; p++) {
        const saved = params[p];

        params[p] = saved + eps;
        this.setParameters(params);
        const costPlus = this.computeCost(examples);

        params[p] = saved - eps;
        this.setParameters(params);
        const costMinus = this.computeCost(examples);

        gradient[p] = (costPlus - costMinus) / (2 * eps);
        params[p] = saved;
      }

      // Update parameters
      for (let p = 0; p < params.length; p++) {
        params[p] -= learningRate * gradient[p];
      }
    }

    this.setParameters(params);
  }

  /**
   * Generates text by autoregressively sampling from the model.
   *
   * @param prompt - The initial text to condition generation on
   * @param length - The number of tokens to generate
   * @returns The prompt followed by the generated text
   * @public
   */
  public generate(prompt: string, length: number): string {
    const tokens = this._tokenizer.encode(prompt);

    for (let i = 0; i < length; i++) {
      const contextStart = Math.max(0, tokens.length - this._hyperparams.contextLength);
      const context = tokens.slice(contextStart);
      const probs = this.forward(context);

      // Greedy decoding: pick the argmax
      let bestIdx = 0;
      let bestProb = probs[0];
      for (let v = 1; v < probs.length; v++) {
        if (probs[v] > bestProb) {
          bestProb = probs[v];
          bestIdx = v;
        }
      }
      tokens.push(bestIdx);
    }

    return this._tokenizer.decode(tokens);
  }

  /**
   * Returns all learnable parameters as a flat number array.
   *
   * @remarks
   * Order: token embeddings (row-major), positional encodings (row-major),
   * transformer block parameters, output projection (row-major).
   *
   * @public
   */
  public getParameters(): number[] {
    return [
      ...flattenMatrix(this._tokenEmbeddings),
      ...flattenMatrix(this._positionalEncodings),
      ...this._block.getParameters(),
      ...flattenMatrix(this._outputProjection),
    ];
  }

  /**
   * Reconstructs all weight matrices from a flat parameter array.
   *
   * @param params - A flat array whose length must equal {@link getParameterCount}
   * @public
   */
  public setParameters(params: number[]): void {
    const expected = this.getParameterCount();
    if (params.length !== expected) {
      throw new Error(`Expected ${expected} parameters but received ${params.length}`);
    }

    const { embedDim, contextLength } = this._hyperparams;
    const vocabSize = this._tokenizer.vocabSize;
    let offset = 0;

    const readMatrix = (rows: number, cols: number): Matrix<number> => {
      const data: number[][] = [];
      for (let i = 0; i < rows; i++) {
        data.push(params.slice(offset, offset + cols));
        offset += cols;
      }
      return mb.fromArray(data);
    };

    this._tokenEmbeddings = readMatrix(vocabSize, embedDim);
    this._positionalEncodings = readMatrix(contextLength, embedDim);

    const blockParamCount = this._block.getParameterCount();
    this._block.setParameters(params.slice(offset, offset + blockParamCount));
    offset += blockParamCount;

    this._outputProjection = readMatrix(embedDim, vocabSize);
  }

  /**
   * Returns the total number of learnable parameters.
   * @public
   */
  public getParameterCount(): number {
    const { embedDim, contextLength } = this._hyperparams;
    const vocabSize = this._tokenizer.vocabSize;

    const embeddingParams = vocabSize * embedDim;
    const positionalParams = contextLength * embedDim;
    const blockParams = this._block.getParameterCount();
    const outputParams = embedDim * vocabSize;

    return embeddingParams + positionalParams + blockParams + outputParams;
  }

  private computeCost(examples: { input: number[]; target: number }[]): number {
    let totalLoss = 0;
    for (const example of examples) {
      const probs = this.forward(example.input);
      const p = Math.max(probs[example.target], 1e-12);
      totalLoss += -Math.log(p);
    }
    return totalLoss / examples.length;
  }
}

/** Flattens a matrix row-by-row into a 1-D array. */
function flattenMatrix(m: Matrix<number>): number[] {
  const result: number[] = [];
  for (const row of m.toArray()) {
    result.push(...row);
  }
  return result;
}
