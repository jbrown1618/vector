import { Vector } from '../../../types/vector/Vector';
import { Matrix } from '../../../types/matrix/Matrix';
import { euclideanNorm, Norm } from '../../../operations/Norms';
import { mean, standardDeviation } from '../../statistics/DescriptiveStatistics';

interface KMeansParameters {
  k: number;
  norm: Norm;
  maxIterations: number;
}

interface ClusteringResult {
  centroids: Vector[];
  labels: Vector;
}

export function kMeansClustering(X: Matrix, params: Partial<KMeansParameters>): ClusteringResult {
  const rows = X.getRowVectors();
  const [m, n] = X.getShape();
  const { k = 5, norm = euclideanNorm, maxIterations = 100 } = params;

  let centroids = initializeCentroids(X, k, n);
  let labels = X.vectorBuilder().zeros(m);

  let iter = 0;
  while (iter < maxIterations) {
    const nextLabels = updateLabels(rows, centroids, norm);
    const changed = !nextLabels.equals(labels);
    labels = nextLabels;
    centroids = updateCentroids(rows, labels);

    if (!changed) break;

    iter++;
  }

  return { centroids, labels };
}

function updateLabels(rows: Vector[], centroids: Vector[], norm: Norm): Vector {
  const m = rows.length;
  const vectorBuilder = rows[0].builder();
  return vectorBuilder.fromIndexFunction(m, (i) =>
    getIndexOfClosestCentroid(rows[i], centroids, norm)
  );
}

function getIndexOfClosestCentroid(row: Vector, centroids: Vector[], norm: Norm): number {
  let min = Number.MAX_VALUE;
  let index = -1;

  centroids.forEach((centroid, i) => {
    const distance = norm(row.scalarMultiply(-1).add(centroid));
    if (distance < min) {
      min = distance;
      index = i;
    }
  });

  return index;
}

function updateCentroids(rows: Vector[], labels: Vector): Vector[] {
  const n = rows[0].getDimension();
  const zero = rows[0].builder().zeros(n);
  const clusters: Vector[][] = [];

  rows.forEach((row, i) => {
    const label = labels.getEntry(i);
    clusters[label] = clusters[label] || [];
    clusters[label].push(row);
  });

  const centroids = clusters.map((cluster) => {
    if (!cluster || !cluster.length) {
      throw new Error('TODO: re-initialize');
    }
    const clusterSize = cluster.length;
    const sum = cluster.reduce((curr, next) => curr.add(next), zero);
    return sum.scalarMultiply(1 / clusterSize);
  });

  return centroids;
}

function initializeCentroids(X: Matrix, k: number, n: number): Vector[] {
  const vectorBuilder = X.vectorBuilder();
  const ops = X.ops();
  ops.randomNormal;
  const means = mean(X);
  const stdDevs = standardDeviation(X).map((x) => 2 * x);

  const cols: Vector[] = [];
  for (let i = 0; i < n; i++) {
    cols.push(vectorBuilder.randomNormal(k, means.getEntry(i), stdDevs.getEntry(i)));
  }

  return X.builder().fromColumnVectors(cols).getRowVectors();
}
