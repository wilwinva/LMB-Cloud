import React from 'react';
import { gql } from '@apollo/client';
import { HeaderRow, ValueRow } from '@nwm/uifabric';
import { Stack, Text } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import { GetRecordRoadmaps } from './RecordsRoadmapHelpers';
import { RecordRoadmapInformationFragment } from './__generated__/RecordRoadmapInformationFragment';

export const RECORD_ROADMAP_INFORMATION_FRAGMENT = gql`
  fragment RecordRoadmapInformationFragment on db_tdms_data_set {
    data_set_records_roadmaps(where: { rec_flag: { _is_null: false, _nin: ["", " "] } }) {
      rec_flag
      rec_num
      rec_title
      doc_type
      rec_contents
    }
  }
`;

//todo -- this is a placeholder
const UpdateLink = <Link to={'.'}>Update</Link>;

const headerCellTextParameters = ['PART IV: Record Roadmap'];

export interface RecordRoadmapInformationProps {
  data: RecordRoadmapInformationFragment;
  styles: {
    maxWidth: number;
  };
}
export function RecordRoadmapInformation(props: RecordRoadmapInformationProps) {
  const { data, styles } = props;
  const { data_set_records_roadmaps } = data;

  const { maxWidth } = styles;
  const stackDimension = {
    height: 'auto',
    width: maxWidth,
  };

  return (
    <Stack>
      <HeaderRow
        stackDimension={stackDimension}
        cellNumber={headerCellTextParameters.length}
        cellText={headerCellTextParameters}
        background="themePrimary"
        color="themeSecondary"
      />
      <Stack>
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Records Roadmap {UpdateLink}</Text>]}
          topOff={true}
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={5}
          cellText={[<GetRecordRoadmaps data={data_set_records_roadmaps} />]}
        />
      </Stack>
    </Stack>
  );
}
