import React from 'react';
import { gql } from '@apollo/client';
import { HeaderRow, ValueRow } from '@nwm/uifabric';
import { Stack, Text } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import {
  SourceInformationFragment,
  SourceInformationFragment_data_set_dev_sources,
  SourceInformationFragment_data_set_managements,
  SourceInformationFragment_data_set_src_tics,
} from './__generated__/SourceInformationFragment';

export const SOURCE_INFORMATION_FRAGMENT = gql`
  fragment SourceInformationFragment on db_tdms_data_set {
    data_set_src_tics(where: { src_tic_no: { _is_null: false, _neq: 0 } }) {
      src_tic_no
    }
    data_set_managements(where: { descr: { _neq: "" } }) {
      descr
    }
    data_set_dev_sources(where: { ds: { _neq: "" } }) {
      ds
    }
  }
`;

//todo -- this is a placeholder
const UpdateLink = <Link to={'.'}>Update</Link>;

const headerCellTextParameters = ['PART III: Sources'];

export interface SourceInformationProps {
  data: SourceInformationFragment;
  styles: {
    maxWidth: number;
  };
}
export function SourceInformation(props: SourceInformationProps) {
  const { data, styles } = props;

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
          cellNumber={2}
          cellText={[
            <Text>Source Data Tracking Number(s) {UpdateLink}</Text>,
            <Text>Source TIC Number(s) {UpdateLink}</Text>,
          ]}
          topOff={true}
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[
            buildSourceDataTrackingNumbers(data.data_set_dev_sources),
            buildSourceTICNumbers(data.data_set_src_tics),
          ]}
        />
      </Stack>
      <Stack>
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Other Management Info {UpdateLink}</Text>]}
          topOff={true}
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[buildOtherManagementInfo(data.data_set_managements)]}
        />
      </Stack>
    </Stack>
  );
}

function buildSourceDataTrackingNumbers(data: SourceInformationFragment_data_set_dev_sources[]) {
  const sources = data.map((item: SourceInformationFragment_data_set_dev_sources, idx: number) => {
    return <Stack key={idx}>{item.ds}</Stack>;
  });
  return <>{sources}</>;
}

function buildSourceTICNumbers(data: SourceInformationFragment_data_set_src_tics[]) {
  const tics = data.map((item: SourceInformationFragment_data_set_src_tics, idx: number) => {
    return <Stack key={idx}>{item.src_tic_no}</Stack>;
  });
  return <>{tics}</>;
}

function buildOtherManagementInfo(data: SourceInformationFragment_data_set_managements[]) {
  const other = data.map((item: SourceInformationFragment_data_set_managements, idx: number) => {
    return <Stack key={idx}>{item.descr}</Stack>;
  });
  return <>{other}</>;
}
