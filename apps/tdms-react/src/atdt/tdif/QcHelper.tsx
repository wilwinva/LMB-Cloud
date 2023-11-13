import * as React from 'react';
import { ReactElement } from 'react';
import { InfoTableFragment } from './info-table/__generated__/InfoTableFragment';
import { formatValidDate } from '../../components/helpers/FormatDateTime';
import { Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';

export const QC_VALUE_HEADER_FRAGMENT = gql`
  fragment QcValueHeaderFragment on db_tdms_data_set {
    tdif {
      qced_flg
      qced_dt
      submit_dt
    }
  }
`;

export function getQualificationStatus(data_qual_flg: String | null | undefined) {
  switch (data_qual_flg) {
    case 'Y':
      return 'Qualified';
    case 'N':
      return 'Unqualified';
    case 'A':
      return 'Accepted';
    case 'T':
      return 'Technical Product Output';
    default:
      return 'No Qualification Status Available';
  }
}

export const QcHeader: ReactElement = (
  <Stack>
    <Text>QC Status</Text>
    <Text>Original QC Date</Text>
  </Stack>
);

export interface QcValueProps extends Pick<InfoTableFragment, 'tdif'> {}

export function QcValueHeader(props: QcValueProps) {
  const { tdif } = props;
  const qced = tdif?.qced_flg === 'Y' ? "QC'ed" : "Not Currently QC'ed";
  return (
    <Stack>
      <Text>{qced}</Text>
      <Text>{formatValidDate(tdif?.qced_dt)}</Text>
    </Stack>
  );
}
