import { pca, reduceDimensions } from '../PrincipalComponentAnalysis';
import { loadTestData } from '@test-utils/testData';

describe('PrincipalComponentAnalysis', () => {
  const sample = loadTestData('test-scores');
  describe('pca', () => {
    test('conducts a principal component analysis', () => {
      const analysis = pca(sample);
      expect(analysis).toMatchSnapshot();
    });

    test('uses correlation rather than covariance when prompted', () => {
      const analysis = pca(sample, true);
      expect(analysis).toMatchSnapshot();
    });
  });

  describe('reduceDimensions', () => {
    test('reduces the dimensionality of a data set to the specified number', () => {
      expect(reduceDimensions(sample, { keep: 3 }).getNumberOfColumns()).toEqual(3);
    });

    test('throws an error for invalid numbers of dimensions', () => {
      expect(() => reduceDimensions(sample, { keep: -1 })).toThrow();
      expect(() => reduceDimensions(sample, { keep: 6 })).toThrow();
    });

    test('reduces the dimensionality of a data set by removing the specified number', () => {
      expect(reduceDimensions(sample, { remove: 3 }).getNumberOfColumns()).toEqual(2);
    });

    test('throws an error for invalid numbers of dimensions to remove', () => {
      expect(() => reduceDimensions(sample, { remove: -1 })).toThrow();
      expect(() => reduceDimensions(sample, { remove: 6 })).toThrow();
    });

    test('reduces the dimensionality of a data set by specifying the amount of variance to explain', () => {
      expect(reduceDimensions(sample, { proportionOfVariance: 0.95 }).getNumberOfColumns()).toEqual(
        2
      );
    });

    test('throws an error for invalid proportions of variance', () => {
      expect(() => reduceDimensions(sample, { proportionOfVariance: -0.1 })).toThrow();
      expect(() => reduceDimensions(sample, { proportionOfVariance: 1.1 })).toThrow();
    });
  });
});
