if (
  (process.env['http_proxy'] || process.env['HTTP_PROXY']) &&
  (process.env['https_proxy'] || process.env['HTTPS_PROXY'])
) {
  process.env.GLOBAL_AGENT_HTTP_PROXY = process.env['http_proxy']
    ? process.env['http_proxy']
    : process.env['HTTP_PROXY'];
  process.env.GLOBAL_AGENT_HTTPS_PROXY = process.env['https_proxy']
    ? process.env['https_proxy']
    : process.env['HTTPS_PROXY'];
  process.env.GLOBAL_AGENT_NO_PROXY = process.env['no_proxy'] ? process.env['no_proxy'] : process.env['NO_PROXY'];
  require('global-agent/bootstrap');
}

const DownloadSchema = require('apollo/lib/commands/client/download-schema').default;

/** Doesn't seem to be needed currently
 async function downloadJson() {
    await DownloadSchema.run([
        'schema.json',
        '--endpoint=https://nwm-hasura.azurewebsites.net/v1/graphql',
        '--header=X-Hasura-Admin-Secret: W6s8:JH\\`NaTU)e(',
    ]);
}

 downloadJson().catch((e) => console.log(e));
 */

async function downloadGraphql() {
  await DownloadSchema.run([
    'schema.graphql',
    /** Client schema needs to be ignored in either client:download-schema or in client:codegen; if both scripts
     * include client schema source then we will get errors generating the types on the second pass. The client schema
     * is still included by apollo, so excluding them here should not be an issue.
     * */
    '--excludes',
    'src/**/*.{ts,tsx,js,jsx,graphql,gql}',
    '--endpoint=https://nwm-hasura.azurewebsites.net/v1/graphql',
    '--header=X-Hasura-Admin-Secret: W6s8:JH\\`NaTU)e(',
  ]).catch((e) => console.log(e));
}

module.exports.downloadGraphql = downloadGraphql;
