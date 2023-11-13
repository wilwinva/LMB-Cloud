import React from 'react';
import gql from 'graphql-tag';

const withItemQuery = (WrappedComponent: any) => (props: any) => {
  const {
    model: { where, limit, offset, itemQueryName },
  } = props;
  const query = gql(`
    query Documents($workflow_id: float8, $stage_id: float8, $user: String, $limit: Int, $offset: Int)  {
      workflow_documents(${where} ${limit} ${offset}) {
      ID
    }
  `);
  return <WrappedComponent itemQuery={query} itemQueryName={itemQueryName} {...props} />;
};

export default withItemQuery;
