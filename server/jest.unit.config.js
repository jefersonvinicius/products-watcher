const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  testMatch: ['**/__tests__/unit/**/*.spec.ts'],
};
