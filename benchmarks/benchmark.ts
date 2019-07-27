/* tslint:disable:no-console */
import * as fs from 'fs';
import {
  calculateLinearLeastSquares,
  calculateSingularValueDecomposition,
  inverse,
  linspace,
  NumberMatrix,
  NumberVector,
  solveByGaussianElimination
} from '../src';

const repetitions = 5;

interface Benchmark {
  description: string;
  entries: BenchmarkEntry[];
}

interface BenchmarkEntry {
  size: number;
  minTime: number;
  maxTime: number;
  meanTime: number;
}

generateBenchmarks();

function generateBenchmarks(): void {
  generateBenchmark(
    'matrix-plus-matrix',
    1,
    128,
    N => ({
      A: NumberMatrix.builder().random(N),
      B: NumberMatrix.builder().random(N)
    }),
    ({ A, B }) => A.add(B)
  );

  generateBenchmark(
    'matrix-times-matrix',
    1,
    128,
    N => ({
      A: NumberMatrix.builder().random(N),
      B: NumberMatrix.builder().random(N)
    }),
    ({ A, B }) => A.multiply(B)
  );

  generateBenchmark(
    'matrix-times-vector',
    1,
    128,
    N => ({
      A: NumberMatrix.builder().random(N),
      x: NumberVector.builder().random(N)
    }),
    ({ A, x }) => A.apply(x)
  );

  generateBenchmark(
    'invert-matrix',
    1,
    32,
    N => ({
      A: NumberMatrix.builder().random(N)
    }),
    ({ A }) => inverse(A)
  );

  generateBenchmark(
    'solve-system',
    1,
    50,
    N => ({
      A: NumberMatrix.builder().random(N),
      b: NumberVector.builder().random(N)
    }),
    ({ A, b }) => solveByGaussianElimination(A, b)
  );

  generateBenchmark(
    'linear-regression',
    3,
    128,
    N => {
      const xs = linspace(0, N, N);
      const ys = xs.scalarMultiply(2).add(NumberVector.builder().randomNormal(N));
      return NumberMatrix.builder()
        .fromColumnVectors([xs, ys])
        .getRowVectors();
    },
    dataPoints => calculateLinearLeastSquares(dataPoints)
  );

  generateBenchmark(
    'singular-value-decomposition',
    1,
    32,
    N => ({
      A: NumberMatrix.builder().random(N)
    }),
    ({ A }) => calculateSingularValueDecomposition(A)
  );
}

function generateBenchmark<T>(
  description: string,
  minSize: number,
  maxSize: number,
  prepare: (N: number) => T,
  runProcess: (data: T) => void
): void {
  console.log(`Benchmarking ${description}...`);

  const benchmark: Benchmark = {
    description,
    entries: []
  };

  for (let N = minSize; N <= maxSize; N++) {
    const timings: number[] = [];
    for (let i = 0; i < repetitions; i++) {
      const data = prepare(N);
      try {
        timings.push(time(() => runProcess(data)));
      } catch (error) {
        console.log(`Error benchmarking ${description} for N=${N} with data:`, data);
        console.error(error);
      }
    }

    benchmark.entries.push(generateEntry(N, timings));
  }

  writeBenchmarkToFile(benchmark);
}

function generateEntry(size: number, timings: number[]): BenchmarkEntry {
  let minTime = Number.MAX_VALUE;
  let maxTime = -Number.MAX_VALUE;
  let total = 0;
  timings.forEach(t => {
    if (t < minTime) {
      minTime = t;
    }

    if (t > maxTime) {
      maxTime = t;
    }

    total += t;
  });
  const meanTime = total / repetitions;

  return { size, minTime, maxTime, meanTime };
}

function writeBenchmarkToFile(benchmark: Benchmark): void {
  const csvHeader = `Size,Min Time,Max Time,Mean Time\n`;
  const csvBody = benchmark.entries
    .map(entry => `${entry.size},${entry.minTime},${entry.maxTime},${entry.meanTime}`)
    .join('\n');
  fs.writeFile(`benchmarks/latest/${benchmark.description}.csv`, csvHeader + csvBody, error => {
    if (error) {
      console.error(error);
    }
  });
}

function time(runProcess: () => void): number {
  const start = Date.now();
  runProcess();
  return Date.now() - start;
}
