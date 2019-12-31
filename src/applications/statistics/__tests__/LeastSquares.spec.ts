import { vec, mat } from '../../../utilities/aliases';
import { Vector } from '../../../types/vector/Vector';
import {
  calculateGeneralLeastSquares,
  calculateLinearLeastSquares,
  solveOverdeterminedSystem
} from '../LeastSquares';
import { loadTestData } from '@test-utils/testData';

describe('LeastSquares', () => {
  const singleVariableTestData = loadTestData('least-squares-1d');
  const multiVariableTestData = loadTestData('least-squares-2d');

  describe('calculateLinearLeastSquaresApproximation', () => {
    test('calculates the coefficients for a simple linear regression', () => {
      const data = singleVariableTestData.getRowVectors();
      const result = calculateLinearLeastSquares(data);

      // According to Excel, the trend line equation for this data is y = -5.7147 + 3.2108x
      expect(result.coefficients).toMatchSnapshot();

      // The approximation function should be a line
      const expectedApproximator = (input: number) =>
        result.coefficients.getEntry(0) + result.coefficients.getEntry(1) * input;

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vec([value]));
        const expected = expectedApproximator(value);
        expect(approximated).toEqual(expected);
      });
    });

    test('calculates the coefficients for a multiple linear regression', () => {
      const data = multiVariableTestData.getRowVectors();
      const result = calculateLinearLeastSquares(data);

      expect(result.coefficients).toMatchSnapshot();

      // The approximation function should be a plane
      const expectedApproximator = (x1: number, x2: number) =>
        result.coefficients.getEntry(0) +
        result.coefficients.getEntry(1) * x1 +
        result.coefficients.getEntry(2) * x2;

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vec([value, value]));
        const expected = expectedApproximator(value, value);
        expect(approximated).toEqual(expected);
      });
    });

    test('yields an exact solution when there are two data points', () => {
      const exactData = [vec([0, 0]), vec([1, 1])];
      const result = calculateLinearLeastSquares(exactData);

      // For the data (0,0), (1,1), the exact solution is y=x
      const expectedCoefficients = vec([0, 1]);
      const expectedApproximator = (x: number) => x;

      expect(result.coefficients).toStrictEqual(expectedCoefficients);

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vec([value]));
        const expected = expectedApproximator(value);
        expect(approximated).toEqual(expected);
      });
    });

    test('rejects non-homogeneous data', () => {
      const nonHomogeneousData = [vec([1, 1]), vec([1, 1, 1])];
      expect(() => calculateLinearLeastSquares(nonHomogeneousData)).toThrow();
    });

    test('rejects empty data', () => {
      expect(() => calculateLinearLeastSquares([])).toThrow();
    });
  });

  describe('calculateGeneralLeastSquaresApproximation', () => {
    test('calculates a quadratic regression', () => {
      const data = singleVariableTestData.getRowVectors();
      const quadraticTemplate = (coefficients: Vector<number>) => (inputs: Vector<number>) => {
        const x = inputs.getEntry(0);
        const constantTerm = coefficients.getEntry(0);
        const linearTerm = coefficients.getEntry(1) * x;
        const quadraticTerm = coefficients.getEntry(2) * Math.pow(x, 2);
        return constantTerm + linearTerm + quadraticTerm;
      };
      const result = calculateGeneralLeastSquares(data, quadraticTemplate, 3);

      // According to Excel, the trend line equation for this data is y = 3.42 + 0.35x + 0.16x^2
      expect(result.coefficients).toMatchSnapshot();

      // The approximation function should be a parabola
      const expectedApproximator = (input: number) =>
        result.coefficients.getEntry(0) +
        result.coefficients.getEntry(1) * input +
        result.coefficients.getEntry(2) * Math.pow(input, 2);

      const inputValuesToCheck = [-1, 0, 1, 20];
      inputValuesToCheck.forEach(value => {
        const approximated = result.approximationFunction(vec([value]));
        const expected = expectedApproximator(value);
        expect(approximated).toEqual(expected);
      });
    });

    const uselessFunctionTemplate = () => () => 0;

    test('rejects non-homogeneous data', () => {
      const nonHomogeneousData = [vec([1, 1]), vec([1, 1, 1])];
      expect(() =>
        calculateGeneralLeastSquares(nonHomogeneousData, uselessFunctionTemplate, 0)
      ).toThrow();
    });

    test('rejects empty data', () => {
      expect(() => calculateGeneralLeastSquares([], uselessFunctionTemplate, 0)).toThrow();
    });
  });

  describe('solveOverdeterminedSystem', () => {
    test('gives an approximate solution to an overdetermined system', () => {
      const A = loadTestData('random-50x3');
      const b = loadTestData('random-50x1').getColumn(0);
      const x = solveOverdeterminedSystem(A, b);
      expect(x).toMatchSnapshot();
    });

    test('rejects a system where A is underdetermined', () => {
      const A = mat([
        [1, 2, 3],
        [4, 5, 6]
      ]);
      const b = vec([1, 2]);

      const solution = solveOverdeterminedSystem(A, b);
      expect(solution).not.toBeUndefined;
    });

    test('rejects a system with a dimension mismatch', () => {
      const A = mat([
        [1, 2],
        [3, 4],
        [5, 6]
      ]);
      const b = vec([1, 2, 3, 4]);

      expect(() => solveOverdeterminedSystem(A, b)).toThrow();
    });
  });
});
