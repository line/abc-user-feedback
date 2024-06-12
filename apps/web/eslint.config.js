import baseConfig from '@ufb/eslint-config/base';
import nextjsConfig from '@ufb/eslint-config/nextjs';
import reactConfig from '@ufb/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
];
