import { describe, it } from 'mocha';
import { expect } from 'chai';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { NumberVector } from '../types/vector/NumberVector';
import { Vector } from '../types/vector/Vector';
import {
  calculateGeneralLeastSquaresApproximation,
  calculateLinearLeastSquaresApproximation,
  solveOverdeterminedSystem
} from './LeastSquares';

describe('LeastSquares', () => {
  const vectorBuilder = NumberVector.builder();
  const matrixBuilder = NumberMatrix.builder();

  const singleVariableTestData = [
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

  const multiVariableTestData = [
    [1, 1, 3.2],
    [2, 3, 8.5],
    [3, 2, 6.6],
    [4, 4, 12.1],
    [5, 3, 12],
    [6, 5, 16.7],
    [7, 4, 14.3],
    [8, 6, 21.3],
    [9, 5, 18.4],
    [10, 7, 25]
  ];

  describe('calculateLinearLeastSquaresApproximation', () => {
    it('calculates the coefficients for a simple linear regression', () => {
      const data = singleVariableTestData.map(pointArray => vectorBuilder.fromData(pointArray));
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

    it('calculates the coefficients for a multiple linear regression', () => {
      const data = multiVariableTestData.map(pointArray => vectorBuilder.fromData(pointArray));
      const result = calculateLinearLeastSquaresApproximation(data);

      const expectedCoefficients = vectorBuilder.fromData([
        -0.40833333333335986,
        0.7366666666666362,
        2.5416666666667
      ]);
      expect(result.coefficients).to.deep.equal(expectedCoefficients);

      // The approximation function should be a plane
      const expectedApproximator = (x1: number, x2: number) =>
        -0.40833333333335986 + 0.7366666666666362 * x1 + 2.5416666666667 * x2;

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vectorBuilder.fromValues(value, value));
        const expected = expectedApproximator(value, value);
        expect(approximated).to.equal(expected);
      });
    });

    it('yields an exact solution when there are two data points', () => {
      const exactData = [vectorBuilder.zeros(2), vectorBuilder.ones(2)];
      const result = calculateLinearLeastSquaresApproximation(exactData);

      // For the data (0,0), (1,1), the exact solution is y=x
      const expectedCoefficients = vectorBuilder.fromData([0, 1]);
      const expectedApproximator = (x: number) => x;

      expect(result.coefficients).to.deep.equal(expectedCoefficients);

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vectorBuilder.fromValues(value));
        const expected = expectedApproximator(value);
        expect(approximated).to.equal(expected);
      });
    });

    it('rejects non-homogeneous data', () => {
      const nonHomogeneousData = [vectorBuilder.ones(2), vectorBuilder.ones(3)];
      expect(() => calculateLinearLeastSquaresApproximation(nonHomogeneousData)).to.throw();
    });

    it('rejects empty data', () => {
      expect(() => calculateLinearLeastSquaresApproximation([])).to.throw();
    });
  });

  describe('calculateGeneralLeastSquaresApproximation', () => {
    it('calculates a quadratic regression', () => {
      const data = singleVariableTestData.map(pointArray => vectorBuilder.fromData(pointArray));
      const quadraticTemplate = (coefficients: Vector<number>) => (inputs: Vector<number>) => {
        const x = inputs.getEntry(0);
        const constantTerm = coefficients.getEntry(0);
        const linearTerm = coefficients.getEntry(1) * x;
        const quadraticTerm = coefficients.getEntry(2) * Math.pow(x, 2);
        return constantTerm + linearTerm + quadraticTerm;
      };
      const result = calculateGeneralLeastSquaresApproximation(data, quadraticTemplate, 3);

      // According to Excel, the trend line equation for this data is y = 3.42 + 0.35x + 0.16x^2
      const expectedCoefficients = vectorBuilder.fromData([
        3.4235294114467933,
        0.3250257998936661,
        0.16031991743511043
      ]);
      expect(result.coefficients).to.deep.equal(expectedCoefficients);

      // The approximation function should be a parabola
      const expectedApproximator = (input: number) =>
        3.4235294114467933 + 0.3250257998936661 * input + 0.16031991743511043 * Math.pow(input, 2);

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vectorBuilder.fromValues(value));
        const expected = expectedApproximator(value);
        expect(approximated).to.equal(expected);
      });
    });

    const uselessFunctionTemplate = (_: Vector<number>) => (_: Vector<number>) => 0;

    it('rejects non-homogeneous data', () => {
      const nonHomogeneousData = [vectorBuilder.ones(2), vectorBuilder.ones(3)];
      expect(() =>
        calculateGeneralLeastSquaresApproximation(nonHomogeneousData, uselessFunctionTemplate, 0)
      ).to.throw();
    });

    it('rejects empty data', () => {
      expect(() =>
        calculateGeneralLeastSquaresApproximation([], uselessFunctionTemplate, 0)
      ).to.throw();
    });
  });

  describe('solveOverdeterminedSystem', () => {
    it('gives an approximate solution to an overdetermined system', () => {
      const A = matrixBuilder.fromData([
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
        [1, 7],
        [1, 8],
        [1, 9],
        [1, 10],
        [1, 11],
        [1, 12],
        [1, 13],
        [1, 14],
        [1, 15],
        [1, 16],
        [1, 17]
      ]);

      const b = vectorBuilder.fromData([
        2.2,
        3.5,
        6.1,
        6,
        14,
        12,
        15,
        15.3,
        19,
        25,
        27,
        30,
        32,
        32,
        46,
        49,
        60
      ]);

      const x = solveOverdeterminedSystem(A, b);

      expect(x).to.deep.equal(vectorBuilder.fromData([-5.714705882354394, 3.2107843137256538]));
    });

    it('rejects a system where A is underdetermined', () => {
      const A = matrixBuilder.fromData([[1, 2, 3], [4, 5, 6]]);
      const b = vectorBuilder.fromData([1, 2]);

      expect(() => solveOverdeterminedSystem(A, b)).to.throw();
    });

    it('rejects a system with a dimension mismatch', () => {
      const A = matrixBuilder.fromData([[1, 2], [3, 4], [5, 6]]);
      const b = vectorBuilder.fromData([1, 2, 3, 4]);

      expect(() => solveOverdeterminedSystem(A, b)).to.throw();
    });
  });
});
