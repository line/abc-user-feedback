module.exports = {
  root: true,
  extends: ['next', 'custom'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
};
