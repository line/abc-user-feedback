import { fileURLToPath } from 'url';

/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  experimentalTernaries: true,
  endOfLine: 'auto',
  tabWidth: 2,
  useTabs: false,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindConfig: fileURLToPath(
    new URL('../../packages/ufb-tailwindcss/index.js', import.meta.url),
  ),
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@ufb/(.*)$',
    '',
    '^(@/shared/(.*))$|^(@/shared$)',
    '^(@/entities/(.*)$)|^(@/entities$)',
    '^(@/features/(.*)$)|^(@/features$)',
    '^(@/widgets/(.*)$)|^(@/widgets$)',
    '',
    '^@/',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};

export default config;
