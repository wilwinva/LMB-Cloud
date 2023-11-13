import { GraphQLSchema } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import gSchema from '../schema.graphql';

export default function getSchema(): GraphQLSchema {
  const schema = makeExecutableSchema({ typeDefs: gSchema });
  addMockFunctionsToSchema({
    schema,
    mocks: {
      timestamptz: () => {
        return '2018-12-20';
      },
      timestamp: () => {
        return '2018-12-20';
      },
      float8: () => {
        return 327302;
      },
      bpchar: () => {
        return 'P';
      },
    },
  });
  return schema;
}
