const baseConfig = require('@ufb/eslint-config/base');
const nestjsConfig = require('@ufb/eslint-config/nestjs');

const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist/**', '**/*.js'],
  },
  ...baseConfig,
  ...nestjsConfig,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
