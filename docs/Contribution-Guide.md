# Contribution Guide

## Set-up

Getting set up is easy! All you need is npm and git. Project setup works
out-of-the-box in WebStorm and VS Code - just open the root folder.

```bash
git clone https://github.com/jbrown1618/vector.git
cd ./vector
npm i
npm test
```

## Coding Standards

### Formatting

All code must be formatted with [Prettier](https://prettier.io/).
This will happen automatically every time you commit.

### Naming

- Prefer long, descriptive names.
  - Exception: accept short names only to match well-known libraries
    (e.g. `linspace` matches NumPy and MATLAB/Octave)
  - Exception: accept short names to adhere to mathematical convention
    (e.g. `A` is a good name for a generic matrix when solving a system _Ax = b_)
- Prefix private member variables with an underscore
  - JavaScript consumers do not have the compiler to tell them they shouldn't be using the private part of your class.

### Testing

We test with a combination of [Mocha]() and [Chai]().

- The test file for `MyModule.ts` must be named `MyModule.spec.ts`.
- `describe` blocks should be named according to the name of a module, class, or function.
- Nesting describe blocks is encouraged; it makes the testing results easier to read.
- `it` blocks should form complete sentences.

```javascript
describe('MyModule', () => {
  describe('MyClass', () => {
    describe('someUsefulMethod', () => {
      it('does a useful thing', () => {
        // Test the useful thing
      });
    });
  });

  describe('helperFunction', () => {
    it('does something which helps consumers work with this module', () => {
      // Test the useful thing
    });
  });
});
```

### Coverage

You can check the code coverage by running:

```
npm run test-coverage
```

Merge requests will only be accepted if:

- The overall code coverage for the project is above 95%
- The code coverage for each individual file is above 85%

The only exceptions are abstract classes which do not have any concrete subclasses.
