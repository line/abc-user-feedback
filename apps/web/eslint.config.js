import baseConfig from '@ufb/eslint-config/base';
import nextjsConfig from '@ufb/eslint-config/nextjs';
import reactConfig from '@ufb/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [
      '.next/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      'jest.setup.ts',
      'next-env.d.ts',
      'jest.polyfills.js',
      '**/api.type.ts',
    ],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
];
