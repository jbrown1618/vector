import { Matrix } from '..';
import { Vector } from '../types/vector/Vector';

export enum SolutionType {
  UNIQUE = 'Unique',
  UNDERDETERMINED = 'Underdetermined',
  OVERDETERMINED = 'Overdetermined'
}

export interface UniqueSolution<ScalarType> {
  solutionType: SolutionType.UNIQUE;
  solution: Vector<ScalarType>;
}

export interface OverdeterminedSolution {
  solutionType: SolutionType.OVERDETERMINED;
}

export interface UnderdeterminedSolution<ScalarType> {
  solutionType: SolutionType.UNDERDETERMINED;
  solution: Vector<ScalarType>;
}

export type LinearSolution<ScalarType> =
  | UniqueSolution<ScalarType>
  | OverdeterminedSolution
  | UnderdeterminedSolution<ScalarType>;

export type Solver<ScalarType> = (
  A: Matrix<ScalarType>,
  b: Vector<ScalarType>
) => LinearSolution<ScalarType>;
