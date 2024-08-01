const baseConfig = require('@ufb/eslint-config/base');
const nextjsConfig = require('@ufb/eslint-config/nextjs');
const reactConfig = require('@ufb/eslint-config/react');

/** @type {import('typescript-eslint').Config} */
module.exports = [
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
