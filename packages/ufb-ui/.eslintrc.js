module.exports = {
  root: true,
  extends: ['ufb'],
  ignorePatterns: ['*.config.js'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
