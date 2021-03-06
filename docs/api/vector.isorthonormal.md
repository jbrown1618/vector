<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [isOrthonormal](./vector.isorthonormal.md)

## isOrthonormal() function

Tests if a matrix is orthonormal

<b>Signature:</b>

```typescript
export declare function isOrthonormal<S>(matrix: Matrix<S>): boolean;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  matrix | [Matrix](./vector.matrix.md)<!-- -->&lt;S&gt; |  |

<b>Returns:</b>

boolean

`true` if the matrix is orthonormal

## Remarks

A matrix is orthonormal if is [orthogonal](./vector.isorthogonal.md) and if its columns all have norm 1. An orthonormal matrix multiplied by its transpose is an identity.

