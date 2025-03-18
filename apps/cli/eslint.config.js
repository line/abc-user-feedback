const baseConfig = require('@ufb/eslint-config/base');

export default [
  {
    ignores: ['dist/**', '**/*.js'],
  },
  ...baseConfig,
];
