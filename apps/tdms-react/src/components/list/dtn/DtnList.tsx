import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { TransferComponent } from '../../../query/Transfer';
import StandardTable, { STANDARD_TABLE_QUERY } from '../../omniBar/results/StandardTable';
import { Loading } from '@nwm/util';
import { ListDtnQuery, ListDtnQueryVariables } from './__generated__/ListDtnQuery';

export const LIST_DTN_QUERY = gql`
  query ListDtnQuery($transfer: String, $ds: String, $parameter: String, $keyword: String) {
    db_tdms_data_set(
      order_by: { ds: asc }
      where: {
        _and: [
          { transfer: { component: { _eq: $transfer } } }
          { ds: { _eq: $ds } }
          { data_set_parameters: { parameter: { name: { _eq: $parameter } } } }
          { data_set_title: { title: { _ilike: $keyword } } }
        ]
        _not: { data_set_superseded_bies: { superseded_by_dtn: { _neq: "" } } }
      }
    ) {
      ...StandardTableFragment
    }
  }
  ${STANDARD_TABLE_QUERY}
`;

export interface DtnListProps {
  transfer?: TransferComponent;
  ds?: string;
  keyword?: string;
  parameter?: string;
}

function DtnList({ transfer, ds, keyword, parameter }: DtnListProps) {
  const wildCardKeyword = keyword ? `%${keyword}%` : undefined;
  const vars = { transfer, ds, keyword: wildCardKeyword, parameter };
  const { loading, error, data } = useQuery<ListDtnQuery, ListDtnQueryVariables>(LIST_DTN_QUERY, { variables: vars });

  if (error !== undefined) {
    throw error;
  }

  if (loading || data === undefined) {
    return <Loading />;
  }

  return <StandardTable data={data.db_tdms_data_set} defaultSort={{ key: 'DTN', isSortedDescending: true }} />;
}

export default React.memo(DtnList);
