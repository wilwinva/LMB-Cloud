import React, { useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { array2String, buildDataSetTitleLink, buildTdifNoLink, getHeaderRowTooltip } from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { SubmittalTextTableFragment } from './__generated__/SubmittalTextTableFragment';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';
import { toTransferComponent } from '../../../query/Transfer';

export const SUBMITTAL_TEXT_TABLE_QUERY = gql`
  fragment SubmittalTextTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    transfer {
      id
      component
    }
    data_set_title {
      id
      title
    }
    data_set_description {
      id
      descr
    }
    data_set_comments {
      id
      descr
    }
  }
`;

const _buildColumns = (links: any, classNames: any): ColumnGeneric<SubmittalTextTableFragment>[] => {
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: SubmittalTextTableFragment) => String(data.tdif_no),
      onRender: (item?: SubmittalTextTableFragment) => {
        return buildTdifNoLink(tdifDataSetLinkProps, item?.tdif_no, item?.ds);
      },
    },
    {
      key: 'Data Set Title',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('Data Set Title'),
      isMultiline: true,
      getTargetString: (item: SubmittalTextTableFragment) => item?.data_set_title?.title ?? '',
      onRender: (item?: SubmittalTextTableFragment) => {
        const dataSetLinkProps = getDataSetLinkProps(item, links);
        const title = item?.data_set_title?.title ?? '';
        return dataSetLinkProps ? buildDataSetTitleLink(dataSetLinkProps, item?.ds, title) : <Text>{title}</Text>;
      },
    },
    {
      key: 'Data Set Description',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SubmittalTextTableFragment) => item?.data_set_description?.descr ?? '',
      onRender: (item?: SubmittalTextTableFragment) => {
        return <Text>{item?.data_set_description?.descr}</Text>;
      },
    },
    {
      key: 'Data Set Comments',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SubmittalTextTableFragment) => getComments(item),
      onRender: (item?: SubmittalTextTableFragment) => {
        return <Text>{getComments(item)}</Text>;
      },
    },
  ];
};

const getComments = (item?: SubmittalTextTableFragment) => array2String(item?.data_set_comments || [], 'descr');

const getDataSetLinkProps = (data: SubmittalTextTableFragment | undefined, links: any) => {
  const app = toTransferComponent(data?.transfer?.component)?.toLowerCase();
  return app ? links[app]?.dtnModel.globalTextLinkProps : undefined;
};

export interface SubmittalTextTableProps {
  data: SubmittalTextTableFragment[];
  defaultSort: SortState;
}

export default function SubmittalTextTable(props: SubmittalTextTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const columns = useMemo(() => _buildColumns(links, columnClass), [links, columnClass]);

  return (
    <FilterableTable<SubmittalTextTableFragment>
      items={data}
      columns={columns}
      sortState={defaultSort}
    ></FilterableTable>
  );
}
