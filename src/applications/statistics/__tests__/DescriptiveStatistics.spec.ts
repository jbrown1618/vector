import { mat, vec } from '../../../utilities/aliases';
import {
  covariance,
  variance,
  mean,
  center,
  standardDeviation,
  correlation,
  standardize
} from '../DescriptiveStatistics';

describe('DescriptiveStatistics', () => {
  const sample = mat([
    [90, 60, 90],
    [90, 90, 30],
    [60, 60, 60],
    [60, 60, 90],
    [30, 30, 30]
  ]);

  describe('mean', () => {
    test('calculates the mean of a vector', () => {
      expect(mean(sample.getColumn(0))).toEqual(66);
    });

    test('calculates the mean vector of a matrix', () => {
      expect(mean(sample)).toStrictEqual(vec([66, 60, 60]));
    });

    test('handles empty data', () => {
      expect(() => mean(vec([]))).toThrow();
      expect(mean(mat([]))).toStrictEqual(vec([]));
    });
  });

  describe('center', () => {
    test('centers a vector', () => {
      expect(center(sample.getColumn(0))).toStrictEqual(vec([24, 24, -6, -6, -36]));
    });

    test('centers the columns of a matrix', () => {
      expect(center(sample)).toStrictEqual(
        mat([
          [24, 0, 30],
          [24, 30, -30],
          [-6, 0, 0],
          [-6, 0, 30],
          [-36, -30, -30]
        ])
      );
    });

    test('handles empty data', () => {
      expect(center(vec([]))).toStrictEqual(vec([]));
      expect(center(mat([]))).toStrictEqual(mat([]));
    });
  });

  describe('standardize', () => {
    test('centers and scales a vector', () => {
      expect(standardize(sample.getColumn(0))).toMatchSnapshot();
    });

    test('centers and standardizes the columns of a matrix', () => {
      expect(standardize(sample)).toMatchSnapshot();
    });

    test('handles empty data', () => {
      expect(standardize(vec([]))).toStrictEqual(vec([]));
      expect(standardize(mat([]))).toStrictEqual(mat([]));
    });

    test('handles homogeneous data', () => {
      expect(standardize(vec([0, 0, 0, 0, 0]))).toStrictEqual(vec([0, 0, 0, 0, 0]));
    });
  });

  describe('variance', () => {
    test('calculates the variance of a vector', () => {
      expect(variance(sample.getColumn(0))).toEqual(504);
    });

    test('calculates the variances for the columns of a matrix', () => {
      expect(variance(sample)).toStrictEqual(vec([504, 360, 720]));
    });

    test('handles empty data', () => {
      expect(() => variance(vec([]))).toThrow();
      expect(variance(mat([]))).toStrictEqual(vec([]));
    });

    test('handles homogeneous data', () => {
      expect(variance(vec([1, 1, 1, 1, 1]))).toBeCloseTo(0, 7);
    });
  });

  describe('standardDeviation', () => {
    test('calculates the standard deviation of a vector', () => {
      expect(standardDeviation(sample.getColumn(0))).toEqual(Math.sqrt(504));
    });

    test('calculates the standard deviations for the columns of a matrix', () => {
      expect(standardDeviation(sample)).toStrictEqual(
        vec([Math.sqrt(504), Math.sqrt(360), Math.sqrt(720)])
      );
    });

    test('handles empty data', () => {
      expect(() => standardDeviation(vec([]))).toThrow();
      expect(standardDeviation(mat([]))).toStrictEqual(vec([]));
    });

    test('handles homogeneous data', () => {
      expect(standardDeviation(vec([1, 1, 1, 1, 1]))).toBeCloseTo(0, 7);
    });
  });

  describe('covariance', () => {
    test('calculates the covariance of two vectors', () => {
      expect(covariance(sample.getColumn(0), sample.getColumn(1))).toEqual(360);
    });

    test('calculates the covariance matrix for a set of data', () => {
      expect(covariance(sample)).toStrictEqual(
        mat([
          [504, 360, 180],
          [360, 360, 0],
          [180, 0, 720]
        ])
      );
    });

    test('handles empty data', () => {
      expect(() => covariance(vec([]), vec([]))).toThrow();
      expect(() => covariance(mat([]))).toThrow();
    });

    test('throws an error for a dimension mismatch', () => {
      expect(() => covariance(vec([1, 1, 1]), vec([1, 1, 1, 1]))).toThrow();
    });
  });

  describe('correlation', () => {
    test('calculates the correlation coefficient between two vectors', () => {
      expect(correlation(sample.getColumn(0), sample.getColumn(1))).toMatchSnapshot();
    });

    test('calculates the correlation matrix for a set of data', () => {
      expect(correlation(sample)).toMatchSnapshot();
    });

    test('handles empty data', () => {
      expect(() => correlation(vec([]), vec([]))).toThrow();
      expect(() => correlation(mat([]))).toThrow();
    });

    test('throws an error for a dimension mismatch', () => {
      expect(() => correlation(vec([1, 1, 1]), vec([1, 1, 1, 1]))).toThrow();
    });
  });
});
