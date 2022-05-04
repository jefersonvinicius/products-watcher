/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@app/(.*)': ['<rootDir>/src/$1'],
    '@tests/(.*)': ['<rootDir>/__tests__/$1'],
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
