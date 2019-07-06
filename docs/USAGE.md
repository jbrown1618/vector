# Usage Guide

## Installation

To add **Vector** to your project, run

```
npm i --save @josh-brown/vector
```

## Example

### JavaScript with ES Modules - simulate a bounce

```javascript
import { NumberVector, NumberMatrix } from '@jbrown/vector';

let position = NumberVector.builder().zeros(2);
let velocity = NumberVector.builder().fromData([1, 1]);
const acceleration = NumberVector.builder().fromData([0, -9.8]);
const bounce = NumberMatrix.builder().fromData([[1, 0], [0, -1]]);
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
