// import { assertValidVectorIndex } from '../../utilities/ErrorAssertions';
// import { Matrix } from '../matrix/Matrix';
// import { MatrixBuilder } from '../matrix/MatrixBuilder';
// import { ScalarOperations } from '../scalar/ScalarOperations';
// import { Vector, VectorData } from './Vector';
// import { VectorBuilder } from './VectorBuilder';

export type SparseVectorData<S> = Map<number, S>;

// /**
//  * A type guard which returns true if the input is an instance of `SparseVector`,
//  * and functions as a type check in the compiler.
//  */
// export function isSparse<S>(
//   vector: Vector<S>
// ): vector is SparseVector<S> {
//   return (vector as SparseVector<S>).getSparseData !== undefined;
// }
//
// /**
//  * For large vectors with many entries equal to 0, some operations are
//  * more efficient with a `Vector` implementation that only stores the non-zero values.
//  */
// export abstract class SparseVector<S> implements Vector<S> {
//   private readonly _dimension: number;
//   private readonly _sparseData: SparseVectorData<S>;
//
//   protected constructor(dimension: number, data: VectorData<S>) {
//     this._dimension = dimension;
//     const sparseData: SparseVectorData<S> = new Map();
//     data.forEach((value: S, index: number) => {
//       if (!this.ops().equals(this.ops().zero(), value)) {
//         sparseData.set(index, value);
//       }
//     });
//     this._sparseData = sparseData;
//   }
//
//   public abstract ops(): ScalarOperations<S>;
//
//   public abstract builder(): VectorBuilder<S, Vector<S>>;
//
//   public abstract matrixBuilder(): MatrixBuilder<
//     S,
//     Vector<S>,
//     Matrix<S>
//   >;
//
//   /**
//    * @inheritdoc
//    */
//   public getSparseData(): SparseVectorData<S> {
//     return this._sparseData;
//   }
//
//   /**
//    * @inheritdoc
//    */
//   public getData(): VectorData<S> {
//     const data: VectorData<S> = [];
//     for (let i = 0; i < this.getDimension(); i++) {
//       data[i] = this.getEntry(i);
//     }
//     return data;
//   }
//
//   /**
//    * @inheritdoc
//    */
//   public getEntry(index: number): S {
//     assertValidVectorIndex(this, index);
//     return this._sparseData.get(index) || this.ops().zero();
//   }
//
//   /**
//    * @inheritdoc
//    */
//   public innerProduct(other: Vector<S>): S {
//     let innerProduct: S = this.ops().zero();
//     this._sparseData.forEach((value, index) => {
//       innerProduct = this.ops().add(
//         innerProduct,
//         this.ops().multiply(value, this.ops().conjugate(other.getEntry(index)))
//       );
//     });
//     return innerProduct;
//   }
//
//   /**
//    * @inheritdoc
//    */
//   public outerProduct(other: Vector<S>): Matrix<S> {
//     // TODO - implement.  This is just here to satisfy the compiler.
//     return this.matrixBuilder().fromData([other.getData()]);
//   }
//
//   /**
//    * @inheritdoc
//    */
//   public scalarMultiply(scalar: S): Vector<S> {
//     const newSparseData = new Map();
//     this._sparseData.forEach((value, index) => {
//       newSparseData.set(index, this.ops().multiply(value, scalar));
//     });
//     return this.builder().fromSparseData(this._dimension, newSparseData);
//   }
//
//   public abstract add(other: Vector<S>): Vector<S>;
//
//   /**
//    * @inheritdoc
//    */
//   public equals(other: Vector<S>): boolean {
//     if (isSparse(other)) {
//       return this.equalsSparse(other);
//     }
//
//     return other
//       .getData()
//       .map((entry, i) => this.ops().equals(this.getEntry(i), entry))
//       .reduce((all, current) => all && current, true);
//   }
//
//   /**
//    * @inheritdoc
//    */
//   public getDimension(): number {
//     return this._dimension;
//   }
//
//   /**
//    * @inheritdoc
//    */
//   public projectOnto(u: Vector<S>) {
//     const oneOverUDotU = this.ops().getMultiplicativeInverse(u.innerProduct(u));
//     if (oneOverUDotU === undefined) {
//       throw Error('TODO - cannot project onto the zero vector');
//     }
//
//     const uDotV = u.innerProduct(this);
//     const magnitudeOfProjection = this.ops().multiply(uDotV, oneOverUDotU);
//     return u.scalarMultiply(magnitudeOfProjection);
//   }
//
//   private equalsSparse(other: SparseVector<S>): boolean {
//     if (this._sparseData.size !== other._sparseData.size) {
//       return false;
//     }
//
//     let hasMismatch = false;
//     this._sparseData.forEach((value, index) => {
//       if (!this.ops().equals(other.getEntry(index), value)) {
//         hasMismatch = true;
//       }
//     });
//     // It is sufficient to check in one direction since they have the same number of elements.
//     return hasMismatch;
//   }
// }
