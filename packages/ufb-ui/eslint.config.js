import baseConfig from '@ufb/eslint-config/base';
import reactConfig from '@ufb/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
