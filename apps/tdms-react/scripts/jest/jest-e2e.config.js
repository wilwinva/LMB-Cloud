const createBaseConfig = require('../../../../scripts/jest/jest-base-e2e.config');
const packageName = require('../../package.json').name.split('@nwm/').pop();

module.exports = {
  displayName: packageName,
  globalSetup: `./apps/${packageName}/e2e/selenium/setup.ts`,
  globalTeardown: `./apps/${packageName}/e2e/selenium/teardown.ts`,
  ...createBaseConfig(packageName, false),
  verbose: true,
};
