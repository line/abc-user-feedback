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

import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

import headerPlugin from '@ufb/eslint-plugin-header';

export default tseslint.config(
  {
    ignores: ['**/*.config.*'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
      header: headerPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
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
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { project: true } },
  },
);
