import React from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql, useQuery } from '@apollo/client';
import { HeaderTableQuery, HeaderTableQueryVariables } from './__generated__/HeaderTableQuery';
import { Loading } from '@nwm/util';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import StandardTable, { STANDARD_TABLE_QUERY } from '../../omniBar/results/StandardTable';
import { TDMS_FILES_FRAGMENT } from '../../helpers/TdmsFilesHelper';

export const HEADER_TABLE_QUERY = gql`
  query HeaderTableQuery($tdif_no: Int!) {
    db_tdms_data_set(order_by: { tdif_no: asc }, where: { tdif_no: { _eq: $tdif_no } }) {
      ...StandardTableFragment
      ...TdmsFilesFragment
    }
  }
  ${STANDARD_TABLE_QUERY}
  ${TDMS_FILES_FRAGMENT}
`;

export interface HeaderProps {
  tdif_no: number | string | undefined;
}

function HeaderTable(props: HeaderProps) {
  const { tdif_no } = props;
  const tdif = typeof tdif_no === 'number' ? tdif_no : parseInt(tdif_no ?? '', 10);
  const { loading, error, data } = useQuery<HeaderTableQuery, HeaderTableQueryVariables>(HEADER_TABLE_QUERY, {
    variables: { tdif_no: tdif },
  });

  if (error !== undefined) {
    throw error;
  }

  if (loading || data === undefined) {
    return <Loading name={'Header Data row...'} />;
  }

  const dataTable =
    data.db_tdms_data_set.length > 0 ? (
      <StandardTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />
    ) : (
      <></>
    );
  return dataTable;
}
function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch header table with error: ${props.error} `}</Text>;
}

export default withErrorBoundary(HeaderTable, ErrorFallback);
