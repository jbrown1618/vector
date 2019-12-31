import { loadTestData } from '@test-utils/testData';
import { LogisticRegressionClassifier } from '../LogisticRegressionClassifier';
import { FloatMatrix } from '../../../../types/matrix/FloatMatrix';

describe('LogisticRegressionClassifier', () => {
  it('makes predictions', () => {
    const iris = loadTestData('iris');
    const xTrain = iris.builder().slice(iris, 0, 0, iris.getNumberOfRows(), 4);
    const yTrain = iris.getColumn(4).map(x => (x === 0 ? 1 : 0));

    const cls = new LogisticRegressionClassifier({
      alpha: 0.1,
      lambda: 0,
      maxIterations: 100
    });

    cls.train(xTrain, yTrain);

    const predictions = cls.predict(xTrain);
    let numIncorrect = 0;
    predictions.forEach((pred, i) => {
      const actual = yTrain.getEntry(i);
      if (pred !== actual) {
        numIncorrect++;
      }
    });

    const total = iris.getNumberOfRows();
    const accuracy = (total - numIncorrect) / total;

    expect(accuracy).toBeGreaterThan(0.99);

    const expectedParams = [
      0.1750568949973106,
      0.2678094914078278,
      0.9230718461298334,
      -1.4696586168060346,
      -0.6814190624867987
    ];

    const theta = cls.getParameters();
    theta?.forEach((param, i) => {
      // A pretty wide range of values will produce 100% accuracy
      expect(param - expectedParams[i]).toBeLessThan(0.4);
    });
  });

  describe('an untrained model', () => {
    it('throws when making predictions', () => {
      expect(() =>
        new LogisticRegressionClassifier({}).predict(FloatMatrix.builder().empty())
      ).toThrow();
      expect(() =>
        new LogisticRegressionClassifier({}).predictProbabilities(FloatMatrix.builder().empty())
      ).toThrow();
    });
  });
});
