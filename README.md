# Vector

A linear algebra library written in TypeScript that focuses on generality, extensibility, and ease of use.

## Features

- Basic manipulation of vectors and matrices
- Out-of-the-box support for `number` and `ComplexNumber`
- Extensible to support general scalar types
- Matrix determinants
- Elementary row operations
- Gauss-Jordan elimination
- Differentiation via finite differences
- Least-Squares Regression for arbitrary model functions
- And more to come!

## Design Priorities

- Generality
- Extensibility
- Ease of use
- Immutability

Notably absent from this list is performance. Better solutions (and languages)
exist for performing heavy linear algebra computations.

## Using Vector

See our [Usage Guide](./docs/Usage-Guide.md) for more on how to use **Vector** in your project.

## Contributing to Vector

See our [Contribution Guide](./docs/Contribution-Guide.md) for contribution guidelines and coding standards.

## Documentation

Since this is still in very preliminary stages, the documentation is not
published anywhere. You can generate it for yourself as follows:

```bash
npm run docs
```
