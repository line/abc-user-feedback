module.exports = {
  root: true,
  extends: ['@ufb/eslint-config/base'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['jest.config.js', 'jest.setup.js', 'migrations'],
};
