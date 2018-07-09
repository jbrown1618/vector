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

### Housekeeping

- Document public methods
- Improve error handling and messages
- Externalize the test for approximate equality
- Accept generic data types in algorithms - requires work on additive/multiplicative inverses, and generic construction
- More functions in MatrixBuilder
  - Special named matrices
    - Hilbert matrix
    - Toeplitz matrix
- Tests for particular matrix properties - both exact and approximate
  - isInvertible()
  - isSymmetric()
  - isUpperTriangular()
  - isLowerTriangular()
  - isIdentity()
  - isHermitian()
  - isOrthogonal()

### Topics

- Solving _Ax = b_
  - Implement row reduction optimizations for ill-conditioned / nearly-singular matrices
  - Partial and complete pivoting (see text by Atkinson)
  - Cholesky Factorization
  - LU Factorization
  - QR Factorization
  - Singular value decomposition / Pseudoinverses
- Determinants
- Finding Eigenvalues and Eigenvectors _Ax = lambda\*x_
  - Power method
  - Inverse iteration
- Jordan canonical form
- Least squares approximation
  - Residual correction methods
  - Gauss-Jacobi method
  - Gauss-Seidel method
