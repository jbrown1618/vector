import { Vector } from '@lib/types/vector/Vector';
import { Matrix } from '@lib/types/matrix/Matrix';
import { Kernel } from '@lib/applications/machine-learning/kernels/Kernel';

export type SimilarityMetric = (v1: Vector<number>, v2: Vector<number>) => number;

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
