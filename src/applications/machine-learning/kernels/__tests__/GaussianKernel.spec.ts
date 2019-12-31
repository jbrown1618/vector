import { loadTestData } from '@test-utils/testData';
import { roundMatrix } from '@test-utils/rounding';
import { GaussianKernel } from '../GaussianKernel';

describe('GaussianKernel', () => {
  it('has a mxm+1 result', () => {
    const data = loadTestData('iris');
    const kerneled = GaussianKernel(1)(data);
    expect(kerneled.getShape()).toStrictEqual([150, 151]);
  });

  it('varies based on the sigmaSquared parameter', () => {
    const data = loadTestData('iris');
    let kerneled = GaussianKernel(1)(data);

    // Round to 6 decimal places to make sure snapshots pass on older versions of Node
    expect(roundMatrix(kerneled, 6)).toMatchSnapshot();

    kerneled = GaussianKernel(10)(data);

    // Round to 6 decimal places to make sure snapshots pass on older versions of Node
    expect(roundMatrix(kerneled, 6)).toMatchSnapshot();
  });
});
