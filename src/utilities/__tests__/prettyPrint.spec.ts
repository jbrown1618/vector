import { vec, mat } from '../aliases';
import { ComplexVector } from '../../types/vector/ComplexVector';
import { ComplexNumber } from '../../types/scalar/ComplexNumber';
import { ComplexMatrix } from '../../types/matrix/ComplexMatrix';
import { prettyPrint } from '../prettyPrint';

describe('prettyPrint', () => {
  test('prints a NumberVector', () => {
    const v = vec([1, 22, 333]);
    expect(prettyPrint(v)).toMatchSnapshot();

    const u = vec([1, 0.222, 1 / 3]);
    expect(prettyPrint(u)).toMatchSnapshot();
  });

  test('prints a ComplexVector', () => {
    const v = ComplexVector.builder().fromArray([
      new ComplexNumber(1, 1),
      new ComplexNumber(2, 22),
      new ComplexNumber(33, 333)
    ]);
    expect(prettyPrint(v)).toMatchSnapshot();
  });

  test('prints a NumberMatrix', () => {
    const v = mat([
      [1, 22222, 333],
      [444, 5, 6],
      [77, 88, 9999]
    ]);
    expect(prettyPrint(v)).toMatchSnapshot();
  });

  test('prints a ComplexMatrix', () => {
    const v = ComplexMatrix.builder().fromArray([
      [new ComplexNumber(1, 1), new ComplexNumber(22, 222), new ComplexNumber(33, 3)],
      [new ComplexNumber(44, 44), new ComplexNumber(5, 5), new ComplexNumber(6, 6)],
      [new ComplexNumber(7, 777), new ComplexNumber(888, 888), new ComplexNumber(9, 99999)]
    ]);
    expect(prettyPrint(v)).toMatchSnapshot();
  });
});
