import { expect } from 'chai';
import { NumberVector } from '../types/vector/NumberVector';
import { prettyPrint } from './prettyPrint';
import { NumberMatrix } from '../types/matrix/NumberMatrix';
import { ComplexVector } from '../types/vector/ComplexVector';
import { ComplexNumber } from '../types/scalar/ComplexNumber';
import { ComplexMatrix } from '../types/matrix/ComplexMatrix';

describe('prettyPrint', () => {
  it('prints a NumberVector', () => {
    const v = NumberVector.builder().fromData([1, 22, 333]);
    expect(prettyPrint(v)).to.equal('[   1 ]\n[  22 ]\n[ 333 ]');

    const u = NumberVector.builder().fromData([1, 0.222, 1 / 3]);
    expect(prettyPrint(u)).to.equal('[        1 ]\n[    0.222 ]\n[ 0.333333 ]');
  });

  it('prints a ComplexVector', () => {
    const v = ComplexVector.builder().fromData([
      new ComplexNumber(1, 1),
      new ComplexNumber(2, 22),
      new ComplexNumber(33, 333)
    ]);
    expect(prettyPrint(v)).to.equal('[    1 + 1i ]\n[   2 + 22i ]\n[ 33 + 333i ]');
  });

  it('prints a NumberMatrix', () => {
    const v = NumberMatrix.builder().fromData([[1, 22222, 333], [444, 5, 6], [77, 88, 9999]]);
    expect(prettyPrint(v)).to.equal(
      '[   1  22222   333 ]\n[ 444      5     6 ]\n[  77     88  9999 ]'
    );
  });

  it('prints a ComplexMatrix', () => {
    const v = ComplexMatrix.builder().fromData([
      [new ComplexNumber(1, 1), new ComplexNumber(22, 222), new ComplexNumber(33, 3)],
      [new ComplexNumber(44, 44), new ComplexNumber(5, 5), new ComplexNumber(6, 6)],
      [new ComplexNumber(7, 777), new ComplexNumber(888, 888), new ComplexNumber(9, 99999)]
    ]);
    expect(prettyPrint(v)).to.equal(
      '[   1 + 1i   22 + 222i     33 + 3i ]\n[ 44 + 44i      5 + 5i      6 + 6i ]\n[ 7 + 777i  888 + 888i  9 + 99999i ]'
    );
  });
});
