import { Matrix } from '../../types/matrix/Matrix';
import { Vector } from '../../types/vector/Vector';
import { assertHomogeneous, assertNonEmpty } from '../../utilities/ErrorAssertions';
import { solveByGaussianElimination } from '../../operations/GaussJordan';
import { SolutionType } from '../../solvers/LinearSolution';

/**
 * The result of a least squares approximation.
 * @public
 */
export interface LeastSquaresApproximation<S> {
  /**
   * A vector whose entries correspond to the coefficients which must
   * be plugged into the function template to yield the best approximation function
   */
  coefficients: Vector<S>;
  /**
   * A function which takes a vector of the independent variable
   * values, and returns the predicted value of the dependent variable
   */
  approximationFunction: ApproximationFunction<S>;
}

/**
 * A function that takes a vector of inputs and produces an output.  This must always
 * be a pure function that is linear in its coefficients.
 * @public
 */
export type ApproximationFunction<S> = (input: Vector<S>) => S;

/**
 * A higher-order function which is used to generate an `ApproximationFunction`.  This
 * must be linear in its coefficients, or the result of the linear regression will not
 * be correct.
 * @public
 */
export type ApproximationFunctionTemplate<S> = (
  coefficients: Vector<S>
) => ApproximationFunction<S>;

/**
 * Calculates a linear regression model for the provided `dataPoints`.
 *
 * @remarks
 * The result is an object which has:
 * - `coefficients`: a vector whose first entry is the constant term, and whose
 *     following entries are the coefficients for the other independent variables, in
 *     the same order they appear in the `dataPoints`
 * - `approximationFunction`: a function which takes a vector of the independent variable
 *     values, and returns the predicted value of the dependent variable
 *
 * @param dataPoints - An array of vectors, each of which
 *    represents a single data point where the last entry is the variable to be predicted,
 *    and the other entries are the values of the independent variables
 * @returns - the result of the linear regression
 * @public
 */
export function calculateLinearLeastSquares<S>(
  dataPoints: Vector<S>[]
): LeastSquaresApproximation<S> {
  assertNonEmpty(dataPoints);
  assertHomogeneous(dataPoints);

  const ops = dataPoints[0].ops();
  const numberOfIndependentVariables = dataPoints[0].getDimension() - 1;

  const linearFunctionTemplate: ApproximationFunctionTemplate<S> = coefficients => {
    return (input: Vector<S>) => {
      let value = coefficients.getEntry(0); // constant term
      for (let i = 1; i < coefficients.getDimension(); i++) {
        const newTerm = ops.multiply(coefficients.getEntry(i), input.getEntry(i - 1));
        value = ops.add(value, newTerm);
      }
      return value;
    };
  };

  return calculateGeneralLeastSquares(
    dataPoints,
    linearFunctionTemplate,
    numberOfIndependentVariables + 1
  );
}

/**
 * Calculates a regression model for an arbitrary function.
 *
 * @remarks
 * The result is on object which has:
 * - `coefficients`: a vector whose entries correspond to the coefficients which must
 *     be plugged into the function template to yield the best approximation function
 * - `approximationFunction`: a function which takes a vector of the independent variable
 *     values, and returns the predicted value of the dependent variable
 *
 * @param dataPoints - The data used to construct the approximation
 * @param functionTemplate - A higher-order
 *     function which takes a vector of coefficients and yields a new function which takes
 *     a vector of independent variables to produce a value for the dependent variable
 * @param numberOfTerms - The number of coefficients needed to produce
 *     the approximation function
 * @returns - the result of the linear regression
 * @public
 */
export function calculateGeneralLeastSquares<S>(
  dataPoints: Vector<S>[],
  functionTemplate: ApproximationFunctionTemplate<S>,
  numberOfTerms: number
): LeastSquaresApproximation<S> {
  assertNonEmpty(dataPoints);
  assertHomogeneous(dataPoints);

  const matrixBuilder = dataPoints[0].matrixBuilder();
  const vectorBuilder = dataPoints[0].builder();

  const numberOfIndependentVariables = dataPoints[0].getDimension() - 1;
  const numberOfDataPoints = dataPoints.length;

  const getEntryInA: (dataPointIndex: number, coefficientIndex: number) => S = (
    dataPointIndex,
    coefficientIndex
  ) => {
    // Use the output value that would occur at this data point if this
    // were the only nonzero coefficient and it were one
    const elementaryCoefficients = vectorBuilder.elementaryVector(numberOfTerms, coefficientIndex);
    const inputs = dataPoints[dataPointIndex];
    const hypotheticalApproximationFunction = functionTemplate(elementaryCoefficients);
    return hypotheticalApproximationFunction(inputs);
  };

  const getEntryInOutputVector: (index: number) => S = index => {
    return dataPoints[index].getEntry(numberOfIndependentVariables); // last entry
  };

  const A = matrixBuilder.fromIndexFunction([numberOfDataPoints, numberOfTerms], getEntryInA);
  const outputVector = vectorBuilder.fromIndexFunction(numberOfDataPoints, getEntryInOutputVector);

  const coefficients = solveOverdeterminedSystem(A, outputVector);
  const approximationFunction = functionTemplate(coefficients);
  return { coefficients, approximationFunction };
}

/**
 * Gives an approximate solution to an overdetermined linear system.
 *
 * @remarks
 * When the system _Ax = b_ is overdetermined, it has no solution.
 * However, there exists a unique vector _x_ which minimizes the  difference Ax-b,
 * which solves `A.transpose().multiply(A).apply(x) === A.transpose().apply(b)`
 *
 * @param A - The matrix _A_ in _Ax = b_
 * @param b - The vector _b_ in _Ax = b_
 * @public
 */
export function solveOverdeterminedSystem<S>(A: Matrix<S>, b: Vector<S>): Vector<S> {
  checkDimensionsForOverdeterminedSystem(A, b);

  const aTrans = A.adjoint();
  const aTransB = aTrans.apply(b);
  const aTransA = aTrans.multiply(A);

  const leastSquaresSolution = solveByGaussianElimination(aTransA, aTransB);
  if (leastSquaresSolution.solutionType === SolutionType.UNIQUE) {
    return leastSquaresSolution.solution;
  } else if (leastSquaresSolution.solutionType === SolutionType.UNDERDETERMINED) {
    return leastSquaresSolution.solution;
  } else {
    throw Error('Unexpectedly encountered overdetermined system');
  }
}

function checkDimensionsForOverdeterminedSystem<S>(A: Matrix<S>, b: Vector<S>): void {
  if (A.getNumberOfRows() !== b.getDimension()) {
    throw new Error('Dimension mismatch');
  }
}
