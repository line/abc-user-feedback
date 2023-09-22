module.exports = {
  root: true,
  extends: ['next', 'ufb'],
  ignorePatterns: ['.next', '.turbo', 'api.type.ts'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
};
