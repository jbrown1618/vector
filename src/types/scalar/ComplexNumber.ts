/**
 * Numbers of the form _a + bi_ where _i_ is the imaginary unit.
 */
export class ComplexNumber {
  public static readonly ZERO = new ComplexNumber(0, 0);
  public static readonly ONE = new ComplexNumber(1, 0);
  public static readonly NEG_ONE = new ComplexNumber(-1, 0);
  public static readonly I = new ComplexNumber(0, 1);

  private readonly _real: number;
  private readonly _imaginary: number;

  constructor(real: number, imaginary: number) {
    this._real = real;
    this._imaginary = imaginary;
  }

  public getRealPart(): number {
    return this._real;
  }

  public getImaginaryPart(): number {
    return this._imaginary;
  }

  public add(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this._real + other._real, this._imaginary + other._imaginary);
  }

  public multiply(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this._real * other._real - this._imaginary * other._imaginary,
      this._real * other._imaginary + this._imaginary * other._real
    );
  }

  public getAdditiveInverse(): ComplexNumber {
    return this.multiply(ComplexNumber.NEG_ONE);
  }

  public getMultiplicativeInverse(): ComplexNumber {
    const a = this.getRealPart();
    const b = this.getImaginaryPart();
    const denom = a * a + b * b;

    const real = a / denom;
    const imag = (-1 * b) / denom;

    return new ComplexNumber(real, imag);
  }

  public equals(other: ComplexNumber): boolean {
    return this._real === other._real && this._imaginary === other._imaginary;
  }

  public conjugate(): ComplexNumber {
    return new ComplexNumber(this._real, -1 * this._imaginary);
  }
}
