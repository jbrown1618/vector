import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parse/lib/sync';
import { Matrix } from '@src/types/matrix/Matrix';
import { mat } from '@src/utilities/aliases';

const cache: Map<string, Matrix<number>> = new Map();

export function loadData(name: string): Matrix<number> {
  if (cache.has(name)) return cache.get(name) as Matrix<number>;

  const contents = fs.readFileSync(path.resolve(__dirname, '../data/', name + '.csv')).toString();
  const data = csv(contents) as number[][];
  return mat(data);
}
