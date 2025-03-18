const baseConfig = require('@ufb/eslint-config/base');
const reactConfig = require('@ufb/eslint-config/react');

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['postcss.js', 'dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
];
