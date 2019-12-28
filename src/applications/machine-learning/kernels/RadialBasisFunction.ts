import { Vector } from '@lib/types/vector/Vector';
import { Kernel } from '@lib/applications/machine-learning/kernels/Kernel';
import { Matrix } from '@lib/types/matrix/Matrix';

export type DistanceMetric = (v1: Vector<number>, v2: Vector<number>) => number;

export function RadialBasisFunction(distanceMetric: DistanceMetric): Kernel {
  return (data: Matrix<number>) => {
    const [m] = data.getShape();
    const rows = data.getRowVectors();
    return data.builder().fromIndexFunction([m, m], (i, j) => {
      return distanceMetric(rows[i], rows[j]);
    });
  };
}
