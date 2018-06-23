import { describe, it } from "mocha";
import { expect } from "chai";
import { Vector } from "./Vector";

describe("Vector", () => {
  describe("constructors", () => {
    it("can be constructed from an array", () => {
      expect(Vector.fromArray([1, 2, 3]).getContents()).to.deep.equal([1, 2, 3]);
    });

    it("can be constructed from values", () => {
      expect(Vector.fromValues(1, 2, 3, 4).getContents()).to.deep.equal([1, 2, 3, 4]);
    });

    it("handles the degenerate case", () => {
      expect(Vector.fromArray([]).getDimension()).to.equal(0);
      expect(Vector.fromValues().getDimension()).to.equal(0);
    });
  });

  describe("getDimension", () => {
    it("returns the dimension of the vector", () => {
      expect(Vector.fromValues().getDimension()).to.equal(0);
      expect(Vector.fromValues(0).getDimension()).to.equal(1);
      expect(Vector.fromValues(0, 0).getDimension()).to.equal(2);
      expect(Vector.fromValues(0, 0, 0).getDimension()).to.equal(3);
    });
  });

  describe("add", () => {
    it("adds two vectors of equal dimension", () => {
      const first = Vector.fromArray([1, 2, 3]);
      const second = Vector.fromArray([4, 5, 6]);

      expect(first.add(second).getContents()).to.deep.equal([5, 7, 9]);
    });

    it("throws an error when the dimensions do not match", () => {
      const vector2 = Vector.fromArray([0, 0]);
      const vector3 = Vector.fromArray([0, 0, 0]);

      expect(() => vector2.add(vector3)).to.throw();
    });

    it("handles the degenerate case", () => {
      const firstEmpty = Vector.fromValues();
      const secondEmpty = Vector.fromValues();
      const sum = firstEmpty.add(secondEmpty);

      expect(sum.getDimension()).to.equal(0);
      expect(sum.getContents()).to.deep.equal([]);
    });
  });

  describe("multiply", () => {
    it("multiplies a vector by a scalar", () => {
      const vector = Vector.fromArray([1, 2, 3]);

      expect(vector.multiply(2).getContents()).to.deep.equal([2, 4, 6]);
    });

    it("handles the degenerate case", () => {
      const empty = Vector.fromValues();

      expect(empty.multiply(2).getDimension()).to.equal(0);
      expect(empty.multiply(2).getContents()).to.deep.equal([]);
    });
  });

  describe("innerProduct", () => {
    it("computes a scalar product of two vectors", () => {
      const first = Vector.fromValues(2, 3, 4);
      const second = Vector.fromValues(3, 4, 5);

      expect(first.innerProduct(second)).to.equal(2 * 3 + 3 * 4 + 4 * 5);
    });

    it("throws an error when the dimensions do not match", () => {
      const vector2 = Vector.fromArray([0, 0]);
      const vector3 = Vector.fromArray([0, 0, 0]);

      expect(() => vector2.innerProduct(vector3)).to.throw();
    });

    it("handles the degenerate case", () => {
      const firstEmpty = Vector.fromValues();
      const secondEmpty = Vector.fromValues();

      expect(firstEmpty.innerProduct(secondEmpty)).to.equal(0);
    });
  });

  describe("outerProduct", () => {
    it("computes a matrix product of two vectors", () => {
      const first = Vector.fromValues(1, 2);
      const second = Vector.fromValues(3, 4, 5);
      const expectedData = [[3, 4, 5], [6, 8, 10]];

      expect(first.outerProduct(second).getData()).to.deep.equal(expectedData);
    });

    it("handles the degenerate case", () => {
      const empty = Vector.fromValues();
      const nonEmpty = Vector.fromValues(1, 2, 3);

      expect(empty.outerProduct(nonEmpty).getData()).to.deep.equal([]);
      expect(nonEmpty.outerProduct(empty).getData()).to.deep.equal([]);
    });
  });
});
