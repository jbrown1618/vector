/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 100,
      lines: 98,
      statements: 98
    }
  },
  moduleNameMapper: {
    '^@test-utils/(.*)$': '<rootDir>/test/utils/$1'
  }
};
