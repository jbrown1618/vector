<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [LinearKernel](./vector.linearkernel.md)

## LinearKernel() function

A linear kernel for use in a [SupportVectorMachineClassifier](./vector.supportvectormachineclassifier.md)<!-- -->. The linear kernel converts a data [Matrix](./vector.matrix.md) into a matrix which has been prepended with a column of all ones, representing the constant term in a linear model, or the bias term in an SVM.

<b>Signature:</b>

```typescript
export declare function LinearKernel(data: Matrix): Matrix;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  data | [Matrix](./vector.matrix.md) | The variance of the gaussian distribution used in the kernel |

<b>Returns:</b>

[Matrix](./vector.matrix.md)

