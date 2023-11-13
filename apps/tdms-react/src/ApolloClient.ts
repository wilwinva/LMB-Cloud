import env from './env';
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    query_root: {
      queryType: true,
    },
    mutation_root: {
      mutationType: true,
    },
    subscription_root: {
      subscriptionType: true,
    },
  },
});
//todo -- move credentials (something like frontdoor) or use user auth instead
const httpLink: ApolloLink = createHttpLink({
  uri: env.graphqlServerUri,
  headers: { 'X-Hasura-Admin-Secret': 'W6s8:JH\\`NaTU)e(' },
});

async function getClient() {
  if (env.mockGraphQL) {
    //todo -- mock grpahql logic currently disabled, use Schema.ts in a link if needed
    return new ApolloClient({
      cache,
      link: httpLink,
    });
  } else {
    return new ApolloClient({
      cache,
      link: httpLink,
    });
  }
}

export default getClient;
