<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [VectorBuilder](./vector.vectorbuilder.md)

## VectorBuilder class

Provides methods for constructing [Vector](./vector.vector.md)<!-- -->s of a given type

<b>Signature:</b>

```typescript
export declare class VectorBuilder<S, V extends Vector<S>> 
```

## Remarks

The constructor for this class is marked as internal. Third-party code should not call the constructor directly or create subclasses that extend the `VectorBuilder` class.

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [concatenate(first, second)](./vector.vectorbuilder.concatenate.md) |  | Constructs a vector consisting of two vectors end-to-end |
|  [elementaryVector(dimension, oneIndex)](./vector.vectorbuilder.elementaryvector.md) |  | Constructs a vector that has the value 1 at one index, and 0 at the others |
|  [empty()](./vector.vectorbuilder.empty.md) |  | Constructs a Vector of dimension 0 |
|  [fill(value, dimension)](./vector.vectorbuilder.fill.md) |  | Constructs a vector whose entries are all equal to the provided value |
|  [fromArray(data)](./vector.vectorbuilder.fromarray.md) |  |  |
|  [fromIndexFunction(dimension, valueFromIndex)](./vector.vectorbuilder.fromindexfunction.md) |  | Constructs a vector with entries given by \_entry = f(i)\_ where \_f\_ is <code>valueFromIndex</code> and <code>i</code> is the index of the element |
|  [fromNumberArray(data)](./vector.vectorbuilder.fromnumberarray.md) |  |  |
|  [fromSparseData(dimension, sparseData)](./vector.vectorbuilder.fromsparsedata.md) |  |  |
|  [fromValues(data)](./vector.vectorbuilder.fromvalues.md) |  |  |
|  [ones(dimension)](./vector.vectorbuilder.ones.md) |  | Constructs a vector of all ones |
|  [random(dimension, min, max)](./vector.vectorbuilder.random.md) |  | Constructs a vector whose entries are (uniformly-distributed) random numbers between <code>min</code> and <code>max</code> |
|  [randomNormal(dimension, mean, standardDeviation)](./vector.vectorbuilder.randomnormal.md) |  | Constructs a vector whose entries are normally distributed, with the specified mean and standard deviation |
|  [shift(vector, offset, reverse)](./vector.vectorbuilder.shift.md) |  | Constructs a vector whose entries match the input vector, but offset by a given amount |
|  [zeros(dimension)](./vector.vectorbuilder.zeros.md) |  | Constructs a vector of all zeros |

