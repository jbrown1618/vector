<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [GaussianKernel](./vector.gaussiankernel.md)

## GaussianKernel() function

Creates a gaussian [Kernel](./vector.kernel.md) for use in a [SupportVectorMachineClassifier](./vector.supportvectormachineclassifier.md)<!-- -->. The gaussian kernel converts a data [Matrix](./vector.matrix.md) into a similarity `Matrix` where the value of entry (i,j) expresses the similarity of rows i and j in the original data set.

<b>Signature:</b>

```typescript
export declare function GaussianKernel(sigmaSquared: number): Kernel;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  sigmaSquared | number | The variance of the gaussian distribution used in the kernel |

<b>Returns:</b>

[Kernel](./vector.kernel.md)

