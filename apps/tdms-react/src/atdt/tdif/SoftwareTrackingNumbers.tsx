import React, { ReactElement, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { HeaderRow, ValueRow } from '@nwm/uifabric';
import { SoftwareTrackingNumbers } from './__generated__/SoftwareTrackingNumbers';

export interface SoftwareTableProps {
  stackWidth: number;
  data: SoftwareTrackingNumbers;
}

export const STN_INFO_FRAGMENT = gql`
  fragment SoftwareTrackingNumbers on db_tdms_data_set {
    data_set_stns(where: { stn_no: { _is_null: false } }) {
      stn_no
    }
    data_set_src_tics(where: { src_tic_no: { _neq: 0 } }) {
      src_tic_no
    }
    data_set_records {
      pkg_id
    }
  }
`;

const headerCellText = ['Software Tracking Numbers', 'Source TIC#', 'RPC Pkg ID'];

export default function SoftwareTrackingNumber(props: SoftwareTableProps) {
  const { stackWidth, data } = props;

  const [cellText, cellNumber] = useMemo(() => buildLinks(data), [data]);

  return (
    <Stack>
      <HeaderRow
        stackDimension={{ height: 30, width: stackWidth }}
        cellNumber={headerCellText.length}
        cellText={headerCellText}
      />
      <ValueRow stackDimension={{ height: 60, width: stackWidth }} cellNumber={cellNumber} cellText={cellText} />
    </Stack>
  );
}

function buildLinks(data: SoftwareTrackingNumbers): [ReactElement[], number] {
  return [
    [
      <>
        {data.data_set_stns.map((data, idx) => {
          return (
            <div key={idx}>
              <Text> {data.stn_no} </Text>
            </div>
          );
        })}
      </>,
      <>
        {data.data_set_src_tics.map((data, idx) => {
          return (
            <Link key={idx} to={`../../tdif_tic/${data.src_tic_no}`}>
              <Text>{data.src_tic_no}</Text>
              <br />
            </Link>
          );
        })}
      </>,
      <>
        {data.data_set_records.map((data, idx) => {
          return (
            <Link key={idx} to={`../../tdif_rpc/${data.pkg_id}`}>
              <Text>{data.pkg_id}</Text>
              <br />
            </Link>
          );
        })}
      </>,
    ],
    3,
  ];
}
