# Usage Guide

## Installation

To add **Vector** to your project, run

```
npm i --save @jbrown/vector
```

## Example

### JavaScript - simulate a bounce

```javascript
import { NumberVector, NumberMatrix } from '@jbrown/vector';

const reflectVertically = NumberMatrix.builder().fromData([[1, 0], [0, -1]]);

const velocity = NumberVector.builder().fromValues([5, -3]);

const reflectedVelocity = reflectVertically.apply(velocity);

console.log(reflectedVelocity.getData()); // [5, 3]
```
