/** @type {import('jest').Config} */
const config = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svg.js',
  },
};
export default config;
