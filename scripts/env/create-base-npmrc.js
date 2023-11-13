const path = require('path');
const fs = require('fs');

const default_npmrc_path = path.resolve('scripts/env/.npmrc');
const npmrc_path = path.resolve('.npmrc');

async function createBaseNpmrc() {
  return fs.promises.copyFile(default_npmrc_path, npmrc_path, fs.constants.COPYFILE_EXCL);
}

createBaseNpmrc().catch((err) => {
  if (err.code !== 'EEXIST') {
    throw err;
  }
});
