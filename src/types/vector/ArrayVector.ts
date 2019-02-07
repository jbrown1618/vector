import { MatrixBuilder } from '../matrix/MatrixBuilder';
import { Matrix, MatrixData } from '../matrix/Matrix';
import { ScalarOperations } from '../scalar/ScalarOperations';
import { VectorBuilder } from './VectorBuilder';
import { assertHomogeneous, assertValidVectorIndex } from '../../utilities/ErrorAssertions';
import { Vector, VectorData } from './Vector';

/**
 * Implements `Vector` with an array of values.
 * Subclasses must specify the usual scalar operations on their contents.
 */
export abstract class ArrayVector<ScalarType> implements Vector<ScalarType> {
  private readonly _data: VectorData<ScalarType>;

  protected constructor(data: VectorData<ScalarType>) {
    this._data = data;
  }

  abstract ops(): ScalarOperations<ScalarType>;
  abstract builder(): VectorBuilder<ScalarType, Vector<ScalarType>>;
  abstract matrixBuilder(): MatrixBuilder<ScalarType, Vector<ScalarType>, Matrix<ScalarType>>;

  /**
   * @inheritdoc
   */
  getEntry(index: number): ScalarType {
    assertValidVectorIndex(this, index);
    return this._data[index];
  }

  /**
   * @inheritdoc
   */
  add(other: Vector<ScalarType>): Vector<ScalarType> {
    assertHomogeneous([this, other]);

    const newData = this.getData().map((entry, index) =>
      this.ops().add(entry, other.getEntry(index))
    );

    return this.builder().fromData(newData);
  }

  /**
   * @inheritdoc
   */
  equals(other: Vector<ScalarType>): boolean {
    if (this.getDimension() !== other.getDimension()) {
      return false;
    }

    return this._data
      .map((entry, i) => this.ops().equals(entry, other.getEntry(i)))
      .reduce((all, current) => all && current, true);
  }

  /**
   * @inheritdoc
   */
  innerProduct(other: Vector<ScalarType>): ScalarType {
    assertHomogeneous([this, other]);

    return this._data
      .map((entry, index) =>
        this.ops().multiply(entry, this.ops().conjugate(other.getEntry(index)))
      )
      .reduce(this.ops().add, this.ops().zero());
  }

  /**
   * @inheritdoc
   */
  outerProduct(other: Vector<ScalarType>): Matrix<ScalarType> {
    const matrixData: MatrixData<ScalarType> = [];

    if (this.getDimension() === 0 || other.getDimension() === 0) {
      return this.matrixBuilder().fromData(matrixData);
    }

    this.getData().forEach((thisValue, rowIndex) => {
      matrixData[rowIndex] = [];
      other.getData().forEach((otherValue, columnIndex) => {
        matrixData[rowIndex][columnIndex] = this.ops().multiply(thisValue, otherValue);
      });
    });

    return this.matrixBuilder().fromData(matrixData);
  }

  /**
   * @inheritdoc
   */
  norm(): ScalarType {
    return this.ops().getPrincipalSquareRoot(this.innerProduct(this));
  }

  /**
   * @inheritdoc
   */
  normalize(): Vector<ScalarType> | undefined {
    const oneOverNorm = this.ops().getMultiplicativeInverse(this.norm());
    if (oneOverNorm === undefined) {
      return undefined;
    }
    return this.scalarMultiply(oneOverNorm);
  }

  /**
   * @inheritdoc
   */
  projectOnto(u: Vector<ScalarType>) {
    const oneOverUDotU = this.ops().getMultiplicativeInverse(u.innerProduct(u));
    if (oneOverUDotU === undefined) {
      throw Error('TODO - cannot project onto the zero vector');
    }

    const uDotV = u.innerProduct(this);
    const magnitudeOfProjection = this.ops().multiply(uDotV, oneOverUDotU);
    return u.scalarMultiply(magnitudeOfProjection);
  }

  /**
   * @inheritdoc
   */
  scalarMultiply(scalar: ScalarType): Vector<ScalarType> {
    return this.builder().fromData(this.getData().map(entry => this.ops().multiply(entry, scalar)));
  }

  /**
   * @inheritdoc
   */
  getData(): VectorData<ScalarType> {
    return [...this._data];
  }

  /**
   * @inheritdoc
   */
  getDimension(): number {
    return this._data.length;
  }
}
