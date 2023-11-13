import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import { Text } from 'office-ui-fabric-react';

import DtnList from '../components/list/dtn/DtnList';
import MwdModelInformation from './MwdModelInformation';
import MwdImportantNotes from './MwdImportantNotes';
import { TransferComponent } from '../query/Transfer';
import { TDMS_FILES_FRAGMENT } from '../components/helpers/TdmsFilesHelper';

const MWD_DATA_SET = gql`
  query MwdDataSet($ds: String) {
    data: db_tdms_data_set(where: { ds: { _eq: $ds } }) {
      ds
      data_set_description {
        ds_key
        descr
      }
      data_set_methods {
        ds_key
        descr
      }
      data_set_tbvs {
        tbv_num
        tbv_status
      }
      qual_flg
      prelim_data
      ...TdmsFilesFragment
    }
  }
  ${TDMS_FILES_FRAGMENT}
`;

export default function MwdDataSetPage() {
  const [query] = useParamsEncoded();

  const { loading, error, data } = useQuery(MWD_DATA_SET, {
    variables: {
      ds: query,
    },
  });

  if (loading) {
    return <p>Loading</p>;
  }
  if (error) {
    return <p>Error</p>;
  }

  const response = data.data[0];

  return (
    <PageWithIntro title="Model Warehouse Data Set">
      <section>
        <DtnList transfer={TransferComponent.MWD} ds={query} />
        <br />
        <Text block>
          <b>Data Set Description</b>
          <br />
          <span>{response.data_set_description?.descr}</span>
        </Text>
        <br />
        <Text block>
          <b>Acquisition / Development Method</b>
          <br />
          <span>{response.data_set_methods[0]?.descr}</span>
        </Text>
      </section>
      <MwdModelInformation transfer="MWD" dtn={response.ds} fileList={response.data_set_tdms_files} />
      <MwdImportantNotes data={response} />
    </PageWithIntro>
  );
}
