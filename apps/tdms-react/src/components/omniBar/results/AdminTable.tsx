import React, { useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { buildDtnLink, buildTdifNoLink, getHeaderRowTooltip } from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { AdminTableFragment } from './__generated__/AdminTableFragment';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';
import { formatValidDate } from '../../helpers/FormatDateTime';

export const ADMIN_TABLE_QUERY = gql`
  fragment AdminTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    insert_dt
    insert_user
    update_dt
    update_user
  }
`;

const _buildColumns = (links: any, classNames: any): ColumnGeneric<AdminTableFragment>[] => {
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: AdminTableFragment) => String(data.tdif_no),
      onRender: (item?: AdminTableFragment) => {
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
      getTargetString: (item: AdminTableFragment) => item?.ds ?? '',
      onRender: (item?: AdminTableFragment) => {
        return buildDtnLink(tdifLinkProps, item?.ds);
      },
    },
    {
      key: 'Entered Date',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AdminTableFragment) => item?.insert_dt ?? '',
      onRender: (item?: AdminTableFragment) => {
        return <Text>{formatValidDate(item?.insert_dt)}</Text>;
      },
    },
    {
      key: 'Entered By',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AdminTableFragment) => item?.insert_user ?? '',
      onRender: (item?: AdminTableFragment) => {
        return <Text>{item?.insert_user}</Text>;
      },
    },
    {
      key: 'Updated Date',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AdminTableFragment) => item?.update_dt ?? '',
      onRender: (item?: AdminTableFragment) => {
        return <Text>{formatValidDate(item?.update_dt)}</Text>;
      },
    },
    {
      key: 'Updated By',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: AdminTableFragment) => item?.update_user ?? '',
      onRender: (item?: AdminTableFragment) => {
        return <Text>{item?.update_user}</Text>;
      },
    },
  ];
};

export interface AdminTableProps {
  data: AdminTableFragment[];
  defaultSort: SortState;
}

export default function AdminTable(props: AdminTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const columns = useMemo(() => _buildColumns(links, columnClass), [links, columnClass]);

  return <FilterableTable<AdminTableFragment> items={data} columns={columns} sortState={defaultSort}></FilterableTable>;
}
