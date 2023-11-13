import React, { useMemo } from 'react';
import { ColumnGeneric, FilterableTable, SortState, Table, useBaseStyles } from '@nwm/uifabric';
import { gql } from '@apollo/client';
import { Stack, Text } from 'office-ui-fabric-react';

import { StandardTableFragment } from './__generated__/StandardTableFragment';
import {
  buildDataSetTitleLink,
  buildDtnLink,
  buildTdifNoLink,
  getDataSetLinkProps,
  getHeaderRowTooltip,
  getParameterNames,
} from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { toTransferComponent } from '../../../query/Transfer';
import { ParametersDialog } from '../../list/dtn/ParameterDialog';
import ListDtnDataParameters, { LIST_DTN_DATA_PARAMETERS_FRAGMENT } from '../../list/dtn/ListDtnDataParameters';
import { useParameterDialog } from '../../list/dtn/useDialog';
import {
  buildDownloadLinkList,
  buildMwdSpaDownloadLinkList,
  getMainItem,
  TDMS_FILES_FRAGMENT,
} from '../../helpers/TdmsFilesHelper';
import { Loading } from '@nwm/util';

export const STANDARD_TABLE_QUERY = gql`
  fragment StandardTableFragment on db_tdms_data_set {
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
    ...TdmsFilesFragment
    ...ListDtnDataParametersFragment
  }
  ${LIST_DTN_DATA_PARAMETERS_FRAGMENT}
  ${TDMS_FILES_FRAGMENT}
`;

const _buildColumns = (
  links: any,
  onDefinitionClick: (...args: any[]) => void,
  classNames: any
): ColumnGeneric<StandardTableFragment>[] => {
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;
  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: StandardTableFragment) => String(data.tdif_no),
      onRender: (item?: StandardTableFragment) => {
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
      getTargetString: (data: StandardTableFragment) => data.ds ?? '',
      onRender: (item?: StandardTableFragment) => {
        return buildDtnLink(tdifLinkProps, item?.ds);
      },
    },
    {
      key: 'Component',
      minWidth: 80,
      maxWidth: 80,
      className: classNames.dataCells,
      getTargetString: (data: StandardTableFragment) => data?.transfer?.component ?? '',
      onRender: (item?: StandardTableFragment) => {
        return <Text>{item?.transfer?.component ?? ''}</Text>;
      },
    },
    {
      key: 'Data File',
      minWidth: 200,
      maxWidth: 200,
      className: classNames.dataCells,
      isMultiline: true,
      ariaLabel: getHeaderRowTooltip('Data File'),
      getTargetString: (data: StandardTableFragment) => getDataFileName(data) ?? '',
      onRender: (item?: StandardTableFragment) => {
        const transfer = item?.transfer?.component.toUpperCase();
        const mainFile = getMainItem(item?.data_set_tdms_files);

        if (transfer === 'SPA' || transfer === 'MWD') {
          return <>{buildMwdSpaDownloadLinkList(mainFile)}</>;
        }

        return <>{buildDownloadLinkList(mainFile)}</>;
      },
    },
    {
      key: 'Data Set Title',
      minWidth: 300,
      maxWidth: 500,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('Data Set Title'),
      isMultiline: true,
      getTargetString: (data: StandardTableFragment) => data.data_set_title?.title ?? '',
      onRender: (item?: StandardTableFragment) => {
        if (!item) {
          return undefined;
        }
        const dataSetLinkProps = getDataSetLinkProps(item, links);
        const title = item?.data_set_title?.title;
        return dataSetLinkProps ? buildDataSetTitleLink(dataSetLinkProps, item.ds, title) : <Text>{title}</Text>;
      },
    },
    {
      key: 'Parameter Name',
      minWidth: 300,
      maxWidth: 500,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (data: StandardTableFragment) => getParameterNames(data.data_set_parameters) ?? '',
      onRender: (item?: StandardTableFragment) => {
        return <ListDtnDataParameters data={item?.data_set_parameters} onDefinitionClick={onDefinitionClick} />;
      },
    },
  ];
};

export interface StandardTableProps {
  data: StandardTableFragment[];
  defaultSort: SortState;
}

export default function StandardTable(props: StandardTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { isDialogVisible, dialogData, showWithData, hideDialog } = useParameterDialog();

  const { columnClass, stackStyles } = useBaseStyles();
  const columns = useMemo(() => _buildColumns(links, showWithData, columnClass), [links, showWithData, columnClass]);

  const BasicTable = (
    <Stack styles={stackStyles}>
      <Table<StandardTableFragment> items={data} columns={columns} sortState={defaultSort} />
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </Stack>
  );

  return data?.length === 1 ? (
    BasicTable
  ) : (
    <FilterableTable<StandardTableFragment> items={data} columns={columns} sortState={defaultSort}>
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </FilterableTable>
  );
}

interface DataLinkProps {
  item: StandardTableFragment | undefined;
}

const getDataFileName = ({ ds, transfer, data_set_tdms_files }: StandardTableFragment) => {
  const _transfer = toTransferComponent(transfer?.component ?? 'INPROCESS');
  const archiveData = getMainItem(data_set_tdms_files)[0];

  if (_transfer && _transfer === 'SEP' && !archiveData) {
    return `No original native file. See table files.`;
  }
  const _fileName = _transfer === 'SEP' ? archiveData?.file_name : ds;
  const hasLink = _fileName && _transfer;

  return hasLink ? _fileName : ds;
};
