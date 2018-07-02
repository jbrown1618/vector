import { MatrixBuilder, VectorBuilder, VectorIndexFunction } from '..';
import { Matrix } from '../Matrix';

export function linspace(xMin: number, xMax: number, binCount: number) {
  const indexToX: VectorIndexFunction = index => {
    return xMin + ((xMax - xMin) / binCount) * index;
  };

  return VectorBuilder.fromIndexFunction(indexToX, binCount);
}

export function forwardDifferenceMatrix(binCount: number): Matrix {
  return MatrixBuilder.tridiagonal(
    VectorBuilder.zeros(binCount - 1),
    VectorBuilder.ones(binCount).scalarMultiply(-1),
    VectorBuilder.ones(binCount - 1)
  );
}

export function backwardDifferenceMatrix(binCount: number): Matrix {
  return MatrixBuilder.tridiagonal(
    VectorBuilder.ones(binCount - 1).scalarMultiply(-1),
    VectorBuilder.ones(binCount),
    VectorBuilder.zeros(binCount - 1)
  );
}

export function centralDifferenceMatrix(binCount: number): Matrix {
  return MatrixBuilder.tridiagonal(
    VectorBuilder.ones(binCount - 1).scalarMultiply(-1 / 2),
    VectorBuilder.zeros(binCount),
    VectorBuilder.ones(binCount - 1).scalarMultiply(1 / 2)
  );
}

export function derivative(f: (x: number) => number, xMin: number, xMax: number, binCount: number) {
  const x = linspace(xMin, xMax, binCount);
  const y = VectorBuilder.transform(x, f);
  const delta = x.getEntry(0) - x.getEntry(1);

  const D = centralDifferenceMatrix(binCount);
  return D.apply(y).scalarMultiply(1 / delta);
}
