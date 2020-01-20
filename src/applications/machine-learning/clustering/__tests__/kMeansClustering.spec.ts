import { kMeansClustering } from '../kMeansClustering';
import { loadTestData } from '@test-utils/testData';

describe('kMeansClustering', () => {
  it('finds two clusters in eight-dimensional data', () => {
    const X = loadTestData('2-gaussian-clusters');
    const { centroids, labels } = kMeansClustering(X, { k: 2, maxIterations: 10 });

    expect(centroids).toHaveLength(2);
    expect(labels.getDimension()).toBe(X.getNumberOfRows());
  });

  it('finds fifteen clusters in two-dimensional data', () => {
    const X = loadTestData('15-gaussian-clusters');
    const { centroids, labels } = kMeansClustering(X, { k: 15, maxIterations: 10 });

    expect(centroids).toHaveLength(15);
    expect(labels.getDimension()).toBe(X.getNumberOfRows());
  });
});
