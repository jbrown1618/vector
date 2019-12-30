# Contribution Guide

Thank you for taking the time to contribute to my project!

## Set-up

Getting set up is easy! All you need is npm and git. Project setup works
out-of-the-box in WebStorm and VS Code - just open the root folder.

```bash
git clone https://github.com/jbrown1618/vector.git
cd ./vector
npm i
npm test
```

## Pull Requests

Pull requests are very welcome.
To keep things organized, here are some things you should include in a PR:

- Reference a specific issue. If an issue does not exist for the problem you're
  trying to solve, [create one!](https://github.com/jbrown1618/vector/issues)
- Describe your general approach to solving the problem, and any alternate approaches you considered.
- Call out the most important changed files - this will make reviewing your code much easier.
- Pass CI. This means documenting all exported functions and public methods, and writing
  appropriate unit tests. You can run the same set of checks as our CI build with `npm run ci`.
- Don't forget to include any new files in `index.ts`!

## Coding Standards

### Formatting

All code must be formatted with [Prettier](https://prettier.io/)
and linted with [eslint](https://eslint.org/).
This will happen automatically every time you commit.

### Naming

- Prefer long, descriptive names.
  - Exception: accept short names only to match well-known libraries
    (e.g. `linspace` matches NumPy and MATLAB/Octave)
  - Exception: accept short names to adhere to mathematical convention
    (e.g. `A` is a good name for a generic matrix when solving a system _Ax = b_,
    `i` and `j` are good names for matrix indices,
    and `m` and `n` are good names for matrix dimensions)
- Prefix private member variables with an underscore
  - JavaScript consumers do not have the compiler to tell them they shouldn't be using the private
    part of your class.
- By convention, generic types are named:
  - `S` for a type that behaves as a scalar
  - `V` for a type that behaves as a vector
  - `M` for a type that behaves as a matrix

### Testing

You can run the unit tests with:

```
npm run test
```

Our tests are written with [Jest](https://jestjs.io/).

- The test file for `MyModule.ts` must be named `MyModule.spec.ts`.
- `describe` blocks should be named according to the name of a module, class, or function.
- Nesting describe blocks is encouraged; it makes the testing results (arguably) easier to read.

```javascript
describe('MyModule', () => {
  describe('MyClass', () => {
    describe('someUsefulMethod', () => {
      test('does a useful thing', () => {
        // Test the useful thing
      });
    });
  });

  describe('helperFunction', () => {
    test('does something which helps consumers work with this module', () => {
      // Test the useful thing
    });
  });
});
```

### Coverage

You can inspect the current test coverage by running:

```
npm run coverage && open ./coverage/index.html
```

Merge requests will only be accepted if the coverage check passes.
`npm run coverage` will fail if your branch does not pass the current thresholds.

### Documentation

Documentation is generated with [API Extractor](https://api-extractor.com/), which uses the standard tsdoc
format defined by [tsdoc](https://github.com/Microsoft/tsdoc).

If you have changed the public API of the project, you must run `npm run docs`, or CI will fail.

- Document all public functions and methods.
- Always include a summary, `@param`s, and `@returns`
- Always include `@public` or `@internal`.
- Parameters take the form `@param name - Description`. No type annotation is needed.
- Returns take the form `@returns Description`. Again, no type annotation is needed.
- When implementing an interface, use `{@inheritDoc Parent.method}` to indicate that documentation
  should be pulled from the parent.

#### Example for formatting (not for content!):

```typescript
/**
 * An interface for things which can be done.
 */
interface Thing {
  /**
   * Does the thing, parametrized by the provided `options`
   *
   * @param options - Options that affect how the thing is done
   */
  do(options: string[]): void;
}

/**
 * A Thing which, when done, logs its options to the `console`
 */
export class LoggingThing implements Thing {
  /**
   * {@inheritDoc Thing.do}
   * @public
   */
  do(options: string[]): void {
    options.forEach(option => console.log(option));
  }
}

/**
 * Does each `Thing` in `things`
 *
 * @parameter things - The things to be done
 * @parameter options - The parameters to be used for every thing
 * @returns The first thing, because I need an example for `@returns`, or undefined if the first
 *     thing is unavailable.
 * @public
 */
export function doTheThings(things: Thing[], options: string[]): Thing | undefined {
  things.forEach(thing => thing.do(options));
  return things.length > 0 ? things[0] : undefined;
}
```

## FAQs

These are questions that I assume would be frequently asked if people were to ask questions about
this project.

### What is `ScalarOperations` for? What is `.ops()`?

This originated in the process of making our algorithms operate on generic vector and matrix types.
The issue is, we need to know how to do things to the entries, and those entries can either be a
primitive (`number`) or a non-primitive (some object that provides the right operations). Ideally
we could just constrain the generic types (i.e. `Matrix<S extends Scalar>`), but then we would have
to implement our algorithms once for `number`, and then again for non-`number`s, which is not ideal.
Another solution would have involved something like `Matrix<S extends Scalar|number>`, which seems
fine on first glance, but then algorithm implementations constantly have to do type checking on the
entries they're working with.

The solution was to provide a `ScalarOperations` interface that defines all of the operations that
might need to be done on matrix or vector entries - adding them, multiplying them, and even printing
them nicely. Then, each matrix and vector type must implement `ops(): ScalarOperations` and
`static ops(): ScalarOperations`, which algorithms can use to get an object that knows how to
operate on the entries.

Consequently, you will see a lot of code that looks like:

```typescript
export function add<S>(first: Vector<S>, second: Vector<S>): Vector<S> {
  if (first.getDimension() !== second.getDimension()) {
    throw new Error('Dimension mismatch!');
  }

  const ops = first.ops();
  const vectorBuilder = first.builder();

  const newData = vectorBuilder.map(first, (entry: S, index: number) => {
    return ops.add(entry, second.getEntry(index));
  });
}
```
