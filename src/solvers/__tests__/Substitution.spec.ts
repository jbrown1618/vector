import { mat, vec } from '../../utilities/aliases';
import {
  backwardSubstituteAugmentedMatrix,
  forwardSubstituteAugmentedMatrix,
  solveByBackwardSubstitution,
  solveByForwardSubstitution,
} from '../Substitution';

describe('Substitution', () => {
  describe('solveByForwardSubstitution', () => {
    test('solves a lower-triangular system with a unique solution', () => {
      const L = mat([
        [2, 0, 0],
        [2, 1, 0],
        [3, 3, 2],
      ]);
      const b = vec([3, 2, 3]);

      const x = solveByForwardSubstitution(L, b)!;

      expect(x).toStrictEqual(vec([1.5, -1, 3 / 4]));
      expect(L.apply(x)).toStrictEqual(b);
    });

    test('returns undefined for underdetermined system', () => {
      expect(
        solveByForwardSubstitution(
          mat([
            [0, 0, 0],
            [0, 0, 0],
            [1, 1, 1],
          ]),
          vec([0, 0, 3])
        )
      ).toBeUndefined();

      expect(
        solveByForwardSubstitution(
          mat([
            [0, 0, 0],
            [1, 0, 0],
            [0, 2, 0],
          ]),
          vec([0, 0, 0])
        )
      ).toBeUndefined();
    });

    test('returns undefined for an overdetermined system', () => {
      expect(
        solveByForwardSubstitution(
          mat([
            [0, 0],
            [1, 1],
          ]),
          vec([1, 1])
        )
      ).toBeUndefined();
    });

    test('throws for non-square matrices', () => {
      expect(() => {
        solveByForwardSubstitution(
          mat([
            [1, 0],
            [0, 1],
            [0, 1],
          ]),
          vec([1, 2, 2])
        );
      }).toThrow();

      expect(() => {
        solveByForwardSubstitution(
          mat([
            [1, 0, 0],
            [0, 1, 0],
          ]),
          vec([1, 2])
        );
      }).toThrow();
    });

    test('handles the trivial case', () => {
      expect(solveByForwardSubstitution(mat([]), vec([]))).toStrictEqual(vec([]));
    });
  });

  describe('forwardSubstituteAugmentedMatrix', () => {
    test('solves a lower-triangular system with a unique solution', () => {
      const L = mat([
        [2, 0, 0, 3],
        [2, 1, 0, 2],
        [3, 3, 2, 3],
      ]);
      const x = forwardSubstituteAugmentedMatrix(L);

      expect(x).toStrictEqual(vec([1.5, -1, 3 / 4]));
    });

    test('returns undefined for an underdetermined lower-triangular system', () => {
      const L = mat([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 3],
      ]);
      const x = forwardSubstituteAugmentedMatrix(L);

      expect(x).toBeUndefined();
    });

    test('returns undefined for an overdetermined lower-triangular system', () => {
      const L = mat([
        [0, 0, 1],
        [1, 1, 1],
      ]);
      const x = forwardSubstituteAugmentedMatrix(L);

      expect(x).toBeUndefined();
    });
  });

  describe('solveByBackwardSubstitution', () => {
    test('solves an upper-triangular system with a unique solution', () => {
      const U = mat([
        [2, 2, 3],
        [0, 1, 2],
        [0, 0, 2],
      ]);
      const b = vec([3, 2, 3]);
      const x = solveByBackwardSubstitution(U, b)!;

      expect(x).toStrictEqual(vec([0.25, -1, 1.5]));
      expect(U.apply(x)).toStrictEqual(b);
    });

    test('returns undefined for an underdetermined upper-triangular system', () => {
      let U = mat([
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      let b = vec([3, 0, 0]);
      let x = solveByBackwardSubstitution(U, b);

      expect(x).toBeUndefined();

      U = mat([
        [0, 1, 0],
        [0, 0, 2],
        [0, 0, 0],
      ]);
      b = vec([0, 0, 0]);
      x = solveByBackwardSubstitution(U, b);

      expect(x).toBeUndefined();
    });

    test('returns undefined for an overdetermined upper-triangular system', () => {
      const U = mat([
        [1, 1],
        [0, 0],
      ]);
      const b = vec([1, 1]);
      const x = solveByBackwardSubstitution(U, b);

      expect(x).toBeUndefined();
    });

    test('throws for non-square matrices', () => {
      expect(() =>
        solveByBackwardSubstitution(
          mat([
            [1, 0],
            [0, 1],
            [0, 0],
          ]),
          vec([1, 2, 0])
        )
      ).toThrow();

      expect(() =>
        solveByBackwardSubstitution(
          mat([
            [1, 0, 0],
            [0, 1, 0],
          ]),
          vec([1, 2])
        )
      ).toThrow();
    });

    test('handles the trivial case', () => {
      expect(solveByBackwardSubstitution(mat([]), vec([]))).toStrictEqual(vec([]));
    });
  });

  describe('backwardSubstituteAugmentedMatrix', () => {
    test('solves an upper-triangular system with a unique solution', () => {
      const U = mat([
        [2, 2, 3, 3],
        [0, 1, 2, 2],
        [0, 0, 2, 3],
      ]);
      const x = backwardSubstituteAugmentedMatrix(U);

      expect(x).toStrictEqual(vec([0.25, -1, 1.5]));
    });

    test('returns undefined for an underdetermined upper-triangular system', () => {
      const U = mat([
        [1, 1, 1, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const x = backwardSubstituteAugmentedMatrix(U);
      expect(x).toBeUndefined();
    });

    test('returns undefined an overdetermined upper-triangular system', () => {
      const U = mat([
        [1, 1, 1],
        [0, 0, 1],
      ]);
      const x = backwardSubstituteAugmentedMatrix(U);
      expect(x).toBeUndefined();
    });
  });
});
