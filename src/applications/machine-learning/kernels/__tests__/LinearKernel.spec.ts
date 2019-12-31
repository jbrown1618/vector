import { loadTestData } from '@test-utils/testData';
import { LinearKernel } from '../LinearKernel';

describe('LinearKernel', () => {
  it('returns the original data with a bias term applied', () => {
    const data = loadTestData('iris');
    const kerneled = LinearKernel(data);
    expect(kerneled).toMatchSnapshot();
  });
});
