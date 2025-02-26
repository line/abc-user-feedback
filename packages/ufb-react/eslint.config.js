const baseConfig = require('@ufb/eslint-config/base');
const reactConfig = require('@ufb/eslint-config/react');

/** @type {import('typescript-eslint').Config} */
module.exports = [
  {
    ignores: ['postcss.js'],
  },
  ...baseConfig,
  ...reactConfig,
];
