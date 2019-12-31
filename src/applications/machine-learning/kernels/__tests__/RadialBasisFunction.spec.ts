import { loadTestData } from '@test-utils/testData';
import { roundMatrix } from '@test-utils/rounding';
import { Vector } from '../../../../types/vector/Vector';
import { euclideanNorm } from '../../../../operations/Norms';
import { RadialBasisFunction } from '../RadialBasisFunction';

describe('RadialBasisFunction', () => {
  it('constructs a similarity matrix given a similarity metric', () => {
    // Note: this is a distance metric rather than a similarity metric,
    // but for testing purposes it works just fine.
    const metric = (v1: Vector<number>, v2: Vector<number>) =>
      euclideanNorm(v1.add(v2.scalarMultiply(-1)));

    const data = loadTestData('iris');
    const kerneled = RadialBasisFunction(metric)(data);

    // Round to 6 decimal places to make sure snapshots pass on older versions of Node
    expect(roundMatrix(kerneled, 6)).toMatchSnapshot();
  });
});
