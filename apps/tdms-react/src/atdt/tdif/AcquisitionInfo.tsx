import React, { ReactElement, useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { HeaderRow, ValueRow } from '@nwm/uifabric';
import {
  AcquisitionInfoFragment,
  AcquisitionInfoFragment_data_set_methods,
} from './__generated__/AcquisitionInfoFragment';
import { TdifDisplayTypes } from './TdifDisplayTypes';

export interface AcquisitionInfoProps {
  stackWidth: number;
  data: AcquisitionInfoFragment;
  tdifDisplayTypes: TdifDisplayTypes;
}

export const ACQUISITION_INFO_FRAGMENT = gql`
  fragment AcquisitionInfoFragment on db_tdms_data_set {
    data_set_methods(where: { descr: { _neq: "" } }) {
      descr
    }
  }
`;

const headerCellTextADM = ['Acquisition Development Method'];

export default function AcquisitionInfo(props: AcquisitionInfoProps) {
  const { stackWidth, data } = props;

  const adm = data.data_set_methods;

  const cellTextADMParam = useMemo(() => buildADMList(adm), [data]);
  const cellNumberADMParam = cellTextADMParam.length;
  return (
    <>
      <HeaderRow
        stackDimension={{ height: 30, width: stackWidth }}
        cellNumber={headerCellTextADM.length}
        cellText={headerCellTextADM}
        topOff={true}
      />
      <ValueRow
        stackDimension={{ height: 40, width: stackWidth }}
        cellNumber={cellNumberADMParam}
        cellText={cellTextADMParam}
      />
    </>
  );
}

function buildADMList(data: AcquisitionInfoFragment_data_set_methods[]): ReactElement[] {
  return [
    <>
      {data.map((data: AcquisitionInfoFragment_data_set_methods, idx: number) => {
        return buildItem(data.descr, idx);
      })}
    </>,
  ];
}

function buildItem(item: string, idx: number) {
  return (
    <div key={idx}>
      <Text>{item}</Text>
    </div>
  );
}
