import reactPlugin from 'eslint-plugin-react';
import compilerPlugin from 'eslint-plugin-react-compiler';
import hooksPlugin from 'eslint-plugin-react-hooks';

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-compiler': compilerPlugin,
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/jsx-key': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'off',
      // New in v7. Existing components sync props into state inside effects;
      // keep it visible as a warning until they are refactored.
      'react-hooks/set-state-in-effect': 'warn',
      'react-compiler/react-compiler': 'error',
    },
    languageOptions: {
      globals: {
        React: 'writable',
      },
    },
  },
];
