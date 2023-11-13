module.exports = (packageName, library = true) => {
  const directory = library ? 'packages' : 'apps';
  return {
    testRegex: [`${directory}/${packageName}/e2e/.+\\.spec\\.[jt]sx?`],
    clearMocks: true,
    rootDir: '../../../..',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: [`<rootDir>/${directory}/${packageName}.*/__generated__/`],
    moduleNameMapper: {
      'office-ui-fabric-react/lib/(.*)$': 'office-ui-fabric-react/lib-commonjs/$1',
      '^@uifabric/(.*)(/lib(?:/|$))(.*)$': '@uifabric/$1/lib-commonjs/$3',
      '^@nwm/(.*)$': `<rootDir>/packages/$1/src/`,
      '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js',
    },
    transform: {
      '^.+\\.[tj]sx?$': '<rootDir>/scripts/jest/nwm-babel-jest',
      '^.+\\.(gql|graphql)$': 'jest-transform-graphql',
    },
    setupFilesAfterEnv: [`<rootDir>/${directory}/${packageName}/scripts/jest/enzyme.test.config.js`],
  };
};
