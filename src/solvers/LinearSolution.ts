import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';

/**
 * Types of solution to a linear system.
 * @public
 */
export enum SolutionType {
  /**
   * A system with exactly one solution.
   */
  UNIQUE = 'Unique',
  /**
   * A system with infinitely many solutions. An arbitrary example is provided.
   */
  UNDERDETERMINED = 'Underdetermined',
  /**
   * A system with no solution.
   */
  OVERDETERMINED = 'Overdetermined',
}

/**
 * The unique solution to a linear system.
 * @public
 */
export interface UniqueSolution<S> {
  solutionType: SolutionType.UNIQUE;
  /**
   * The unique vector _x_ which satisfies _Ax=b_
   */
  solution: Vector<S>;
}

/**
 * A type representing the lack of solution to a linear system.
 * @public
 */
export interface OverdeterminedSolution {
  solutionType: SolutionType.OVERDETERMINED;
}

/**
 * A particular solution to a linear system with infinitely many solutions.
 * @public
 */
export interface UnderdeterminedSolution<S> {
  solutionType: SolutionType.UNDERDETERMINED;
  /**
   * An arbitrarily chosen vector _x_ which satisfies _Ax=b_
   */
  solution: Vector<S>;
}

/**
 * A general type representing any type of solution to a linear system.
 * @public
 */
export type LinearSolution<S> =
  | UniqueSolution<S>
  | OverdeterminedSolution
  | UnderdeterminedSolution<S>;

/**
 * A function that solves a linear system _Ax=b_
 * @public
 */
export type Solver<S> = (A: Matrix<S>, b: Vector<S>) => LinearSolution<S>;
