import { Matrix } from '../../../types/matrix/Matrix';
import { Vector } from '../../../types/vector/Vector';
import { FloatMatrix } from '../../../types/matrix/FloatMatrix';
import { FloatVector } from '../../../types/vector/FloatVector';
import { softmax } from '../../../utilities/NumberUtilities';

const mb = FloatMatrix.builder();
const vb = FloatVector.builder();

/**
 * A single transformer block with single-head self-attention and a feed-forward network.
 *
 * @remarks
 * Implements causal (autoregressive) masking so that each token can only attend
 * to itself and previous tokens. Includes residual connections around both the
 * attention and feed-forward sub-layers.
 *
 * @public
 */
export class TransformerBlock {
  private readonly _embedDim: number;
  private readonly _ffDim: number;

  private _Wq: Matrix<number>;
  private _Wk: Matrix<number>;
  private _Wv: Matrix<number>;
  private _Wo: Matrix<number>;
  private _W1: Matrix<number>;
  private _b1: Vector<number>;
  private _W2: Matrix<number>;
  private _b2: Vector<number>;

  /**
   * Creates a new TransformerBlock with randomly initialised weights.
   *
   * @param embedDim - The embedding dimension
   * @param ffDim - The hidden dimension of the feed-forward network
   * @param contextLength - The maximum sequence length supported
   * @public
   */
  constructor(embedDim: number, ffDim: number, contextLength: number) {
    this._embedDim = embedDim;
    this._ffDim = ffDim;
    // contextLength is accepted for API compatibility but the causal mask
    // is built dynamically from the actual sequence length.
    void contextLength;

    const std = 0.02;

    // Attention weights (embedDim × embedDim)
    this._Wq = mb.randomNormal([embedDim, embedDim], 0, std);
    this._Wk = mb.randomNormal([embedDim, embedDim], 0, std);
    this._Wv = mb.randomNormal([embedDim, embedDim], 0, std);
    this._Wo = mb.randomNormal([embedDim, embedDim], 0, std);

    // Feed-forward weights
    this._W1 = mb.randomNormal([embedDim, ffDim], 0, std);
    this._b1 = vb.zeros(ffDim);
    this._W2 = mb.randomNormal([ffDim, embedDim], 0, std);
    this._b2 = vb.zeros(embedDim);
  }

  /**
   * Runs the forward pass of the transformer block.
   *
   * @param input - A (seqLen × embedDim) matrix where each row is a token embedding
   * @returns A (seqLen × embedDim) matrix of transformed token embeddings
   * @public
   */
  public forward(input: Matrix<number>): Matrix<number> {
    // --- Self-attention ---
    const Q = input.multiply(this._Wq);
    const K = input.multiply(this._Wk);
    const V = input.multiply(this._Wv);

    // Attention scores: (seqLen × seqLen)
    const scale = 1 / Math.sqrt(this._embedDim);
    const rawScores = Q.multiply(K.transpose()).scalarMultiply(scale);

    // Causal mask + softmax
    const masked = applyCausalMask(rawScores);
    const attnWeights = rowWiseSoftmax(masked);

    // Weighted values and output projection
    const attnOut = attnWeights.multiply(V).multiply(this._Wo);

    // Residual connection
    const x = input.add(attnOut);

    // --- Feed-forward network ---
    const ff1 = addBiasRows(x.multiply(this._W1), this._b1).map((v) => Math.max(0, v));
    const ff2 = addBiasRows(ff1.multiply(this._W2), this._b2);

    // Residual connection
    return x.add(ff2);
  }

  /**
   * Returns all learnable parameters as a flat number array.
   *
   * @remarks
   * Order: Wq, Wk, Wv, Wo, W1, b1, W2, b2.
   * Matrices are flattened in row-major order via {@link Matrix.toArray}.
   *
   * @returns A flat array of all parameter values
   * @public
   */
  public getParameters(): number[] {
    return [
      ...flattenMatrix(this._Wq),
      ...flattenMatrix(this._Wk),
      ...flattenMatrix(this._Wv),
      ...flattenMatrix(this._Wo),
      ...flattenMatrix(this._W1),
      ...this._b1.toArray(),
      ...flattenMatrix(this._W2),
      ...this._b2.toArray(),
    ];
  }

  /**
   * Reconstructs all weight matrices and bias vectors from a flat parameter array.
   *
   * @param params - A flat array whose length must equal {@link getParameterCount}
   * @public
   */
  public setParameters(params: number[]): void {
    const expected = this.getParameterCount();
    if (params.length !== expected) {
      throw new Error(`Expected ${expected} parameters but received ${params.length}`);
    }

    let offset = 0;

    const readMatrix = (rows: number, cols: number): Matrix<number> => {
      const data: number[][] = [];
      for (let i = 0; i < rows; i++) {
        data.push(params.slice(offset, offset + cols));
        offset += cols;
      }
      return mb.fromArray(data);
    };

    const readVector = (dim: number): Vector<number> => {
      const data = params.slice(offset, offset + dim);
      offset += dim;
      return vb.fromArray(data);
    };

    const d = this._embedDim;
    const f = this._ffDim;

    this._Wq = readMatrix(d, d);
    this._Wk = readMatrix(d, d);
    this._Wv = readMatrix(d, d);
    this._Wo = readMatrix(d, d);
    this._W1 = readMatrix(d, f);
    this._b1 = readVector(f);
    this._W2 = readMatrix(f, d);
    this._b2 = readVector(d);
  }

  /**
   * Returns the total number of learnable parameters.
   * @public
   */
  public getParameterCount(): number {
    const d = this._embedDim;
    const f = this._ffDim;
    return 4 * d * d + d * f + f + f * d + d;
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

/** Sets scores[i][j] = -Infinity for j > i (future positions). */
function applyCausalMask(scores: Matrix<number>): Matrix<number> {
  const rows = scores.getNumberOfRows();
  const cols = scores.getNumberOfColumns();
  const data: number[][] = scores.toArray();
  for (let i = 0; i < rows; i++) {
    for (let j = i + 1; j < cols; j++) {
      data[i][j] = -Infinity;
    }
  }
  return mb.fromArray(data);
}

/** Applies softmax independently to each row of a matrix. */
function rowWiseSoftmax(m: Matrix<number>): Matrix<number> {
  const data = m.toArray().map((row) => softmax(row));
  return mb.fromArray(data);
}

/** Broadcasts a bias vector across every row of a matrix. */
function addBiasRows(m: Matrix<number>, bias: Vector<number>): Matrix<number> {
  const biasArr = bias.toArray();
  const rows = m.getNumberOfRows();
  const biasMatrix = mb.fromArray(Array.from({ length: rows }, () => [...biasArr]));
  return m.add(biasMatrix);
}
