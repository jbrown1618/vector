import { loadTestData } from '@test-utils/testData';
import { LinearRegressor } from '@lib/applications/machine-learning/models/LinearRegressor';
import { mat, vec } from '@lib/utilities/aliases';

describe('LinearRegressor', () => {
  it('makes predictions', () => {
    const sample = loadTestData('least-squares-2d');
    const xTrain = sample.builder().slice(sample, 0, 0, sample.getNumberOfRows(), 2);
    const yTrain = sample.getColumn(2);

    const reg = new LinearRegressor({
      alpha: 0.01,
      lambda: 0
    });

    const trueParams = [-0.40833333333332367, 0.7366666666666807, 2.5416666666666448];

    reg.train(xTrain, yTrain);
    reg
      .getParameters()!
      .toArray()
      .forEach((param, i) => {
        expect(param - trueParams[i]).toBeLessThan(0.00001);
      });

    let predictions = reg.predict(xTrain);
    predictions.toArray().forEach((pred, i) => {
      expect(pred - yTrain.getEntry(i)).toBeLessThan(1);
    });

    const xVal = mat([[1, 1], [1, 2], [4, 8]]);
    const yVal = vec([2.87, 5.41, 22.87]);
    predictions = reg.predict(xVal);
    predictions.toArray().forEach((pred, i) => {
      expect(pred - yVal.getEntry(i)).toBeLessThan(1);
    });
  });
});
