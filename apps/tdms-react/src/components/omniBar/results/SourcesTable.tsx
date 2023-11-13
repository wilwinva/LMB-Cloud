import React, { useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { array2String, buildDtnLink, buildDtnLinksFromArray, buildTdifNoLink, getHeaderRowTooltip } from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { SourceTableFragment } from './__generated__/SourceTableFragment';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';

export const SOURCE_TABLE_QUERY = gql`
  fragment SourceTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    data_set_src_tics(where: { src_tic_no: { _is_null: false, _neq: 0 } }) {
      id
      src_tic_no
    }
    data_set_managements(where: { descr: { _neq: "" } }) {
      id
      descr
    }
    data_set_dev_sources(where: { ds: { _neq: "" } }) {
      id
      ds
    }
  }
`;

const _buildColumns = (links: any, classNames: any): ColumnGeneric<SourceTableFragment>[] => {
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: SourceTableFragment) => String(data.tdif_no),
      onRender: (item?: SourceTableFragment) => {
        return buildTdifNoLink(tdifDataSetLinkProps, item?.tdif_no, item?.ds);
      },
    },
    {
      key: 'DTN',
      minWidth: 170,
      maxWidth: 170,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('DTN'),
      isMultiline: true,
      getTargetString: (item: SourceTableFragment) => item?.ds ?? '',
      onRender: (item?: SourceTableFragment) => {
        return buildDtnLink(tdifLinkProps, item?.ds);
      },
    },
    {
      key: 'Source DTN',
      minWidth: 170,
      maxWidth: 170,
      isMultiline: true,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('DTN'),
      getTargetString: (item: SourceTableFragment) => getDevSources(item),
      onRender: (item?: SourceTableFragment) => {
        return <Text>{buildDtnLinksFromArray(item?.data_set_dev_sources || [], 'ds', tdifLinkProps)}</Text>;
      },
    },
    {
      key: 'Source TIC Number',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SourceTableFragment) => getSourceTics(item),
      onRender: (item?: SourceTableFragment) => {
        return <Text>{getSourceTics(item)}</Text>;
      },
    },
    {
      key: 'Other Management Information',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SourceTableFragment) => getManagements(item),
      onRender: (item?: SourceTableFragment) => {
        return <Text>{getManagements(item)}</Text>;
      },
    },
  ];
};
const getDevSources = (item?: SourceTableFragment) => array2String(item?.data_set_dev_sources || [], 'ds');
const getManagements = (item?: SourceTableFragment) => array2String(item?.data_set_managements || [], 'descr');
const getSourceTics = (item?: SourceTableFragment) => array2String(item?.data_set_src_tics || [], 'src_tic_no');

export interface SourceTableProps {
  data: SourceTableFragment[];
  defaultSort: SortState;
}

export default function SourceTable(props: SourceTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const columns = useMemo(() => _buildColumns(links, columnClass), [links, columnClass]);

  return (
    <FilterableTable<SourceTableFragment> items={data} columns={columns} sortState={defaultSort}></FilterableTable>
  );
}
