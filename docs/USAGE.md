# Usage Guide

## Installation

To add **Vector** to your project, run

```
npm i --save @josh-brown/vector
```

## Examples

Check out [the `vector-examples` repository](https://github.com/jbrown1618/vector-examples) for more!

### TypeScript - perform a linear regression over randomized data

```typescript
import {
  NumberVector,
  NumberMatrix,
  calculateLinearLeastSquaresApproximation
} from '@josh-brown/vector';

const slope = 4;
const intercept = NumberVector.builder().fill(3, 1000);
const horizontalJitter = NumberVector.randomNormal(1000, 0, 1);
const verticalJitter = NumberVector.randomNormal(1000, 0, 10);

// Generate approximately-linear test data
const x = linspace(0, 100, 0.1).add(horizontalJitter);
const y = x
  .scalarMultiply(slope)
  .add(intercept)
  .add(verticalJitter);

// Convert from the vectors of input/output to an array of vectors [xi, yi]
const dataPoints = NumberMatrix.fromColumnVectors([x, y]).getRowVectors();
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
const bounce = mat([[1, 0], [0, -1]]);
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
