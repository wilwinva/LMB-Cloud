import React from 'react';
import { HeaderRow, Table, ColumnGeneric } from '@nwm/uifabric';
import { gql, useQuery } from '@apollo/client';
import { useParamsEncoded } from '@nwm/react-hooks';
import { getTheme } from '@uifabric/styling';
import { Loading } from '@nwm/util';
import { Text } from 'office-ui-fabric-react';
import {
  TdifRecordsRoadmapQuery,
  TdifRecordsRoadmapQuery_db_tdms_data_set_records_roadmap as TdifRecordsRoadmapData,
} from './__generated__/TdifRecordsRoadmapQuery';

export const TDIF_RECORDS_ROADMAP_QUERY = gql`
  query TdifRecordsRoadmapQuery($ds: String!) {
    db_tdms_data_set_records_roadmap(where: { data_set: { ds: { _eq: $ds } } }) {
      rec_num
      doc_type
      rec_title
      rec_contents
    }
  }
`;

const columns: ColumnGeneric<TdifRecordsRoadmapData>[] = [
  {
    key: 'Rec Num',
    minWidth: 70,
    maxWidth: 70,
    getTargetString: (it: TdifRecordsRoadmapData) => `${it.rec_num}`,
    onRender: (it?: TdifRecordsRoadmapData) => (it ? <Text>{it.rec_num}</Text> : <></>),
  },
  {
    key: 'Doc Type',
    minWidth: 70,
    maxWidth: 70,
    getTargetString: (it: TdifRecordsRoadmapData) => `${it.doc_type}`,
    onRender: (it?: TdifRecordsRoadmapData) => (it ? <Text>{it.doc_type}</Text> : <></>),
  },
  {
    key: 'Rec Title',
    minWidth: 70,
    maxWidth: 70,
    getTargetString: (it: TdifRecordsRoadmapData) => `${it.rec_title}`,
    onRender: (it?: TdifRecordsRoadmapData) => (it ? <Text>{it.rec_title}</Text> : <></>),
  },
  {
    key: 'Rec Contents',
    minWidth: 70,
    maxWidth: 70,
    getTargetString: (it: TdifRecordsRoadmapData) => `${it.rec_contents}`,
    onRender: (it?: TdifRecordsRoadmapData) => (it ? <Text>{it.rec_contents}</Text> : <></>),
  },
];

interface TdfiRecordsRoadmapProps {}

function RecordsRoadmap(props: TdfiRecordsRoadmapProps) {
  const stackWidth = '100%';
  const [ds] = useParamsEncoded();
  const pageHeader = 'Records Roadmap for DTN ' + ds;
  const spacing = getTheme().spacing;
  const { loading, error, data } = useQuery<TdifRecordsRoadmapQuery>(TDIF_RECORDS_ROADMAP_QUERY, {
    variables: {
      ds: ds,
    },
  });
  if (loading) {
    return <Loading name={'Records Roadmap'} />;
  } else if (error) {
    const message = `Error getting data for RecordsRoadmap ${error}`;
    console.error(message);
    return <Text>{message}</Text>;
  } else if (data) {
    return (
      <div style={{ marginLeft: spacing.s2, marginRight: spacing.s2 }}>
        <HeaderRow
          stackDimension={{ height: 30, width: stackWidth }}
          cellNumber={1}
          cellText={[pageHeader]}
          background="themePrimary"
          color="themeSecondary"
          fontWeight="600"
        />
        <br />
        <Table<TdifRecordsRoadmapData> items={data.db_tdms_data_set_records_roadmap} columns={columns} />
      </div>
    );
  }
  return <Text>{'No data returned'}</Text>;
}
export default RecordsRoadmap;
