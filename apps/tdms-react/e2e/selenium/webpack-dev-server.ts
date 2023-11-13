import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import env from './env';
import util from 'util';

const { hostname, port } = env.server;
const webpackConfig = require('../../webpack.dev.config.js');
const server = new WebpackDevServer(Webpack(webpackConfig), { ...webpackConfig.devServer, quiet: true });

const serverCallback = (port: number, hostname: string, cb: (err?: Error) => void) => server.listen(port, hostname, cb);

export const start = async () => {
  await util
    .promisify(serverCallback)(port, hostname)
    .then(() => console.log(`webpack server started`))
    .catch((err) => console.error(`webpack server error on start: ${err}`));

  (global as any).__SERVER__ = server;
};

export const stop = async () => {
  console.log('calling teardown');
  if (!(global as any).__SERVER__) {
    console.log(`shutting down - no server object found`);
    return;
  }

  const server: WebpackDevServer = (global as any).__SERVER__;
  await new Promise((resolve) => {
    server.close(() => {
      console.log(`promise closed server`);
      resolve();
    });
  }).catch((err) => console.error(`promise error: ${err}`));
};
