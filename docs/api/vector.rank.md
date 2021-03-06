<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [rank](./vector.rank.md)

## rank() function

Calculates the rank of a matrix

<b>Signature:</b>

```typescript
export declare function rank<S>(matrix: Matrix<S>): number;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  matrix | [Matrix](./vector.matrix.md)<!-- -->&lt;S&gt; | the matrix for which to determine the rank |

<b>Returns:</b>

number

## Remarks

The rank of a matrix A is the dimension of the vector space spanned by the columns of A. Equivalently, it is the number of pivot entries in the row-echelon form of A, or the number of nonzero rows in the row echelon form of A.

