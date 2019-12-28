import { Vector } from '@lib/types/vector/Vector';
import { euclideanNorm } from '@lib/operations/Norms';
import { loadTestData } from '@test-utils/testData';
import { RadialBasisFunction } from '@lib/applications/machine-learning/kernels/RadialBasisFunction';

describe('RadialBasisFunction', () => {
  it('constructs a similarity matrix given a similarity metric', () => {
    // Note: this is a distance metric rather than a similarity metric,
    // but for testing purposes it works just fine.
    const metric = (v1: Vector<number>, v2: Vector<number>) =>
      euclideanNorm(v1.add(v2.scalarMultiply(-1)));

    const data = loadTestData('iris');
    const kerneled = RadialBasisFunction(metric)(data);

    expect(kerneled).toMatchSnapshot();
  });
});
