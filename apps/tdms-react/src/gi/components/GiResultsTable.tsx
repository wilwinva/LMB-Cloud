import React, { useMemo } from 'react';
import { Stack } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ColumnGeneric, FilterableTable, PageWithIntro, SortState, Table, useBaseStyles } from '@nwm/uifabric';

import { ParametersDialog } from '../../components/list/dtn/ParameterDialog';
import { GiResultsTableFragment } from './__generated__/GiResultsTableFragment';
import { buildDtnLink } from '../../components/omniBar/helpers';
import ListDtnDataParameters, {
  getDtnDataParameterText,
  LIST_DTN_DATA_PARAMETERS_FRAGMENT,
} from '../../components/list/dtn/ListDtnDataParameters';
import useLinks from '../../hooks/links/useLinks';
import { useParameterDialog } from '../../components/list/dtn/useDialog';
import { TDMS_FILES_FRAGMENT, buildDownloadLinkList } from '../../components/helpers/TdmsFilesHelper';

export const GI_RESULTS_TABLE_FRAGMENT = gql`
  fragment GiResultsTableFragment on db_tdms_data_set {
    id
    ds
    tdif_no
    transfer {
      id
      component
    }
    data_set_title {
      id
      title
    }
    data_set_gis {
      id
      gis_type
      gis_descr
      product_name
      file_name
      sub_dir
    }
    data_set_tdm_file {
      id
      file_name
      category
      file_type
    }
    ...TdmsFilesFragment
    ...ListDtnDataParametersFragment
  }
  ${TDMS_FILES_FRAGMENT}
  ${LIST_DTN_DATA_PARAMETERS_FRAGMENT}
`;

const _buildColumns = (
  links: any,
  onDefinitionClick: (...args: any[]) => void,
  classNames: any
): ColumnGeneric<GiResultsTableFragment>[] => {
  return [
    {
      key: 'DTN',
      minWidth: 130,
      maxWidth: 130,
      className: classNames.dataCells,
      getTargetString: (data: GiResultsTableFragment) => data.ds ?? '',
      onRender: (item?: GiResultsTableFragment) => {
        const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
        return buildDtnLink(tdifLinkProps, item?.ds);
      },
    },
    {
      key: 'Data File',
      minWidth: 180,
      maxWidth: 180,
      className: classNames.dataCells,
      getTargetString: (data: GiResultsTableFragment) => getFileName(data),
      onRender: (item?: GiResultsTableFragment) => {
        return <>{buildDownloadLinkList(item?.data_set_tdms_files)}</>;
      },
    },
    {
      key: 'Data Set Title',
      minWidth: 500,
      maxWidth: 500,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (data: GiResultsTableFragment) => getTitle(data) ?? '',
      onRender: (item?: GiResultsTableFragment) => buildDtnModelLink(links, item),
    },
    {
      key: 'Parameter Name',
      minWidth: 500,
      maxWidth: 500,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (data: GiResultsTableFragment) => getDtnDataParameterText(data.data_set_parameters) ?? '',
      onRender: (item?: GiResultsTableFragment) => {
        return <ListDtnDataParameters data={item?.data_set_parameters} onDefinitionClick={onDefinitionClick} />;
      },
    },
  ];
};

const getFileName = (item?: GiResultsTableFragment) =>
  item?.data_set_gis?.file_name ? item.data_set_gis.product_name || item.data_set_gis.file_name : '';

const getTitle = (item?: GiResultsTableFragment) => {
  return item?.data_set_gis?.gis_descr ?? item?.data_set_title?.title;
};

const buildDtnModelLink = (links: any, item?: GiResultsTableFragment) => {
  if (!item) {
    return undefined;
  }
  const title = getTitle(item);
  const to = links.gis.dtnModel.globalTextLinkProps({ tdifId: item.ds }).to;
  return <Link to={to}>{title}</Link>;
};

export interface GiResultsTableProps {
  data: GiResultsTableFragment[];
  defaultSort: SortState;
  title: string;
}

export default function GiResultsTable({ data, defaultSort, title }: GiResultsTableProps) {
  const links = useLinks();

  const { isDialogVisible, dialogData, showWithData, hideDialog } = useParameterDialog();

  const { columnClass, purpleTableHeader } = useBaseStyles();
  const columns = useMemo(() => _buildColumns(links, showWithData, columnClass), [links, showWithData, columnClass]);

  const BasicTable = (
    <Stack styles={{ root: purpleTableHeader }}>
      <Table<GiResultsTableFragment> items={data} columns={columns} sortState={defaultSort} />
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </Stack>
  );

  const filteredTable = (
    <FilterableTable<GiResultsTableFragment> items={data} columns={columns} sortState={defaultSort}>
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </FilterableTable>
  );

  return (
    <PageWithIntro title={title}>
      <Link to="/atdt">Search the Automated Technical Data Tracking System (ATDT)</Link>
      {data?.length === 1 ? BasicTable : filteredTable}
    </PageWithIntro>
  );
}
