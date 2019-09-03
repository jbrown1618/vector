import { expect } from 'chai';
import { describe, it } from 'mocha';
import { mat, vec } from '../utilities/aliases';
import {
  covariance,
  variance,
  mean,
  center,
  standardDeviation,
  correlation,
  standardize
} from './Statistics';

describe('Statistics', () => {
  const sample = mat([[90, 60, 90], [90, 90, 30], [60, 60, 60], [60, 60, 90], [30, 30, 30]]);

  describe('mean', () => {
    it('calculates the mean of a vector', () => {
      expect(mean(sample.getColumn(0))).to.equal(66);
    });

    it('calculates the mean vector of a matrix', () => {
      expect(mean(sample)).to.deep.equal(vec([66, 60, 60]));
    });

    it('handles empty data', () => {
      expect(() => mean(vec([]))).to.throw();
      expect(mean(mat([]))).to.deep.equal(vec([]));
    });
  });

  describe('center', () => {
    it('centers a vector', () => {
      expect(center(sample.getColumn(0))).to.deep.equal(vec([24, 24, -6, -6, -36]));
    });

    it('centers the columns of a matrix', () => {
      expect(center(sample)).to.deep.equal(
        mat([[24, 0, 30], [24, 30, -30], [-6, 0, 0], [-6, 0, 30], [-36, -30, -30]])
      );
    });

    it('handles empty data', () => {
      expect(center(vec([]))).to.deep.equal(vec([]));
      expect(center(mat([]))).to.deep.equal(mat([]));
    });
  });

  describe('standardize', () => {
    it('centers and scales a vector', () => {
      expect(standardize(sample.getColumn(0))).to.deep.equal(
        vec([
          1.0690449676496976,
          1.0690449676496976,
          -0.2672612419124244,
          -0.2672612419124244,
          -1.6035674514745464
        ])
      );
    });

    it('centers and standardizes the columns of a matrix', () => {
      expect(standardize(sample)).to.deep.equal(
        mat([
          [1.0690449676496976, 0, 1.118033988749895],
          [1.0690449676496976, 1.5811388300841895, -1.118033988749895],
          [-0.2672612419124244, 0, 0],
          [-0.2672612419124244, 0, 1.118033988749895],
          [-1.6035674514745464, -1.5811388300841895, -1.118033988749895]
        ])
      );
    });

    it('handles empty data', () => {
      expect(standardize(vec([]))).to.deep.equal(vec([]));
      expect(standardize(mat([]))).to.deep.equal(mat([]));
    });

    it('handles homogeneous data', () => {
      expect(standardize(vec([0, 0, 0, 0, 0]))).to.deep.equal(vec([0, 0, 0, 0, 0]));
    });
  });

  describe('variance', () => {
    it('calculates the variance of a vector', () => {
      expect(variance(sample.getColumn(0))).to.equal(504);
    });

    it('calculates the variances for the columns of a matrix', () => {
      expect(variance(sample)).to.deep.equal(vec([504, 360, 720]));
    });

    it('handles empty data', () => {
      expect(() => variance(vec([]))).to.throw();
      expect(variance(mat([]))).to.deep.equal(vec([]));
    });

    it('handles homogeneous data', () => {
      expect(variance(vec([1, 1, 1, 1, 1]))).to.be.approximately(0, 0.0000001);
    });
  });

  describe('standardDeviation', () => {
    it('calculates the standard deviation of a vector', () => {
      expect(standardDeviation(sample.getColumn(0))).to.equal(Math.sqrt(504));
    });

    it('calculates the standard deviations for the columns of a matrix', () => {
      expect(standardDeviation(sample)).to.deep.equal(
        vec([Math.sqrt(504), Math.sqrt(360), Math.sqrt(720)])
      );
    });

    it('handles empty data', () => {
      expect(() => standardDeviation(vec([]))).to.throw();
      expect(standardDeviation(mat([]))).to.deep.equal(vec([]));
    });

    it('handles homogeneous data', () => {
      expect(standardDeviation(vec([1, 1, 1, 1, 1]))).to.be.approximately(0, 0.0000001);
    });
  });

  describe('covariance', () => {
    it('calculates the covariance of two vectors', () => {
      expect(covariance(sample.getColumn(0), sample.getColumn(1))).to.equal(360);
    });

    it('calculates the covariance matrix for a set of data', () => {
      expect(covariance(sample)).to.deep.equal(
        mat([[504, 360, 180], [360, 360, 0], [180, 0, 720]])
      );
    });

    it('handles empty data', () => {
      expect(() => covariance(vec([]), vec([]))).to.throw();
      expect(() => covariance(mat([]))).to.throw();
    });

    it('throws an error for a dimension mismatch', () => {
      expect(() => covariance(vec([1, 1, 1]), vec([1, 1, 1, 1]))).to.throw();
    });
  });

  describe('correlation', () => {
    it('calculates the correlation coefficient between two vectors', () => {
      expect(correlation(sample.getColumn(0), sample.getColumn(1))).to.equal(0.8451542547285167);
    });

    it('calculates the correlation matrix for a set of data', () => {
      expect(correlation(sample)).to.deep.equal(
        mat([
          [1.0000000000000002, 0.8451542547285167, 0.29880715233359845],
          [0.8451542547285167, 0.9999999999999999, 0],
          [0.29880715233359845, 0, 1.0000000000000002]
        ])
      );
    });

    it('handles empty data', () => {
      expect(() => correlation(vec([]), vec([]))).to.throw();
      expect(() => correlation(mat([]))).to.throw();
    });

    it('throws an error for a dimension mismatch', () => {
      expect(() => correlation(vec([1, 1, 1]), vec([1, 1, 1, 1]))).to.throw();
    });
  });
});
