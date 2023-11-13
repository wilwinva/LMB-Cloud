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
      db_tdms_transfer: () => {
        return {
          component: 'spa',
        };
      },
    },
  });
  return schema;
}
