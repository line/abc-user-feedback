const baseConfig = require('@ufb/eslint-config/base');
const nestjsConfig = require('@ufb/eslint-config/nestjs');
const reactConfig = require('@ufb/eslint-config/react');

/** @type {import('typescript-eslint').Config} */
module.exports = [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
  ...nestjsConfig,
];
