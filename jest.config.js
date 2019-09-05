module.exports = {
  roots: ['./src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
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
    '^@test-utils/(.*)$': '<rootDir>/test/utils/$1',
    '^@src/(.*)$': '<rootDir>/src/$1'
  }
};
