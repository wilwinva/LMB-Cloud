const readline = require('readline');
const process = require('process');
const path = require('path');
const fs = require('fs');
const EOL = require('os').EOL;

const npmrc = {
  path: path.resolve('.npmrc'),
  keys: {
    script: 'script-shell',
  },
};

const win32_default_path = path.resolve('C:\\Program Files\\Git\\bin\\bash.exe');
const nix_default_path = path.resolve('/bin/bash');

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}
async function resolveBashPath(default_path) {
  let bash_path = default_path;
  if (!fs.existsSync(bash_path)) {
    bash_path = await askQuestion('Could not find bash executable. Please enter the absolute path to bash executable.');
    while (!fs.existsSync(bash_path)) {
      bash_path = await askQuestion('Invalid path, please provide valid path to bash executable.');
    }
  }

  appendToNpmrc(bash_path);
}

function appendToNpmrc(data) {
  fs.writeFileSync(npmrc.path, `${EOL}${npmrc.keys.script}=${data}${EOL}`, { flag: 'a' });
}

function npmrcHasShell(path) {
  try {
    return fs.readFileSync(path, 'utf8').includes(npmrc.keys.script);
  } catch (err) {
    //return false if file doesn't exist, otherwise throw error up
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return false;
  }
}

const default_path = process.platform === 'win32' ? win32_default_path : nix_default_path;
if (!npmrcHasShell(npmrc.path)) {
  console.log('No script-shell found in .npmrc, attempting to set script-shell to bash.');
  resolveBashPath(default_path).then();
}
