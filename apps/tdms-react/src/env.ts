const dev: any = {
  graphqlServerUri: 'https://nwm-hasura.azurewebsites.net/v1/graphql',
  mockGraphQL: false,
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
