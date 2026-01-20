import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

import baseConfig from '@ufb/eslint-config/base';
import nestjsConfig from '@ufb/eslint-config/nestjs';

export default [
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
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    },
  },
];
