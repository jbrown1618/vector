import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';

export enum SolutionType {
  UNIQUE = 'Unique',
  UNDERDETERMINED = 'Underdetermined',
  OVERDETERMINED = 'Overdetermined'
}

export interface UniqueSolution<S> {
  solutionType: SolutionType.UNIQUE;
  solution: Vector<S>;
}

export interface OverdeterminedSolution {
  solutionType: SolutionType.OVERDETERMINED;
}

export interface UnderdeterminedSolution<S> {
  solutionType: SolutionType.UNDERDETERMINED;
  solution: Vector<S>;
}

export type LinearSolution<S> =
  | UniqueSolution<S>
  | OverdeterminedSolution
  | UnderdeterminedSolution<S>;

export type Solver<S> = (A: Matrix<S>, b: Vector<S>) => LinearSolution<S>;
