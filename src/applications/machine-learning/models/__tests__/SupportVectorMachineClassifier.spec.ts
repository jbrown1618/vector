import { loadTestData } from '@test-utils/testData';
import { SupportVectorMachineClassifier } from '../SupportVectorMachineClassifier';
import { GaussianKernel } from '../../kernels/GaussianKernel';
import { mat } from '../../../../utilities/aliases';

describe('SupportVectorMachineClassifier', () => {
  describe('with a linear kernel', () => {
    it('makes predictions', () => {
      const iris = loadTestData('iris');
      const xTrain = iris.builder().slice(iris, 0, 0, iris.getNumberOfRows(), 4);
      const yTrain = iris.getColumn(4).map(x => (x === 0 ? 1 : 0));

      const cls = new SupportVectorMachineClassifier({
        alpha: 0.01,
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
      expect(cls.getParameters()?.toArray()).toHaveLength(5);
    });
  });

  describe('with a gaussian kernel', () => {
    it('makes predictions', () => {
      const iris = loadTestData('iris');
      const xTrain = iris.builder().slice(iris, 0, 0, iris.getNumberOfRows(), 4);
      const yTrain = iris.getColumn(4).map(x => (x === 0 ? 1 : 0));

      const cls = new SupportVectorMachineClassifier({
        alpha: 0.01,
        maxIterations: 100,
        kernel: GaussianKernel(1)
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
      expect(cls.getParameters()?.toArray()).toHaveLength(151);
    });
  });

  it('cannot predict probabilities', () => {
    expect(() => new SupportVectorMachineClassifier({}).predictProbabilities(mat([]))).toThrow();
  });
});
