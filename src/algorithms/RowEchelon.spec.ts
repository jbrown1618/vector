import { describe, it } from "mocha";
import { expect } from "chai";
import { Matrix } from "../Matrix";
import { MatrixFactory } from "../utilities/MatrixFactory";
import { rowEchelonForm } from "./RowEchelon";

describe("RowEchelon", () => {
  describe("rowEchelonForm", () => {
    it("row reduces a matrix", () => {
      const A = Matrix.fromData([[1, 2, 3], [4, 5, 6]]);
      const ref = rowEchelonForm(A);
      expect(ref.getData()).to.deep.equal([[1, 2, 3], [0, 1, 2]]);
    });

    it("does nothing to an identity matrix", () => {
      const I = MatrixFactory.identity(3);
      const ref = rowEchelonForm(I);
      expect(ref.equals(I)).to.be.true;
    });
  });

  describe("reducedRowEchelonForm", () => {
    it("does nothing to an identity matrix", () => {
      const I = MatrixFactory.identity(3);
      const ref = rowEchelonForm(I);
      expect(ref.equals(I)).to.be.true;
    });
  });
});
