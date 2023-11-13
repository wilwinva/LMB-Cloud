import env from './env';
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';

/** todo -- investigate better way to pull "id" field for all types since it's needed for the cache; possibly through the
 * policies or through the ApolloClient defaultOptions
 * */
const typePolicies = {
  typePolicies: {
    example: {
      keyFields: [],
    },
  },
};

const cache = new InMemoryCache();
//todo -- move credentials (something like frontdoor) or use user auth instead
const httpLink: ApolloLink = createHttpLink({
  uri: env.graphqlServerUri,
  headers: { 'Ocp-Apim-Subscription-Key': 'ab066a4941b84e8d9bf2f73b35f8fba7' },
});

const getClient = async function getClient() {
  //env.mockGraphQL grpahql logic currently disabled, use Schema.ts in a link if needed
  return new ApolloClient({
    cache,
    link: httpLink,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
      },
    },
  });
};

export default getClient;
