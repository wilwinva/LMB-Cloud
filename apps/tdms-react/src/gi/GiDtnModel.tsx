import React from 'react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Text } from 'office-ui-fabric-react';
import { useParamsEncoded } from '@nwm/react-hooks';

import { gql, useQuery } from '@apollo/client';
import GiResultsTable, { GI_RESULTS_TABLE_FRAGMENT } from './components/GiResultsTable';
import { GiDtnModelQuery, GiDtnModelQueryVariables } from './__generated__/GiDtnModelQuery';
import { Loading } from '@nwm/util';

export const GI_DTN_MODEL = gql`
  query GiDtnModelQuery($ds: String) {
    db_tdms_data_set(
      distinct_on: tdif_no
      where: {
        _and: [{ tdif_no: { _is_null: false } }, { ds: { _eq: $ds } }]
        _not: { data_set_superseded_bies: { superseded_by_dtn: { _neq: "" } } }
      }
    ) {
      ...GiResultsTableFragment
    }
  }
  ${GI_RESULTS_TABLE_FRAGMENT}
`;

//todo -- can be moved to GiSearchResults.. only title varies
function GiDtnModel() {
  const [query] = useParamsEncoded();

  const { loading, error, data } = useQuery<GiDtnModelQuery, GiDtnModelQueryVariables>(GI_DTN_MODEL, {
    variables: { ds: query },
  });

  if (error !== undefined) {
    throw error;
  }

  if (loading || data === undefined) {
    return <Loading name={'GI DTN Model'} />;
  }

  return (
    <GiResultsTable
      title={'Geographic Information Data Set'}
      data={data.db_tdms_data_set}
      defaultSort={{ key: 'DTN', isSortedDescending: true }}
    />
  );
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch dtn with error: ${props.error} `}</Text>;
}

export default withErrorBoundary(GiDtnModel, ErrorFallback);
