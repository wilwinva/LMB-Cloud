import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import { TransferComponent } from '../query/Transfer';
import SepTableList, { SEP_DTN_MODEL_TABLE_FRAGMENT } from './SepTableList';
import { SEP_TABLE_TEXT_QUERY, SepTableText } from './SepTableText';
import StandardTable, { STANDARD_TABLE_QUERY } from '../components/omniBar/results/StandardTable';
import { SepDtnModelQuery, SepDtnModelQueryVariables } from './__generated__/SepDtnModelQuery';
import { TDMS_FILES_FRAGMENT } from '../components/helpers/TdmsFilesHelper';

const SEP_DATA_SET = gql`
  query SepDtnModelQuery($transfer: String, $ds: String) {
    db_tdms_data_set(
      order_by: { ds: asc }
      where: {
        _and: [{ transfer: { component: { _eq: $transfer } } }, { ds: { _eq: $ds } }]
        _not: { data_set_superseded_bies: { superseded_by_dtn: { _neq: "" } } }
      }
    ) {
      ...StandardTableFragment
      ...TdmsFilesFragment
    }
    ...SepTableTextFragment
    ...SepDtnModelTableFragment
  }
  ${STANDARD_TABLE_QUERY}
  ${SEP_DTN_MODEL_TABLE_FRAGMENT}
  ${SEP_TABLE_TEXT_QUERY}
  ${TDMS_FILES_FRAGMENT}
`;

export default function SepDtnModel() {
  const [ds] = useParamsEncoded();
  const { loading, error, data } = useQuery<SepDtnModelQuery, SepDtnModelQueryVariables>(SEP_DATA_SET, {
    variables: { ds: ds, transfer: TransferComponent.SEP },
  });

  if (error) {
    throw error;
  }

  if (loading || data === undefined) {
    return <p>Loading</p>;
  }

  return (
    <PageWithIntro title="Site & Engineering Properties Data Set">
      <StandardTable data={data.db_tdms_data_set} defaultSort={{ key: 'DTN', isSortedDescending: true }} />
      <SepTableText data={data} />
      <SepTableList data={data} transfer={TransferComponent.SEP} />
    </PageWithIntro>
  );
}
