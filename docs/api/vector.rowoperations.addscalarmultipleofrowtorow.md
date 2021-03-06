<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [RowOperations](./vector.rowoperations.md) &gt; [addScalarMultipleOfRowToRow](./vector.rowoperations.addscalarmultipleofrowtorow.md)

## RowOperations.addScalarMultipleOfRowToRow() method

An elementary row operations which returns a new matrix whose row at `targetRow` has had a scalar multiple of `rowToAdd` added to it.

<b>Signature:</b>

```typescript
static addScalarMultipleOfRowToRow<S>(matrix: Matrix<S>, targetRow: number, rowToAdd: number, scalar: S): Matrix<S>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  matrix | [Matrix](./vector.matrix.md)<!-- -->&lt;S&gt; | The original matrix |
|  targetRow | number | The index of the row to modify |
|  rowToAdd | number | The index of the row to be scaled and added |
|  scalar | S | The factor by which to scale the row |

<b>Returns:</b>

[Matrix](./vector.matrix.md)<!-- -->&lt;S&gt;

The matrix with the transformation applied

