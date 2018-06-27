import { describe, it } from "mocha";
import { expect } from "chai";
import { Matrix } from "../Matrix";
import { MatrixFactory } from "../utilities/MatrixFactory";
import { rowEchelonForm } from "./RowEchelon";

describe("RowEchelon", () => {
  describe("rowEchelonForm", () => {
    it("row reduces a 'wide' matrix", () => {
      const A = Matrix.fromData([[1, 2, 3], [4, 5, 6]]);
      const Aref = rowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 2, 3], [0, 1, 2]]);
    });

    it("row reduces a 'tall' matrix", () => {
      const A = Matrix.fromData([[0, 1], [0, 0], [5, 9]]);
      const Aref = rowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 9 + 9 * (0.2 - 1)], [0, 1], [0, 0]]);
    });

    it("row reduces a matrix with non-independent rows", () => {
      const A = Matrix.fromData([[1, 2, 3], [1, 1, 1], [1, 1, 1]]);

      const Aref = rowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 2, 3], [0, 1, 2], [0, 0, 0]]);
    });

    it("row reduces a matrix with non-diagonal pivot entries", () => {
      const A = Matrix.fromData([[1, 1, 1], [0, 0, 2], [0, 0, 1]]);

      const Aref = rowEchelonForm(A);
      expect(Aref.getData()).to.deep.equal([[1, 1, 1], [0, 0, 1], [0, 0, 0]]);
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
