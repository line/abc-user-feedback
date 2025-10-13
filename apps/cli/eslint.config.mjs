import baseConfig from '@ufb/eslint-config/base';

export default [
  {
    ignores: ['dist/**', '**/*.js'],
  },
  ...baseConfig,
];
