import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { assertHomogeneous, assertNonEmpty } from '../utilities/ErrorAssertions';
import { solveByGaussianElimination } from './GaussJordan';
import { SolutionType } from './LinearSolution';

/**
 * The result of a least squares approximation.
 *
 * - `coefficiencts`: a vector whose entries correspond to the coefficients which must
 *     be plugged into the function template to yield the best approximation function
 * - `approximationFunction`: a function which takes a vector of the independent variable
 *     values, and returns the predicted value of the dependent variable
 */
export interface LeastSquaresApproximation<ScalarType> {
  coefficients: Vector<ScalarType>;
  approximationFunction: ApproximationFunction<ScalarType>;
}

/**
 * A function that takes a vector of inputs and produces an output.  This must always
 * be a pure function that is linear in its coefficients.
 */
export type ApproximationFunction<ScalarType> = (input: Vector<ScalarType>) => ScalarType;

/**
 * A higher-order function which is used to generate an `ApproximationFunction`.  This
 * must be linear in its coefficients, or the result of the linear regression will not
 * be correct.
 */
export type ApproximationFunctionTemplate<ScalarType> = (
  coefficients: Vector<ScalarType>
) => ApproximationFunction<ScalarType>;

/**
 * Calculates a linear regression model for the provided `dataPoints`.
 * The result is an object which has:
 *
 * - `coefficiencts`: a vector whose first entry is the constant term, and whose
 *     following entries are the coefficients for the other independent variables, in
 *     the same order they appear in the `dataPoints`
 * - `approximationFunction`: a function which takes a vector of the independent variable
 *     values, and returns the predicted value of the dependent variable
 *
 * @param dataPoints - An array of vectors, each of which
 *    represents a single data point where the last entry is the variable to be predicted,
 *    and the other entries are the values of the independent variables
 * @returns - the result of the linear regression
 */
export function calculateLinearLeastSquaresApproximation<ScalarType>(
  dataPoints: Vector<ScalarType>[]
): LeastSquaresApproximation<ScalarType> {
  assertNonEmpty(dataPoints);
  assertHomogeneous(dataPoints);

  const ops = dataPoints[0].ops();
  const numberOfIndependentVariables = dataPoints[0].getDimension() - 1;

  const linearFunctionTemplate = (coefficients: Vector<ScalarType>) => {
    return (input: Vector<ScalarType>) => {
      let value = coefficients.getEntry(0); // constant term
      for (let i = 1; i < coefficients.getDimension(); i++) {
        const newTerm = ops.multiply(coefficients.getEntry(i), input.getEntry(i - 1));
        value = ops.add(value, newTerm);
      }
      return value;
    };
  };

  return calculateGeneralLeastSquaresApproximation(
    dataPoints,
    linearFunctionTemplate,
    numberOfIndependentVariables + 1
  );
}

/**
 * Calculates a regression model for an arbitrary function.
 * The result is on object which has:
 *
 * - `coefficiencts`: a vector whose entries correspond to the coefficients which must
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
 */
export function calculateGeneralLeastSquaresApproximation<ScalarType>(
  dataPoints: Vector<ScalarType>[],
  functionTemplate: ApproximationFunctionTemplate<ScalarType>,
  numberOfTerms: number
): LeastSquaresApproximation<ScalarType> {
  assertNonEmpty(dataPoints);
  assertHomogeneous(dataPoints);

  const matrixBuilder = dataPoints[0].matrixBuilder();
  const vectorBuilder = dataPoints[0].builder();

  const numberOfIndependentVariables = dataPoints[0].getDimension() - 1;
  const numberOfDataPoints = dataPoints.length;

  const getEntryInA = (dataPointIndex: number, coefficientIndex: number) => {
    // Use the output value that would occur at this data point if this
    // were the only nonzero coefficient and it were one
    const elementaryCoefficients = vectorBuilder.elementaryVector(numberOfTerms, coefficientIndex);
    const inputs = dataPoints[dataPointIndex];
    const hypotheticalApproximationFunction = functionTemplate(elementaryCoefficients);
    return hypotheticalApproximationFunction(inputs);
  };

  const getEntryInOutputVector = (index: number) => {
    return dataPoints[index].getEntry(numberOfIndependentVariables); // last entry
  };

  const A = matrixBuilder.fromIndexFunction(numberOfDataPoints, numberOfTerms, getEntryInA);

  const outputVector = vectorBuilder.fromIndexFunction(numberOfDataPoints, getEntryInOutputVector);

  const coefficients = solveOverdeterminedSystem(A, outputVector);
  if (!coefficients) {
    throw Error('TODO - message');
  }

  const approximationFunction = functionTemplate(coefficients);

  return { coefficients, approximationFunction };
}

/**
 * When the system _Ax = b_ is overdetermined, it has no solution.
 * However, the difference Ax-b is minimized when
 *
 * ```
 * A.transpose().multiply(A).apply(x) === A.transpose().apply(b)
 * ```
 *
 * This function returns the approximate solution _x_, or `undefined`
 * if _x_ does not exist
 *
 * @param A - The matrix _A_ in _Ax = b_
 * @param b - The vector _b_ in _Ax = b_
 */
export function solveOverdeterminedSystem<ScalarType>(
  A: Matrix<ScalarType>,
  b: Vector<ScalarType>
): Vector<ScalarType> | undefined {
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
    return undefined;
  }
}

function checkDimensionsForOverdeterminedSystem<ScalarType>(
  A: Matrix<ScalarType>,
  b: Vector<ScalarType>
) {
  if (A.getNumberOfColumns() > A.getNumberOfRows()) {
    throw new Error('TODO - message');
  }

  if (A.getNumberOfRows() !== b.getDimension()) {
    throw new Error('TODO - message');
  }
}
