const ApiManagementUri =
  process.env.REACT_APP_API_URI === null || process.env.REACT_APP_API_URI === undefined
    ? 'https://nwm-dev.azure-api.net/lsn'
    : process.env.REACT_APP_API_URI;

const graphqlUri =
  process.env.REACT_APP_GRAPHQL_API === undefined || process.env.REACT_APP_GRAPHQL_API === null
    ? 'https://nwm-dev.azure-api.net/lsn-hasura-dev'
    : process.env.REACT_APP_GRAPHQL_API;

const storageAccountUri =
  process.env.REACT_APP_STORAGE_URI === null || process.env.REACT_APP_STORAGE_URI === undefined
    ? 'https://nwmlsnfaasstorage.blob.core.windows.net'
    : process.env.REACT_APP_STORAGE_URI;
const dev: any = {
  storageAccountUri: storageAccountUri,
  apiManagementUri: ApiManagementUri,
  graphqlServerUri: graphqlUri,
  mockGraphQL: true,
};

const prod = {
  ...dev,
  mockGraphQL: false,
};

const config =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined || process.env.NODE_ENV === null
    ? prod
    : dev;

console.info(`Loaded ${process.env.NODE_ENV} env variables.`);

export default {
  // Add common config values here
  ...config,
};
