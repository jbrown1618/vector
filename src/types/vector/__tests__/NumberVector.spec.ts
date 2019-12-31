import { NumberVector } from '../NumberVector';
import { SparseNumberVector } from '../SparseNumberVector';
import { FloatVector } from '../FloatVector';

const configs = [
  {
    testClassName: 'NumberVector',
    builder: NumberVector.builder()
  },
  {
    testClassName: 'SparseNumberVector',
    builder: SparseNumberVector.builder()
  },
  {
    testClassName: 'FloatVector',
    builder: FloatVector.builder()
  }
];

configs.forEach(({ testClassName, builder }) => {
  describe(testClassName, () => {
    describe('builders and ops', () => {
      test('can be created from an instance', () => {
        const instance = builder.empty();
        expect(instance.builder()).toBeTruthy();
        expect(instance.matrixBuilder()).toBeTruthy();
        expect(instance.ops()).toBeTruthy();
      });
    });

    describe('constructors', () => {
      test('can be constructed from an array', () => {
        expect(builder.fromArray([1, 2, 3]).toArray()).toStrictEqual([1, 2, 3]);
      });

      test('can be constructed from values', () => {
        expect(builder.fromValues(1, 2, 3, 4).toArray()).toStrictEqual([1, 2, 3, 4]);
      });

      test('handles the degenerate case', () => {
        expect(builder.fromArray([]).getDimension()).toEqual(0);
        expect(builder.fromValues().getDimension()).toEqual(0);
      });
    });

    describe('getDimension', () => {
      test('returns the dimension of the vector', () => {
        expect(builder.fromValues().getDimension()).toEqual(0);
        expect(builder.fromValues(0).getDimension()).toEqual(1);
        expect(builder.fromValues(0, 0).getDimension()).toEqual(2);
        expect(builder.fromValues(0, 0, 0).getDimension()).toEqual(3);
      });
    });

    describe('set', () => {
      test('returns a new vector with a value changed', () => {
        const original = builder.zeros(5);
        const updated = original.set(2, 1);
        expect(updated).not.toBe(original);
        expect(updated).toStrictEqual(builder.fromValues(0, 0, 1, 0, 0));
      });

      test('rejects an invalid index', () => {
        const original = builder.zeros(5);
        expect(() => original.set(5, 1)).toThrow();
        expect(() => original.set(-1, 1)).toThrow();
      });
    });

    describe('add', () => {
      test('adds two vectors of equal dimension', () => {
        const first = builder.fromArray([1, 2, 3]);
        const second = builder.fromArray([4, 5, 6]);

        expect(first.add(second).toArray()).toStrictEqual([5, 7, 9]);
      });

      test('throws an error when the dimensions do not match', () => {
        const vector2 = builder.fromArray([0, 0]);
        const vector3 = builder.fromArray([0, 0, 0]);

        expect(() => vector2.add(vector3)).toThrow();
      });

      test('handles the degenerate case', () => {
        const firstEmpty = builder.fromValues();
        const secondEmpty = builder.fromValues();
        const sum = firstEmpty.add(secondEmpty);

        expect(sum.getDimension()).toEqual(0);
        expect(sum.toArray()).toStrictEqual([]);
      });
    });

    describe('scalarMultiply', () => {
      test('multiplies a vector by a scalar', () => {
        const vector = builder.fromArray([1, 2, 3]);

        expect(vector.scalarMultiply(2).toArray()).toStrictEqual([2, 4, 6]);
      });

      test('handles the degenerate case', () => {
        const empty = builder.fromValues();

        expect(empty.scalarMultiply(2).getDimension()).toEqual(0);
        expect(empty.scalarMultiply(2).toArray()).toStrictEqual([]);
      });
    });

    describe('innerProduct', () => {
      test('computes a scalar product of two vectors', () => {
        const first = builder.fromValues(2, 3, 4);
        const second = builder.fromValues(3, 4, 5);

        expect(first.innerProduct(second)).toEqual(2 * 3 + 3 * 4 + 4 * 5);
      });

      test('throws an error when the dimensions do not match', () => {
        const vector2 = builder.fromArray([0, 0]);
        const vector3 = builder.fromArray([0, 0, 0]);

        expect(() => vector2.innerProduct(vector3)).toThrow();
      });

      test('handles the degenerate case', () => {
        const firstEmpty = builder.fromValues();
        const secondEmpty = builder.fromValues();

        expect(firstEmpty.innerProduct(secondEmpty)).toEqual(0);
      });
    });

    describe('outerProduct', () => {
      test('computes a matrix product of two vectors', () => {
        const first = builder.fromValues(1, 2);
        const second = builder.fromValues(3, 4, 5);
        const expectedData = [
          [3, 4, 5],
          [6, 8, 10]
        ];

        expect(first.outerProduct(second).toArray()).toStrictEqual(expectedData);
      });

      test('handles the degenerate case', () => {
        const empty = builder.fromValues();
        const nonEmpty = builder.fromValues(1, 2, 3);

        expect(empty.outerProduct(nonEmpty).toArray()).toStrictEqual([]);
        expect(nonEmpty.outerProduct(empty).toArray()).toStrictEqual([]);
      });

      configs.forEach(otherConfig => {
        test(`handles ${otherConfig.testClassName} inputs`, () => {
          const first = builder.fromArray([1, 2]);
          const second = otherConfig.builder.fromArray([3, 4, 5]);
          const expectedData = [
            [3, 4, 5],
            [6, 8, 10]
          ];
          expect(first.outerProduct(second).toArray()).toStrictEqual(expectedData);

          const empty = builder.empty();
          const otherEmpty = otherConfig.builder.empty();
          expect(empty.outerProduct(otherEmpty).toArray()).toStrictEqual([]);
        });
      });
    });

    describe('equals', () => {
      test('returns true for an identical vector', () => {
        expect(builder.fromValues(1, 2, 3).equals(builder.fromValues(1, 2, 3))).toBe(true);
      });

      test('returns true for itself', () => {
        const vector = builder.fromValues(1, 1, 1);
        expect(vector.equals(vector)).toBe(true);
      });

      test('handles the degenerate case', () => {
        expect(builder.fromValues().equals(builder.fromValues())).toBe(true);
      });

      test('returns false for a non-identical vector', () => {
        expect(builder.fromValues(1, 2, 3).equals(builder.fromValues(1, 3, 5))).toBe(false);
      });

      test('returns false when there is a dimension mismatch', () => {
        expect(builder.fromValues(1, 2).equals(builder.fromValues(1, 2, 3))).toBe(false);
        expect(builder.fromValues(1, 2, 3).equals(builder.fromValues(1, 2))).toBe(false);
      });

      configs.forEach(otherConfig => {
        test(`handles ${otherConfig.testClassName} inputs`, () => {
          const original = builder.fromArray([1, 2, 3]);
          const equal = otherConfig.builder.fromArray([1, 2, 3]);
          const unequal = otherConfig.builder.fromArray([1, 2, 2]);
          expect(original.equals(equal)).toBe(true);
          expect(original.equals(unequal)).toBe(false);
        });
      });
    });

    describe('projectOnto', () => {
      test('calculates the projection of one vector onto another', () => {
        const v = builder.fromArray([3, 2]);
        const e1 = builder.elementaryVector(2, 0);
        const e2 = builder.elementaryVector(2, 1);
        expect(v.projectOnto(e1)).toStrictEqual(builder.fromArray([3, 0]));
        expect(v.projectOnto(e2)).toStrictEqual(builder.fromArray([0, 2]));
      });

      test('rejects the zero-vector', () => {
        const v = builder.fromArray([3, 2]);
        const zero = builder.zeros(2);
        expect(() => v.projectOnto(zero)).toThrow();
      });

      test('rejects a dimension mismatch', () => {
        const v1 = builder.ones(3);
        const v2 = builder.ones(2);
        expect(() => v1.projectOnto(v2)).toThrow();
      });
    });

    describe('getSparseData', () => {
      test('returns a map of the contents of the vector', () => {
        const v = builder.fromArray([0, 0, 1, 0, 2, 0]);
        const expected = new Map();
        expected.set(2, 1).set(4, 2);
        expect(v.getSparseData()).toStrictEqual(expected);
      });
    });

    describe('map', () => {
      test('builds a vector by transforming the values of another vector', () => {
        const original = builder.fromValues(1, 2, 3, 4);
        const expected = builder.fromValues(1, 3, 5, 7);
        expect(original.map((value, index) => value + index)).toStrictEqual(expected);
      });

      test('handles an empty vector', () => {
        expect(builder.empty().map(value => value + 1)).toStrictEqual(builder.empty());
      });
    });

    describe('forEach', () => {
      test('runs a callback for each entry', () => {
        let called = 0;
        builder.fromValues(1, 2, 3, 4, 5).forEach(_ => called++);
        expect(called).toBe(5);
      });
    });

    describe('combine', () => {
      test('builds a vector by combining two other vectors', () => {
        const first = builder.fromValues(1, 2, 3, 4);
        const second = builder.fromValues(5, 6, 7, 8);
        const expected = builder.fromValues(5, 12, 21, 32);
        expect(first.combine(second, (a, b) => a * b)).toStrictEqual(expected);
      });

      test('rejects a dimension mismatch', () => {
        const first = builder.fromValues(1, 2, 3, 4);
        const second = builder.fromValues(5, 6, 7);
        expect(() => first.combine(second, () => 1)).toThrow();
      });
    });
  });
});
