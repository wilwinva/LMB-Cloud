const minimatch = require('minimatch');
const { exec } = require('child_process');
const findRemoveSync = require('find-remove');

const run = async (command) =>
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

const watch = (comp, includes) => {
  return Object.getOwnPropertyNames(comp.watchFileSystem.watcher.mtimes)
    .map((file) => file.replace(comp.options.context, '.'))
    .some((file) => minimatch(file, includes));
};

const plugin = {
  apply: (compiler) => {
    const sourceScripts = './src/**/*.+(ts|tsx|js|jsx|graphql|gql)';
    const rootFiles = './*';
    const generateTypes = async (comp) => {
      if (watch(comp, sourceScripts)) {
        return run('npm run generate-typescript');
      }
    };
    const cleanupOldGeneratedTypescript = async (comp) => {
      if (watch(comp, sourceScripts)) {
        findRemoveSync('./', { dir: '__generated__' });
        await generateTypes(comp);
      }
    };

    const prettier = async (comp) => {
      if (watch(comp, rootFiles)) {
        run('npm run prettier');
      }
    };

    compiler.hooks.afterEnvironment.tap(
      'Running Initial Setup Scripts',
      async (_comp) => await run('npm run fetch-schema & npm run generate-typescript')
    );
    compiler.hooks.watchRun.tapPromise(
      'Running Hot Reload Scripts',
      async (comp) => await cleanupOldGeneratedTypescript(comp).then(() => prettier(comp))
    );
  },
};

module.exports.graphqlWebpackPlugin = plugin;
