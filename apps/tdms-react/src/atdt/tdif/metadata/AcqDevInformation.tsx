import React from 'react';
import { gql } from '@apollo/client';
import { HeaderRow, ValueRow } from '@nwm/uifabric';
import { Stack, StackItem, Text } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import {
  AcqDevInformationFragment,
  AcqDevInformationFragment_data_set_acq_sources,
  AcqDevInformationFragment_data_set_methods,
  AcqDevInformationFragment_data_set_periods,
  AcqDevInformationFragment_data_set_stns,
  AcqDevInformationFragment_data_set_tics,
} from './__generated__/AcqDevInformationFragment';
import { formatPeriodsObject, GetLocations } from './AcqDevHelpers';

export const ACQDEV_INFORMATION_FRAGMENT = gql`
  fragment AcqDevInformationFragment on db_tdms_data_set {
    data_set_methods {
      descr
    }
    data_set_stns {
      stn_no
    }
    data_set_acq_sources(where: { name: { _neq: "" } }) {
      name
      type
    }
    data_set_locations(
      where: {
        _or: [
          { name: { _neq: "", _is_null: false } }
          { x1_coord: { _neq: "", _is_null: false } }
          { x2_coord: { _neq: "", _is_null: false } }
          { y1_coord: { _neq: "", _is_null: false } }
          { y2_coord: { _neq: "", _is_null: false } }
          { z1_coord: { _neq: "", _is_null: false } }
          { z2_coord: { _neq: "", _is_null: false } }
        ]
      }
    ) {
      id
      name
      x1_coord
      x2_coord
      y1_coord
      y2_coord
      z1_coord
      z2_coord
    }
    data_set_periods {
      start_dt
      stop_dt
    }
    data_set_tics(where: { tic_no: { _is_null: false, _neq: 0 } }) {
      tic_no
    }
  }
`;

//todo -- this is a placeholder
const UpdateLink = <Link to={'.'}>Update</Link>;

const headerCellTextParameters = ['PART II: Acquisition and Development Information'];

export interface AcqDevInformationProps {
  data: AcqDevInformationFragment;
  styles: {
    maxWidth: number;
  };
}
export function AcqDevInformation(props: AcqDevInformationProps) {
  const { data, styles } = props;
  const { data_set_locations } = data;

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
          cellText={[<Text>Acquisition/Development Method {UpdateLink}</Text>]}
          topOff={true}
        />
        <ValueRow stackDimension={stackDimension} cellNumber={1} cellText={[buildMethods(data.data_set_methods)]} />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Software Tracking Number(s) {UpdateLink}</Text>]}
          topOff={true}
        />
        <ValueRow stackDimension={stackDimension} cellNumber={1} cellText={[buildStns(data.data_set_stns)]} />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Acquisition/Development Test ID/Sample Number(s) {UpdateLink}</Text>]}
          topOff={true}
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[buildAcqSources(data.data_set_acq_sources)]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<Text>Acquisition/Development Location(s) {UpdateLink}</Text>]}
          topOff={true}
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={1}
          cellText={[<GetLocations data={data_set_locations} />]}
        />
        <HeaderRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[
            <Text>Acquisition/Development Start and End Date(s) {UpdateLink}</Text>,
            <Text>TIC Number(s) {UpdateLink}</Text>,
          ]}
          topOff={true}
        />
        <ValueRow
          stackDimension={stackDimension}
          cellNumber={2}
          cellText={[buildPeriods(data.data_set_periods), buildTics(data.data_set_tics)]}
        />
      </Stack>
    </Stack>
  );
}

function buildMethods(data: AcqDevInformationFragment_data_set_methods[]) {
  const methods = data.map((item: AcqDevInformationFragment_data_set_methods, idx: number) => {
    return <Stack key={idx}>{item.descr}</Stack>;
  });
  return <>{methods}</>;
}

function buildStns(data: AcqDevInformationFragment_data_set_stns[]) {
  const stns = data.map((item: AcqDevInformationFragment_data_set_stns, idx: number) => {
    return <Stack key={idx}>{item.stn_no}</Stack>;
  });
  return <>{stns}</>;
}

function buildAcqSources(data: AcqDevInformationFragment_data_set_acq_sources[]) {
  const acq = data.map((item: AcqDevInformationFragment_data_set_acq_sources, idx: number) => {
    return (
      <Stack key={idx} horizontal>
        <StackItem>{item.name}</StackItem>
        <StackItem>{item.type}</StackItem>
      </Stack>
    );
  });
  return <>{acq}</>;
}

function buildPeriods(data: AcqDevInformationFragment_data_set_periods[]) {
  const periods = data.map((item: AcqDevInformationFragment_data_set_periods, idx: number) => {
    return <Stack key={idx}>{formatPeriodsObject(item, 'thru')}</Stack>;
  });
  return <>{periods}</>;
}

function buildTics(data: AcqDevInformationFragment_data_set_tics[]) {
  const tics = data.map((item: AcqDevInformationFragment_data_set_tics, idx: number) => {
    return <Stack key={idx}>{item.tic_no}</Stack>;
  });
  return <>{tics}</>;
}
