const createBaseConfig = require('../../../../scripts/jest/jest-base.config');
const packageName = require('../../package.json').name.split('@nwm/').pop();

module.exports = {
  displayName: packageName,
  ...createBaseConfig(packageName),
};
