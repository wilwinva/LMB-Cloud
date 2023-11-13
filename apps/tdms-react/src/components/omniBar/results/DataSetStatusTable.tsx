import React, { useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import {
  buildDtnLink,
  buildTdifNoLink,
  getHeaderRowTooltip,
  getPrelimData,
  getQCedFlag,
  getQualFlagString,
} from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';
import { useParameterDialog } from '../../list/dtn/useDialog';
import { StatusTableFragment } from './__generated__/StatusTableFragment';
import { formatValidDate } from '../../helpers/FormatDateTime';
import { AcquiredDeveloped } from '../../../atdt/tdif/info-table/InfoTable';

export const STATUS_TABLE_QUERY = gql`
  fragment StatusTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    type
    estab_fact
    pud
    tpo
    prelim_data
    qual_flg
    tdif {
      id
      qced_flg
      qced_dt
      submit_dt
    }
  }
`;

const _buildColumns = (links: any, onDefinitionClick: any, classNames: any): ColumnGeneric<StatusTableFragment>[] => {
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: StatusTableFragment) => String(data.tdif_no),
      onRender: (item?: StatusTableFragment) => {
        return buildTdifNoLink(tdifDataSetLinkProps, item?.tdif_no, item?.ds);
      },
    },
    {
      key: 'DTN',
      minWidth: 150,
      maxWidth: 150,
      className: classNames.dataCells,
      isMultiline: true,
      ariaLabel: getHeaderRowTooltip('DTN'),
      getTargetString: (item: StatusTableFragment) => item?.ds ?? '',
      onRender: (item?: StatusTableFragment) => {
        return buildDtnLink(tdifLinkProps, item?.ds);
      },
    },
    {
      key: 'Data Type',
      minWidth: 140,
      maxWidth: 300,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: StatusTableFragment) => AcquiredDeveloped(item),
      onRender: (item?: StatusTableFragment) => {
        return <Text>{AcquiredDeveloped(item)}</Text>;
      },
    },
    {
      key: 'Qced',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: StatusTableFragment) => getQCedFlag(item?.tdif?.qced_flg),
      onRender: (item?: StatusTableFragment) => {
        return <Text>{getQCedFlag(item?.tdif?.qced_flg)}</Text>;
      },
    },
    {
      key: 'Qced Date',
      minWidth: 100,
      maxWidth: 100,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: StatusTableFragment) => formatValidDate(item?.tdif?.qced_dt ?? ''),
      onRender: (item?: StatusTableFragment) => {
        return <Text>{formatValidDate(item?.tdif?.qced_dt)}</Text>;
      },
    },
    {
      key: 'Qualified',
      minWidth: 220,
      maxWidth: 220,
      isMultiline: true,
      className: classNames.dataCells,
      getTargetString: (item: StatusTableFragment) => getQualFlagString(item?.qual_flg),
      onRender: (item?: StatusTableFragment) => {
        return <Text>{getQualFlagString(item?.qual_flg)}</Text>;
      },
    },
    {
      key: 'Preliminary Data',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: StatusTableFragment) => getPrelimData(item?.prelim_data),
      onRender: (item?: StatusTableFragment) => {
        return <Text>{getPrelimData(item?.prelim_data)}</Text>;
      },
    },
    {
      key: 'TDIF Submittal Date',
      minWidth: 130,
      maxWidth: 130,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: StatusTableFragment) => formatValidDate(item?.tdif?.submit_dt ?? ''),
      onRender: (item?: StatusTableFragment) => {
        return <Text>{formatValidDate(item?.tdif?.submit_dt)}</Text>;
      },
    },
  ];
};

export interface StatusTableProps {
  data: StatusTableFragment[];
  defaultSort: SortState;
}

export default function StatusTable(props: StatusTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const { showWithData } = useParameterDialog();

  const columns = useMemo(() => _buildColumns(links, showWithData, columnClass), [links, showWithData, columnClass]);

  return (
    <FilterableTable<StatusTableFragment> items={data} columns={columns} sortState={defaultSort}></FilterableTable>
  );
}
