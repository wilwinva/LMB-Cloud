//declare const target: string | undefined;

type Servers = {
  [key: string]: any;
};

const servers: Servers = {
  local: {
    protocol: 'https',
    hostname: 'localhost',
    port: '8080',
    withWebpack: true,
  },
};

/** TODO
 *   Impl:
 *     Allow changing the target server from CLI (npm script) without changing code. Can do this with multiple jest.config
 *     files but would prefer avoiding that approach and using some kind of runtime flag if possible.
 *   Explanation:
 *     Was planning on adding other servers here (like dev server) and only starting webpack for local.
 *     That was using a global flag from jest like this:
 *       `jest -c scripts/jest/jest-e2e.config.js --globals='{\"target\": \"local\"}`,
 *     to select the target server. That worked fine with `beforeAll`, however, to run bfore all tests instead of before
 *     every file grouping of tests needed to use globalSetup and globalTeardown instead. These don't expose the globals
 *     variables for some reason; the variables are only in the projectConfiguration object, which is not passed to the global
 *     functions (they get globalConfiguration instead).
 */
const server = servers.local;

export default {
  graphqlServerUri: 'https://nwm-hasura.azurewebsites.net/v1/graphql',
  server: {
    url: `${server.protocol}://${server.hostname}:${server.port}`,
    ...server,
  },
};
