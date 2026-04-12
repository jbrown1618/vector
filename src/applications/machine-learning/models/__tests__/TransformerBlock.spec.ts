import { TransformerBlock } from '../TransformerBlock';
import { mat } from '../../../../utilities/aliases';
import { FloatMatrix } from '../../../../types/matrix/FloatMatrix';

describe('TransformerBlock', () => {
  const embedDim = 4;
  const ffDim = 8;
  const contextLength = 6;

  function makeInput(seqLen: number): ReturnType<typeof mat> {
    return FloatMatrix.builder().random([seqLen, embedDim], -1, 1);
  }

  describe('forward', () => {
    it('produces output with the correct shape', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);
      const input = makeInput(3);
      const output = block.forward(input);

      expect(output.getNumberOfRows()).toBe(3);
      expect(output.getNumberOfColumns()).toBe(embedDim);
    });

    it('works with different sequence lengths', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);

      for (const seqLen of [1, 2, 5]) {
        const output = block.forward(makeInput(seqLen));
        expect(output.getNumberOfRows()).toBe(seqLen);
        expect(output.getNumberOfColumns()).toBe(embedDim);
      }
    });

    it('produces finite output values', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);
      const output = block.forward(makeInput(4));

      output.toArray().forEach((row) => {
        row.forEach((val) => {
          expect(Number.isFinite(val)).toBe(true);
        });
      });
    });
  });

  describe('getParameterCount', () => {
    it('returns the correct total', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);
      // 4 attention matrices (d×d) + W1 (d×f) + b1 (f) + W2 (f×d) + b2 (d)
      const expected =
        4 * embedDim * embedDim + embedDim * ffDim + ffDim + ffDim * embedDim + embedDim;
      expect(block.getParameterCount()).toBe(expected);
    });
  });

  describe('getParameters / setParameters roundtrip', () => {
    it('recovers the same parameters after a roundtrip', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);
      const params = block.getParameters();

      const block2 = new TransformerBlock(embedDim, ffDim, contextLength);
      block2.setParameters(params);

      const recovered = block2.getParameters();
      expect(recovered.length).toBe(params.length);
      recovered.forEach((val, i) => {
        expect(val).toBeCloseTo(params[i], 12);
      });
    });

    it('throws when given the wrong number of parameters', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);
      expect(() => block.setParameters([1, 2, 3])).toThrow();
    });
  });

  describe('forward output changes after setParameters', () => {
    it('produces different output with different parameters', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);
      const input = mat([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
      ]);

      const outputBefore = block.forward(input).toArray();

      // Set all parameters to a known different value
      const newParams = new Array(block.getParameterCount()).fill(0.1);
      block.setParameters(newParams);

      const outputAfter = block.forward(input).toArray();

      // At least one entry should differ
      let differs = false;
      for (let i = 0; i < outputBefore.length && !differs; i++) {
        for (let j = 0; j < outputBefore[i].length && !differs; j++) {
          if (Math.abs(outputBefore[i][j] - outputAfter[i][j]) > 1e-10) {
            differs = true;
          }
        }
      }
      expect(differs).toBe(true);
    });
  });

  describe('causal masking', () => {
    it('ensures output at position i is unaffected by changes at position j > i', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);

      // Fix parameters so both runs use the same weights
      const params = block.getParameters();

      const inputA = mat([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);

      // Change only the last row (position 2)
      const inputB = mat([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [0, 0, 0, 0],
      ]);

      block.setParameters(params);
      const outputA = block.forward(inputA).toArray();

      block.setParameters(params);
      const outputB = block.forward(inputB).toArray();

      // Row 0 should be identical (cannot see positions 1 or 2)
      for (let j = 0; j < embedDim; j++) {
        expect(outputA[0][j]).toBeCloseTo(outputB[0][j], 10);
      }

      // Row 1 should be identical (cannot see position 2)
      for (let j = 0; j < embedDim; j++) {
        expect(outputA[1][j]).toBeCloseTo(outputB[1][j], 10);
      }

      // Row 2 should differ (it sees itself and its input changed)
      let row2Differs = false;
      for (let j = 0; j < embedDim; j++) {
        if (Math.abs(outputA[2][j] - outputB[2][j]) > 1e-10) {
          row2Differs = true;
        }
      }
      expect(row2Differs).toBe(true);
    });

    it('does not leak future information to earlier positions with seq length 1', () => {
      const block = new TransformerBlock(embedDim, ffDim, contextLength);
      const params = block.getParameters();

      const singleToken = mat([[1, 2, 3, 4]]);
      const twoTokens = mat([
        [1, 2, 3, 4],
        [99, 99, 99, 99],
      ]);

      block.setParameters(params);
      const outSingle = block.forward(singleToken).toArray();

      block.setParameters(params);
      const outDouble = block.forward(twoTokens).toArray();

      // The first row of the two-token output should match the single-token output
      for (let j = 0; j < embedDim; j++) {
        expect(outDouble[0][j]).toBeCloseTo(outSingle[0][j], 10);
      }
    });
  });
});
