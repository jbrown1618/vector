<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [isOrthogonal](./vector.isorthogonal.md)

## isOrthogonal() function

Tests if a matrix is orthogonal

<b>Signature:</b>

```typescript
export declare function isOrthogonal<S>(matrix: Matrix<S>): boolean;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  matrix | <code>Matrix&lt;S&gt;</code> |  |

<b>Returns:</b>

`boolean`

`true` if the matrix is orthogonal.

## Remarks

A matrix is orthogonal if each column is orthogonal to each other column. That is, if for each pair of columns, their inner product is 0.
