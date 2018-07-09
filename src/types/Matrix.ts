import { LinearTransformation } from './LinearTransformation';
import { Vector, VectorData } from './Vector';
import { ScalarContainer } from './ScalarContainer';

export type MatrixData<ScalarType> = Array<VectorData<ScalarType>>;
export type MatrixEntryCallback<ScalarType> = (
  entry: ScalarType,
  rowIndex: number,
  columnIndex: number
) => void;

export interface Matrix<ScalarType>
  extends LinearTransformation<Vector<ScalarType>, Vector<ScalarType>>,
    ScalarContainer<ScalarType> {
  getData(): MatrixData<ScalarType>;

  getNumberOfRows(): number;

  getNumberOfColumns(): number;

  getRowVectors(): Array<Vector<ScalarType>>;

  getRow(rowIndex: number): Vector<ScalarType>;

  getColumnVectors(): Array<Vector<ScalarType>>;

  getColumn(columnIndex: number): Vector<ScalarType>;

  getEntry(rowIndex: number, columnIndex: number): ScalarType;

  set(rowIndex: number, columnIndex: number, value: ScalarType): Matrix<ScalarType>;

  multiply(other: Matrix<ScalarType>): Matrix<ScalarType>;

  adjoint(): Matrix<ScalarType>;

  transpose(): Matrix<ScalarType>;

  add(other: Matrix<ScalarType>): Matrix<ScalarType>;

  scalarMultiply(scalar: ScalarType): Matrix<ScalarType>;

  equals(other: Matrix<ScalarType>): boolean;

  forEachEntry(cb: MatrixEntryCallback<ScalarType>): void;
}
