import { Matrix } from '../types/matrix/Matrix';
import { Vector } from '../types/vector/Vector';
import { inverse } from './GaussJordan';
import { assertHomogeneous, assertNonEmpty } from '../utilities/ErrorAssertions';

export type DataPoint<ScalarType> = Vector<ScalarType>;

export type LeastSquaresApproximation<ScalarType> = {
  coefficients: Vector<ScalarType>;
  approximationFunction: ApproximationFunction<ScalarType>;
};

export type ApproximationFunction<ScalarType> = (input: Vector<ScalarType>) => ScalarType;

export type ApproximationFunctionTemplate<ScalarType> = (
  coefficients: Vector<ScalarType>
) => ApproximationFunction<ScalarType>;

export function calculateLinearLeastSquaresApproximation<ScalarType>(
  dataPoints: DataPoint<ScalarType>[]
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

export function calculateGeneralLeastSquaresApproximation<ScalarType>(
  dataPoints: DataPoint<ScalarType>[],
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
    const coefficients = vectorBuilder.elementaryVector(numberOfTerms, coefficientIndex);
    const inputs = dataPoints[dataPointIndex];
    const hypotheticalApproximationFunction = functionTemplate(coefficients);
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
 * This function returns the approximate solution _x_, or undefined
 * if _x_ does not exist
 *
 * @param {Matrix<ScalarType>} A - the matrix _A_ in _Ax = b_
 * @param {Vector<ScalarType>} b - the vector _b_ in _Ax = b_
 */
export function solveOverdeterminedSystem<ScalarType>(
  A: Matrix<ScalarType>,
  b: Vector<ScalarType>
): Vector<ScalarType> | undefined {
  checkDimensionsForOverdeterminedSystem(A, b);

  const At = A.adjoint();
  const Atb = At.apply(b);
  const AtA = At.multiply(A);
  const AtAInverse = inverse(AtA);

  if (!AtAInverse) {
    return undefined;
  }

  return AtAInverse.apply(Atb);
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
