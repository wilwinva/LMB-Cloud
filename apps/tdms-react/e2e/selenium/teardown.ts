import { stop as stopDevServer } from './webpack-dev-server';
export default async () => {
  await stopDevServer();
};
