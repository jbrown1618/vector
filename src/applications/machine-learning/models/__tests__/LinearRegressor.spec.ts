import { loadTestData } from '@test-utils/testData';
import { LinearRegressor } from '../LinearRegressor';
import { mat, vec } from '../../../../utilities/aliases';
import { FloatMatrix } from '../../../../types/matrix/FloatMatrix';

describe('LinearRegressor', () => {
  it('makes predictions', () => {
    const sample = loadTestData('least-squares-2d');
    const xTrain = sample.builder().slice(sample, 0, 0, sample.getNumberOfRows(), 2);
    const yTrain = sample.getColumn(2);

    const reg = new LinearRegressor({
      alpha: 0.01,
      lambda: 0
    });

    const trueParams = [-0.4083333333333, 0.736666666666, 2.541666666666];

    reg.train(xTrain, yTrain);
    reg.getParameters()!.forEach((param, i) => {
      expect(param - trueParams[i]).toBeLessThan(0.00001);
    });

    let predictions = reg.predict(xTrain);
    predictions.forEach((pred, i) => {
      expect(pred - yTrain.getEntry(i)).toBeLessThan(1);
    });

    const xVal = mat([
      [1, 1],
      [1, 2],
      [4, 8]
    ]);
    const yVal = vec([2.87, 5.41, 22.87]);
    predictions = reg.predict(xVal);
    predictions.forEach((pred, i) => {
      expect(pred - yVal.getEntry(i)).toBeLessThan(1);
    });
  });

  describe('an untrained model', () => {
    it('throws when making predictions', () => {
      expect(() => new LinearRegressor({}).predict(FloatMatrix.builder().empty())).toThrow();
    });
  });
});
