import { Vector } from '../../../types/vector/Vector';
import { Matrix } from '../../../types/matrix/Matrix';
import { Kernel } from './Kernel';

/**
 * A function which expresses the similarity of two {@link Vector}s as a number between
 * 0 (very dissimilar) and 1 (identical).
 *
 * @public
 */
export type SimilarityMetric = (v1: Vector<number>, v2: Vector<number>) => number;

/**
 * Creates a {@link Kernel} for use in a {@link SupportVectorMachineClassifier}.
 * The RBF kernel converts a data {@link Matrix} into a similarity `Matrix`
 * where the value of entry (i,j) expresses the similarity of rows i and j in
 * the original data set.
 *
 * @param distanceMetric - A {@link SimilarityMetric} which defines how the RBF
 *     kernel expresses the similarity between two vectors.
 *
 * @public
 */
export function RadialBasisFunction(distanceMetric: SimilarityMetric): Kernel {
  return (data: Matrix<number>, trainingData: Matrix<number> = data) => {
    const [m] = data.getShape();
    const [n] = trainingData.getShape();

    const rows = data.getRowVectors();
    const trainingRows = trainingData.getRowVectors();

    return data.builder().fromIndexFunction([m, n + 1], (i, j) => {
      if (j === 0) return 1; // Bias term
      return distanceMetric(rows[i], trainingRows[j - 1]);
    });
  };
}
