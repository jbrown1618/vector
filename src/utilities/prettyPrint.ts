import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';

/**
 * Returns an easy-to-read string representing a `number`
 * @public
 */
export function prettyPrint(num: number): string;

/**
 * Returns an easy-to-read string representing the contents of a {@link Vector}
 * @public
 */
export function prettyPrint<S>(vector: Vector<S>): string;

/**
 * Returns an easy-to-read string representing the contents of a {@link Matrix}
 * @public
 */
export function prettyPrint<S>(matrix: Matrix<S>): string;

export function prettyPrint<S>(input: number | Vector<S> | Matrix<S>): string {
  if (typeof input === 'number') {
    return prettyPrintNumber(input);
  }
  const isVector = !!(input as any).innerProduct;
  if (isVector) {
    return prettyPrintVector(input as Vector<S>);
  } else {
    return prettyPrintMatrix(input as Matrix<S>);
  }
}

function prettyPrintNumber(num: number): string {
  const str = num.toString();
  const fixed = num.toFixed(6);
  return str.length > fixed.length ? fixed : str;
}

function prettyPrintVector<S>(vector: Vector<S>): string {
  const ops = vector.ops();
  const width = getPrintWidth(vector);
  const prettyData = vector.toArray().map(val => ops.prettyPrint(val));
  return prettyData.map(value => '[ ' + spaces(width - value.length) + value + ' ]').join('\n');
}

function prettyPrintMatrix<S>(matrix: Matrix<S>): string {
  const ops = matrix.ops();
  const widthByCol = matrix.getColumnVectors().map(col => getPrintWidth(col));
  const prettyData = matrix.toArray().map(rowArr => rowArr.map(val => ops.prettyPrint(val)));

  return prettyData
    .map(
      rowArr =>
        '[ ' +
        rowArr.map((val, colIndex) => spaces(widthByCol[colIndex] - val.length) + val).join('  ') +
        ' ]'
    )
    .join('\n');
}

function getPrintWidth<S>(v: Vector<S>): number {
  return v
    .toArray()
    .map(val => v.ops().prettyPrint(val))
    .map(str => str.length)
    .reduce((max, curr) => (curr > max ? curr : max), 0);
}

function spaces(n: number): string {
  let sp = '';
  for (let i = 0; i < n; i++) {
    sp = sp + ' ';
  }
  return sp;
}
