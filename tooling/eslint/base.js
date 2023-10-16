/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'turbo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: { es2022: true, node: true },
  plugins: ['@typescript-eslint', 'import', 'header', 'prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'header/header': [
      'error',
      'block',
      [
        '*',
        ' * Copyright 2023 LINE Corporation',
        ' *',
        ' * LINE Corporation licenses this file to you under the Apache License,',
        ' * version 2.0 (the "License"); you may not use this file except in compliance',
        ' * with the License. You may obtain a copy of the License at:',
        ' *',
        ' *   https://www.apache.org/licenses/LICENSE-2.0',
        ' *',
        ' * Unless required by applicable law or agreed to in writing, software',
        ' * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT',
        ' * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the',
        ' * License for the specific language governing permissions and limitations',
        ' * under the License.',
        ' ',
      ],
      1,
    ],
    'turbo/no-undeclared-env-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  },
  ignorePatterns: [
    '**/*.config.js',
    '**/*.config.cjs',
    '**/*.config.mjs',
    '.next',
    'dist',
    'yarn.lock',
  ],
  reportUnusedDisableDirectives: true,
};
