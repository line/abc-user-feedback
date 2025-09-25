module.exports = {
  displayName: 'api',
  rootDir: './src',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/$2'],
  },
  transform: {
    '^.+\\.(t|j)s$': ['@swc-node/jest'],
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: '../coverage',
  clearMocks: true,
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.js'],
};
