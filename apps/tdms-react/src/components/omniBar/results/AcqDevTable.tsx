import React, { useMemo } from 'react';
import { Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import {
  addSpace,
  array2String,
  buildDtnLink,
  buildTdifNoLink,
  crushLatLongArray,
  crushPeriodArray,
  getHeaderRowTooltip,
} from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { AcqDevTableFragment, AcqDevTableFragment_data_set_acq_sources } from './__generated__/AcqDevTableFragment';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';
import { useParameterDialog } from '../../list/dtn/useDialog';
import { compact, map, size } from 'lodash';

export const ACQDEV_TABLE_QUERY = gql`
  fragment AcqDevTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    data_set_methods {
      id
      descr
    }
    data_set_stns {
      id
      stn_no
    }
    data_set_acq_sources(where: { name: { _neq: "" } }) {
      id
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
      id
      start_dt
      stop_dt
    }
    data_set_tics(where: { tic_no: { _is_null: false, _neq: 0 } }) {
      id
      tic_no
    }
  }
`;

const _buildColumns = (links: any, onDefinitionClick: any, classNames: any): ColumnGeneric<AcqDevTableFragment>[] => {
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: AcqDevTableFragment) => String(data.tdif_no),
      onRender: (item?: AcqDevTableFragment) => {
        return buildTdifNoLink(tdifDataSetLinkProps, item?.tdif_no, item?.ds);
      },
    },
    {
      key: 'DTN',
      minWidth: 170,
      maxWidth: 170,
      className: classNames.dataCells,
      isMultiline: true,
      ariaLabel: getHeaderRowTooltip('DTN'),
      getTargetString: (item: AcqDevTableFragment) => item?.ds ?? '',
      onRender: (item?: AcqDevTableFragment) => {
        return buildDtnLink(tdifLinkProps, item?.ds);
      },
    },
    {
      key: 'Acq/Dev Method',
      minWidth: 200,
      maxWidth: 200,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AcqDevTableFragment) => array2String(item.data_set_methods, 'descr'),
      onRender: (item?: AcqDevTableFragment) => {
        if (!item?.data_set_methods) {
          return undefined;
        }
        return <Text>{array2String(item.data_set_methods, 'descr')}</Text>;
      },
    },
    {
      key: 'Software Tracking Number (STN)',
      minWidth: 220,
      maxWidth: 220,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AcqDevTableFragment) => array2String(item.data_set_stns, 'stn_no'),
      onRender: (item?: AcqDevTableFragment) => {
        if (!item?.data_set_stns) {
          return undefined;
        }
        return <Text>{array2String(item.data_set_stns, 'stn_no')}</Text>;
      },
    },
    {
      key: 'Test ID Sample Number [Type]',
      minWidth: 200,
      maxWidth: 200,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AcqDevTableFragment) => getAcqSources(item.data_set_acq_sources),
      onRender: (item?: AcqDevTableFragment) => {
        if (!item?.data_set_acq_sources) {
          return undefined;
        }
        return <Text>{getAcqSources(item.data_set_acq_sources)}</Text>;
      },
    },
    {
      key: 'Acq/Dev Location',
      minWidth: 160,
      maxWidth: 160,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AcqDevTableFragment) => array2String(item?.data_set_locations, 'name'),
      onRender: (item?: AcqDevTableFragment) => {
        if (!item?.data_set_locations) {
          return undefined;
        }
        return (
          <Stack>
            {item.data_set_locations.map((loc, _idx) => (
              <Text key={_idx}>
                {_idx + 1}. {loc.name}
              </Text>
            ))}
          </Stack>
        );
      },
    },
    {
      key: 'TIC Number',
      minWidth: 80,
      maxWidth: 80,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AcqDevTableFragment) => array2String(item?.data_set_tics, 'tic_no'),
      onRender: (item?: AcqDevTableFragment) => {
        if (!item?.data_set_tics) {
          return undefined;
        }
        return <Text>{array2String(item.data_set_tics, 'tic_no')}</Text>;
      },
    },
    {
      key: 'Acquisition Date',
      minWidth: 160,
      maxWidth: 160,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AcqDevTableFragment) => crushPeriodArray(item.data_set_periods),
      onRender: (item?: AcqDevTableFragment) => {
        if (!item?.data_set_locations) {
          return undefined;
        }
        return <Text>{crushPeriodArray(item.data_set_periods)}</Text>;
      },
    },
    {
      key: 'Lat/Lon/Z Location',
      minWidth: 230,
      maxWidth: 230,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AcqDevTableFragment) =>
        crushLatLongArray(item?.data_set_locations).reduce((prev, cur) => `${prev} ${cur}`, ''),
      onRender: (item?: AcqDevTableFragment) => {
        if (!item?.data_set_locations) {
          return undefined;
        }
        return (
          <Stack>
            {crushLatLongArray(item?.data_set_locations).map((val, _idx) => (
              <Text>
                {_idx + 1}. {val}
              </Text>
            ))}
          </Stack>
        );
      },
    },
  ];
};

export interface AcqDevSourceTableProps {
  data: AcqDevTableFragment[];
  defaultSort: SortState;
}

export default function AcqDevSourceTable(props: AcqDevSourceTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const { showWithData } = useParameterDialog();

  const columns = useMemo(() => _buildColumns(links, showWithData, columnClass), [links, showWithData, columnClass]);

  return (
    <FilterableTable<AcqDevTableFragment> items={data} columns={columns} sortState={defaultSort}></FilterableTable>
  );
}

const getAcqSources = (dataSetAcqSources: AcqDevTableFragment_data_set_acq_sources[]): string => {
  const itemsSize = size(dataSetAcqSources);
  if (itemsSize === 0) {
    return dataSetAcqSources.toString();
  }
  const acqSources = dataSetAcqSources.map((dataSetAcqSource: AcqDevTableFragment_data_set_acq_sources) => {
    return `${dataSetAcqSource.name} [${dataSetAcqSource.type}]`;
  });
  return compact(map(acqSources, addSpace)).toString();
};
