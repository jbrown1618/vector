import { loadTestData } from '@test-utils/testData';
import { SupportVectorMachineClassifier } from '@lib/applications/machine-learning/models/SupportVectorMachineClassifier';
import { GaussianKernel } from '@lib/applications/machine-learning/kernels/GaussianKernel';

describe('SupportVectorMachineClassifier', () => {
  describe('with a linear kernel', () => {
    it('makes predictions', () => {
      const iris = loadTestData('iris');
      const xTrain = iris.builder().slice(iris, 0, 0, iris.getNumberOfRows(), 4);
      const yTrain = iris.vectorBuilder().map(iris.getColumn(4), x => (x === 0 ? 1 : 0));

      const cls = new SupportVectorMachineClassifier({
        alpha: 0.01,
        maxIterations: 100
      });

      cls.train(xTrain, yTrain);

      const predictions = cls.predict(xTrain);
      let numIncorrect = 0;
      predictions.toArray().forEach((pred, i) => {
        const actual = yTrain.getEntry(i);
        if (pred !== actual) {
          numIncorrect++;
        }
      });

      const total = iris.getNumberOfRows();
      const accuracy = (total - numIncorrect) / total;

      expect(accuracy).toBeGreaterThan(0.99);
      expect(cls.getParameters()?.toArray()).toHaveLength(5);
    });
  });

  describe('with a gaussian kernel', () => {
    it('makes predictions', () => {
      const iris = loadTestData('iris');
      const xTrain = iris.builder().slice(iris, 0, 0, iris.getNumberOfRows(), 4);
      const yTrain = iris.vectorBuilder().map(iris.getColumn(4), x => (x === 0 ? 1 : 0));

      const cls = new SupportVectorMachineClassifier({
        alpha: 0.01,
        maxIterations: 100,
        kernel: GaussianKernel(1)
      });

      cls.train(xTrain, yTrain);

      const predictions = cls.predict(xTrain);
      let numIncorrect = 0;
      predictions.toArray().forEach((pred, i) => {
        const actual = yTrain.getEntry(i);
        if (pred !== actual) {
          numIncorrect++;
        }
      });

      const total = iris.getNumberOfRows();
      const accuracy = (total - numIncorrect) / total;

      expect(accuracy).toBeGreaterThan(0.99);
      expect(cls.getParameters()?.toArray()).toHaveLength(151);
    });
  });
});
