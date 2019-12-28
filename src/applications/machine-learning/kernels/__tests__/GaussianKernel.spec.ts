import { loadTestData } from '@test-utils/testData';
import { GaussianKernel } from '../GaussianKernel';

describe('GaussianKernel', () => {
  it('has a mxm result', () => {
    const data = loadTestData('iris');
    const kerneled = GaussianKernel(1)(data);
    expect(kerneled.getShape()).toStrictEqual([150, 150]);
  });

  it('varies based on the sigmaSquared parameter', () => {
    const data = loadTestData('iris');
    let kerneled = GaussianKernel(1)(data);
    expect(kerneled).toMatchSnapshot();

    kerneled = GaussianKernel(10)(data);
    expect(kerneled).toMatchSnapshot();
  });
});
