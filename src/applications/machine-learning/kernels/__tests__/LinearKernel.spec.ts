import { LinearKernel } from '@lib/applications/machine-learning/kernels/LinearKernel';
import { loadTestData } from '@test-utils/testData';

describe('LinearKernel', () => {
  it('returns the original, unmodified data', () => {
    const data = loadTestData('iris');
    const kerneled = LinearKernel(data);
    expect(data).toBe(kerneled);
  });
});
