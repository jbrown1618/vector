<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [ArrayMatrix](./vector.arraymatrix.md) &gt; [combine](./vector.arraymatrix.combine.md)

## ArrayMatrix.combine() method

Builds a matrix by combining element-wise the values of this matrix with the values of another matrix.

<b>Signature:</b>

```typescript
combine(other: Matrix<S>, combineEntries: (a: S, b: S) => S): Matrix<S>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  other | <code>Matrix&lt;S&gt;</code> |  |
|  combineEntries | <code>(a: S, b: S) =&gt; S</code> |  |

<b>Returns:</b>

`Matrix<S>`

The new matrix
