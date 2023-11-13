import React, { ReactElement } from 'react';
import { gql } from '@apollo/client';
import { HeaderRow, ValueRow } from '@nwm/uifabric';
import { Stack, Text } from 'office-ui-fabric-react';
import { HeaderInformationFragment } from './__generated__/HeaderInformationFragment';
import { Link } from 'react-router-dom';
import { QC_VALUE_HEADER_FRAGMENT, QcValueHeader } from '../QcHelper';
import { getVerificationStatus } from '../VerificationStatusHelper';
import { AcquiredDeveloped } from '../../../atdt/tdif/info-table/InfoTable';

export const HEADER_INFORMATION_FRAGMENT = gql`
  fragment HeaderInformationFragment on db_tdms_data_set {
    ds
    ds_key
    type
    estab_fact
    pud
    tpo
    data_set_tbvs {
      tbv_status
      tbv_num
    }
    ...QcValueHeaderFragment
  }
  ${QC_VALUE_HEADER_FRAGMENT}
`;

//todo -- this is a placeholder
const UpdateLink = <Link to={'.'}>Update</Link>;

const headerCellTextParameters = ['Header Information'];
const headers = [
  [<Text>Data Tracking Number {UpdateLink}</Text>, <Text>TDIF Number</Text>],
  [<Text>TBV Data {UpdateLink}</Text>, <Text>Data Type {UpdateLink}</Text>],
  ['', <Text>QC Status, Original QC Date {UpdateLink}</Text>],
];

export interface HeaderInformationProps {
  data: HeaderInformationFragment;
  styles: {
    maxWidth: number;
  };
}

export function HeaderInformation(props: HeaderInformationProps) {
  const { data, styles } = props;

  const values: (string | ReactElement)[][] = [
    [data.ds || '', data.ds_key?.toString() || ''],
    [getVerificationStatus(data.data_set_tbvs), AcquiredDeveloped(data)],
    ['', <QcValueHeader {...data} />],
  ];

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
        <HeaderRow stackDimension={stackDimension} cellNumber={headers[0].length} cellText={headers[0]} topOff />
        <ValueRow stackDimension={stackDimension} cellNumber={values[0].length} cellText={values[0]} />
        <HeaderRow stackDimension={stackDimension} cellNumber={headers[1].length} cellText={headers[1]} topOff />
        <ValueRow stackDimension={stackDimension} cellNumber={values[1].length} cellText={values[1]} />
        <HeaderRow stackDimension={stackDimension} cellNumber={headers[2].length} cellText={headers[2]} topOff />
        <ValueRow stackDimension={stackDimension} cellNumber={values[2].length} cellText={values[2]} />
      </Stack>
    </Stack>
  );
}
