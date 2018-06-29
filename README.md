# Vector

Vector is a linear algebra library for Typescript and JavaScript.

## Using Vector

Vector is not yet published to npm. If you want to try it out anyway, you can clone the repository
and include the cloned directory in your package.json:

```
"dependencies": {
  ...
  "vector": "./relative/path/to/vector",
  ...
}
```

## Contributing to Vector

Getting set up is easy! All you need is npm and git.

```bash
git clone https://github.com/jbrown1618/vector.git
cd ./vector
npm i
npm test
```

## To Do:

- Unit tests for `MatrixBuilder` and `VectorBuilder`
- Write row operations in terms of elementary matrices
- Externalize the test for approximate equality
- Implement `matrix.set(i, j, value)` and `vector.set(i, value)`
- More functions in MatrixBuilder
  - Construct from matrix of matrices
  - Zeros
  - Diagonal
  - Tridiagonal
  - Special named matrices
    - Hilbert matrix
- Determinants
- LU Factorization
- Cholesky Factorization
- Implement row reduction optimizations for ill-conditioned / nearly-singular matrices
  - Partial and complete pivoting (see text by Atkinson)
- Find Eigenvalues and Eigenvectors
  - Power method
  - Inverse iteration
- QR Factorization
- Jordan canonical form
- Singular value decomposition / Pseudoinverses
- Least squares approximation
  - Residual correction methods
  - Gauss-Jacobi method
  - Gauss-Seidel method
- Generalize to allow other numeric data types - big decimals and complex numbers
- Tests for particular matrix properties - both exact and approximate
  - isInvertible()
  - isSymmetric()
  - isUpperTriangular()
  - isLowerTriangular()
  - isIdentity()
  - isHermitian()
  - isOrthogonal()
