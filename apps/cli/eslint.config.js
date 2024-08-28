const baseConfig = require('@ufb/eslint-config/base');

module.exports = [
  {
    ignores: ['dist/**', '**/*.js'],
  },
  ...baseConfig,
];
