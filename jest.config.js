/** @type {import('ts-jest').JestConfigWithTsJest} */

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!serialize-error|picocolors|debug|yaml|triple-beam|@trpc)/',
    '<rootDir>/../shared/',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleDirectories: ['node_modules'],
  roots: ['<rootDir>/src'],
  passWithNoTests: true,
  verbose: true,
  prettierPath: null,
}

export default config
