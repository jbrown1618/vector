import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parse/lib/sync';
import csvWriter from 'csv-stringify/lib/sync';
import { Matrix } from '../../src/types/matrix/Matrix';
import { mat } from '../../src/utilities/aliases';

const cache: Map<string, Matrix> = new Map();

export function loadTestData(name: string): Matrix {
  if (cache.has(name)) return cache.get(name) as Matrix;

  const contents = fs.readFileSync(path.resolve(__dirname, '../data/', name + '.csv')).toString();
  const data = (csvParser(contents) as any[][]).map((row) => row.map((entry) => parseFloat(entry)));
  return mat(data);
}

export function writeTestData(name: string, matrix: Matrix): void {
  const contents = csvWriter(matrix.toArray());
  fs.writeFileSync(path.resolve(__dirname, '../data/', name + '.csv'), contents);
}
