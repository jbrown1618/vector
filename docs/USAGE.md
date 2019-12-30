# Usage Guide

## Installation

To add **Vector** to your project, run

```
npm i --save @josh-brown/vector
```

## Basic Usage

The most important interfaces are `Matrix` and `Vector`.
These are generic and can support any numeric data type.
Whenever possible, use the default implementations;
calling `vec([1, 2, 3])`, `mat([[1, 0], [0, 1]])`, `eye(3)`, or similar will
yield the fastest implementation for `Matrix<number>` and `Vector<number>`.

```typescript
import { mat, vec, Matrix, Vector } from '@josh-brown/vector';

const A: Matrix<number> = mat([
  [1, 0],
  [0, 2]
]);
const x: Vector<number> = vec([3, 4]);

const transformedVector: Vector<number> = A.apply(x);
```

Several `Matrix` and `Vector` implementations are provided with different use cases:

- `FloatMatrix` / `FloatVector` - The default, fastest implementations, which use JavaScript typed arrays.
- `NumberMatrix` / `NumberVector` - Slower, but use a more intuitive 2-D array to store the data.
- `ComplexMatrix` / `ComplexVector` - Uses the `ComplexNumber` data type
- `SparseNumberMatrix` / `SparseNumberVector` - May be more efficient for large matrices and
  vectors with relatively few nonzero entries

When `mat`, `vec`, `eye`, `ones`, `zeros`, and `diag` do not fit your matrix-building needs,
what you need is a `MatrixBuilder` or `VectorBuilder`.
This is useful when you want to specify a specific data type or storage scheme,
or if you want to use one of the less-common matrix generation functions.
You can get one from one of the matrix or vector implementation classes above.

```typescript
import { SparseNumberMatrix, SparseNumberVector } from '@josh-brown/vector';

const vectorBuilder = SparseNumberVector.builder();
const matrixBuilder = SparseNumberMatrix.builder();

const e4 = vectorBuilder.elementaryVector(10, 4);
// [0 0 0 0 1 0 0 0 0 0]

// All matrix and vector implementations are immutable, so `set` returns a new vector
const myVector = e4.set(1, 7);
// [0 7 0 0 1 0 0 0 0 0]

// This matrix will store the data very compactly, since the sparse
// matrix implementation only stores nonzero entries.
const myMatrix = matrixBuilder.circulant(myVector);
// [0 7 0 0 1 0 0 0 0 0]
// [0 0 7 0 0 1 0 0 0 0]
// [0 0 0 7 0 0 1 0 0 0]
// [0 0 0 0 7 0 0 1 0 0]
// [0 0 0 0 0 7 0 0 1 0]
// [0 0 0 0 0 0 7 0 0 1]
// [1 0 0 0 0 0 0 7 0 0]
// [0 1 0 0 0 0 0 0 7 0]
// [0 0 1 0 0 0 0 0 0 7]
// [7 0 0 1 0 0 0 0 0 0]
```

Basic matrix and vector operations are methods in the `Vector` and `Matrix` interfaces.
Many of the other things you might want to do are exposed as free-floating functions.

```typescript
import { FloatMatrix, FloatVector, calculateQRDecomposition } from '@josh-brown/vector';

// 10x10 matrix with random values ranging from -1 to 1
const randomMatrix = FloatMatrix.builder().random([10, 10], -1, 1);

// Decompose the matrix
const { Q, R } = calculateQRDecomposition(randomMatrix);

// Reconstruct the matrix
const reconstructed = Q.multiply(R);
```

## Examples

Check out [the `vector-examples` repository](https://github.com/jbrown1618/vector-examples) for more!

### TypeScript - perform a linear regression over randomized data

```typescript
import {
  FloatVector,
  FloatMatrix,
  calculateLinearLeastSquaresApproximation
} from '@josh-brown/vector';

const vb = FloatVector.builder();
const mb = FloatMatrix.builder();

const slope = 4;
const intercept = vb.fill(3, 1000);
const horizontalJitter = vb.randomNormal(1000, 0, 1);
const verticalJitter = vb.randomNormal(1000, 0, 10);

// Generate approximately-linear test data
const x = linspace(0, 100, 0.1).add(horizontalJitter);
const y = x
  .scalarMultiply(slope)
  .add(intercept)
  .add(verticalJitter);

// Convert from the vectors of input/output to an array of vectors [xi, yi]
const dataPoints = mb.fromColumnVectors([x, y]).getRowVectors();
const approximation = calculateLinearLeastSquaresApproximation(dataPoints);

const coefficients = approximation.coefficients;
console.log(coefficients); // Should be approximately [3, 4]

const predict = approximation.approximationFunction;
console.log(predict(50)); // Should be approximately 203 (3 + 4*50)
```

### JavaScript with ES Modules - simulate a bounce

```javascript
import { vec, mat } from '@josh-brown/vector';

let position = vec([0, 0]);
let velocity = vec([1, 1]);
const acceleration = vec([0, -9.8]);
const bounce = mat([
  [1, 0],
  [0, -1]
]);
const timeStep = 0.001;

for (let t = 0; t < 10; t += timeStep) {
  position = position.add(velocity.scalarMultiply(timeStep));
  velocity = velocity.add(acceleration.scalarMultiply(timeStep));

  if (position.getEntry(1) <= 0) {
    // if we are at or below the baseline, bounce!
    velocity = bounce.apply(velocity);
  }
}
```

### JavaScript with CommonJS Modules - Row-Echelon Form for a random 5x5 matrix

```javascript
const v = require('@josh-brown/vector');

const A = v.NumberMatrix.builder().random(5);
const ref = v.rowEchelonForm(A);
```
