import { vec, mat } from '../../utilities/aliases';
import { Vector } from '../../types/vector/Vector';
import {
  calculateGeneralLeastSquares,
  calculateLinearLeastSquares,
  solveOverdeterminedSystem
} from '../LeastSquares';
import { loadData } from '@test-utils/loadData';

describe('LeastSquares', () => {
  const singleVariableTestData = loadData('least-squares-1d');
  const multiVariableTestData = loadData('least-squares-2d');

  describe('calculateLinearLeastSquaresApproximation', () => {
    test('calculates the coefficients for a simple linear regression', () => {
      const data = singleVariableTestData.getRowVectors();
      const result = calculateLinearLeastSquares(data);

      // According to Excel, the trend line equation for this data is y = -5.7147 + 3.2108x
      const expectedCoefficients = vec([-5.7147058823529315, 3.210784313725489]);
      expect(result.coefficients).toStrictEqual(expectedCoefficients);

      // The approximation function should be a line
      const expectedApproximator = (input: number) =>
        expectedCoefficients.getEntry(0) + expectedCoefficients.getEntry(1) * input;

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

      const expectedCoefficients = vec([
        -0.40833333333332367,
        0.7366666666666807,
        2.5416666666666448
      ]);
      expect(result.coefficients).toStrictEqual(expectedCoefficients);

      // The approximation function should be a plane
      const expectedApproximator = (x1: number, x2: number) =>
        expectedCoefficients.getEntry(0) +
        expectedCoefficients.getEntry(1) * x1 +
        expectedCoefficients.getEntry(2) * x2;

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
      const expectedCoefficients = vec([
        3.4235294117647626,
        0.3250257997935815,
        0.1603199174406616
      ]);
      expect(result.coefficients).toStrictEqual(expectedCoefficients);

      // The approximation function should be a parabola
      const expectedApproximator = (input: number) =>
        expectedCoefficients.getEntry(0) +
        expectedCoefficients.getEntry(1) * input +
        expectedCoefficients.getEntry(2) * Math.pow(input, 2);

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
      const A = mat([
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

      const b = vec([2.2, 3.5, 6.1, 6, 14, 12, 15, 15.3, 19, 25, 27, 30, 32, 32, 46, 49, 60]);

      const x = solveOverdeterminedSystem(A, b);

      expect(x).toStrictEqual(vec([-5.7147058823529315, 3.210784313725489]));
    });

    test('rejects a system where A is underdetermined', () => {
      const A = mat([[1, 2, 3], [4, 5, 6]]);
      const b = vec([1, 2]);

      const solution = solveOverdeterminedSystem(A, b);
      expect(solution).not.toBeUndefined;
    });

    test('rejects a system with a dimension mismatch', () => {
      const A = mat([[1, 2], [3, 4], [5, 6]]);
      const b = vec([1, 2, 3, 4]);

      expect(() => solveOverdeterminedSystem(A, b)).toThrow();
    });
  });
});
