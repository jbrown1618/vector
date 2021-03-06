<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [RadialBasisFunction](./vector.radialbasisfunction.md)

## RadialBasisFunction() function

Creates a [Kernel](./vector.kernel.md) for use in a [SupportVectorMachineClassifier](./vector.supportvectormachineclassifier.md)<!-- -->. The RBF kernel converts a data [Matrix](./vector.matrix.md) into a similarity `Matrix` where the value of entry (i,j) expresses the similarity of rows i and j in the original data set.

<b>Signature:</b>

```typescript
export declare function RadialBasisFunction(distanceMetric: SimilarityMetric): Kernel;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  distanceMetric | [SimilarityMetric](./vector.similaritymetric.md) | A [SimilarityMetric](./vector.similaritymetric.md) which defines how the RBF kernel expresses the similarity between two vectors. |

<b>Returns:</b>

[Kernel](./vector.kernel.md)

