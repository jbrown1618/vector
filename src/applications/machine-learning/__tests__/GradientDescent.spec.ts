import { gradientDescent } from '../GradientDescent';
import { CostFunction } from '../LearningAlgorithm';
import { vec } from '../../../utilities/aliases';

describe('GradientDescent', () => {
  it('defaults both alpha and maxIterations', () => {
    let callCount = 0;
    const costFn: CostFunction = (_theta) => {
      callCount++;
      if (callCount > 3) return { cost: 0, gradient: vec([0, 0]) };
      return { cost: 1, gradient: vec([-1, -1]) };
    };
    const initial = vec([0, 0]);
    const theta = gradientDescent({})(initial, costFn);
    // With default alpha=0.1, after 3 iterations: 3 * 0.1 = 0.3
    expect(theta.equals(vec([0.3, 0.3]))).toBe(true);
  });

  it('respects maxIterations', () => {
    const costFn: CostFunction = (_theta) => ({
      cost: 1,
      gradient: vec([-1, -1]),
    });
    const initial = vec([0, 0]);
    const theta = gradientDescent({ alpha: 1, maxIterations: 5 })(initial, costFn);
    expect(theta).toStrictEqual(vec([5, 5]));
  });

  it('converges when the gradient decreases', () => {
    let n = -1;
    const costFn: CostFunction = (_theta) => {
      n++;
      return {
        cost: 1,
        gradient: vec([-Math.pow(0.5, n), -Math.pow(0.5, n)]),
      };
    };
    const initial = vec([0, 0]);
    const theta = gradientDescent({ alpha: 1 })(initial, costFn);

    expect(theta.equals(vec([2, 2]))).toBe(true);
  });

  it('defaults to 10000 iterations', () => {
    const costFn: CostFunction = (_theta) => ({
      cost: 1,
      gradient: vec([-1, -1]),
    });
    const initial = vec([0, 0]);
    const theta = gradientDescent({ alpha: 1 })(initial, costFn);
    expect(theta).toStrictEqual(vec([10000, 10000]));
  });
});
