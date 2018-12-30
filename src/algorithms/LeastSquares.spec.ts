import { describe, it } from 'mocha';
import { expect } from 'chai';
import { NumberVector } from '../types/vector/NumberVector';
import { calculateLinearLeastSquaresApproximation } from './LeastSquares';

describe('LeastSquares', () => {
  const vectorBuilder = NumberVector.builder();
  const linearTestData = [
    [1, 2.2],
    [2, 3.5],
    [3, 6.1],
    [4, 6],
    [5, 14],
    [6, 12],
    [7, 15],
    [8, 15.3],
    [9, 19],
    [10, 25],
    [11, 27],
    [12, 30],
    [13, 32],
    [14, 32],
    [15, 46],
    [16, 49],
    [17, 60]
  ];

  describe('calculateLinearLeastSquaresApproximation', () => {
    it('calculates the coefficients for a simple linear regression', () => {
      const data = linearTestData.map(pointArray => vectorBuilder.fromData(pointArray));
      const result = calculateLinearLeastSquaresApproximation(data);

      // According to Excel, the trend line equation for this data is y = -5.7147 + 3.2108x
      const expectedCoefficients = vectorBuilder.fromData([-5.714705882354394, 3.2107843137256538]);
      expect(result.coefficients).to.deep.equal(expectedCoefficients);

      // The approximation function should be a line
      const expectedApproximator = (input: number) =>
        -5.714705882354394 + 3.2107843137256538 * input;

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vectorBuilder.fromValues(value));
        const expected = expectedApproximator(value);
        expect(approximated).to.equal(expected);
      });
    });
  });

  describe('calculateGeneralLeastSquaresApproximation', () => {});

  describe('solveOverdeterminedSystem', () => {});
});
