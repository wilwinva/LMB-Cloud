import React, { useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import {
  array2String,
  buildDataSetTitleLink,
  buildTdifNoLink,
  getDataSetLinkProps,
  getHeaderRowTooltip,
  getQualificationStatus,
} from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { ParametersDialog } from '../../list/dtn/ParameterDialog';
import ListDtnDataParameters, {
  getDtnDataParameterText,
  LIST_DTN_DATA_PARAMETERS_FRAGMENT,
} from '../../list/dtn/ListDtnDataParameters';
import {
  ParametersTableFragment,
  ParametersTableFragment_data_set_parameters_parameter,
} from './__generated__/ParametersTableFragment';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';
import { useParameterDialog } from '../../list/dtn/useDialog';
import { formatValidDate } from '../../helpers/FormatDateTime';
import { TDMS_FILES_FRAGMENT } from '../../helpers/TdmsFilesHelper';

export const PARAMETERS_TABLE_QUERY = gql`
  fragment ParametersTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    qual_flg
    data_set_description {
      id
      descr
    }
    data_set_comments {
      id
      descr
    }
    data_set_title {
      id
      title
    }
    tdif {
      id
      submit_dt
    }
    transfer {
      id
      component
    }
    data_set_tdm_file {
      id
      file_name
      category
    }
    ...ListDtnDataParametersFragment
    ...TdmsFilesFragment
  }
  ${LIST_DTN_DATA_PARAMETERS_FRAGMENT}
  ${TDMS_FILES_FRAGMENT}
`;

type ParameterData = Omit<ParametersTableFragment_data_set_parameters_parameter, '__typename'>;

const _buildColumns = (
  links: any,
  onDefinitionClick: (...args: any[]) => void,
  classNames: any
): ColumnGeneric<ParametersTableFragment>[] => {
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: ParametersTableFragment) => String(data.tdif_no),
      onRender: (item?: ParametersTableFragment) => {
        return buildTdifNoLink(tdifDataSetLinkProps, item?.tdif_no, item?.ds);
      },
    },
    {
      key: 'Qualified',
      minWidth: 130,
      maxWidth: 130,
      className: classNames.dataCells,
      getTargetString: (item: ParametersTableFragment) => getQualificationStatus(item?.qual_flg),
      onRender: (item?: ParametersTableFragment) => {
        return <Text>{getQualificationStatus(item?.qual_flg)}</Text>;
      },
    },
    {
      key: 'TDIF Submittal Date',
      minWidth: 130,
      maxWidth: 130,
      className: classNames.dataCells,
      getTargetString: (item: ParametersTableFragment) => item?.tdif?.submit_dt ?? '',
      onRender: (item?: ParametersTableFragment) => {
        return <Text>{formatValidDate(item?.tdif?.submit_dt)}</Text>;
      },
    },
    {
      key: 'Parameter Name',
      minWidth: 225,
      maxWidth: 225,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: ParametersTableFragment) => getDtnDataParameterText(item.data_set_parameters),
      onRender: (item?: ParametersTableFragment) => {
        return <ListDtnDataParameters data={item?.data_set_parameters} onDefinitionClick={onDefinitionClick} />;
      },
    },
    {
      key: 'Data Set Title',
      minWidth: 225,
      maxWidth: 225,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('Data Set Title'),
      isMultiline: true,
      getTargetString: (item: ParametersTableFragment) => item?.data_set_title?.title ?? '',
      onRender: (item?: ParametersTableFragment) => {
        if (!item) {
          return undefined;
        }

        const dataSetLinkProps = getDataSetLinkProps(item, links);
        const title = item?.data_set_title?.title;

        return dataSetLinkProps ? buildDataSetTitleLink(dataSetLinkProps, item.ds, title) : <Text>{title}</Text>;
      },
    },
    {
      key: 'Data Set Description',
      minWidth: 225,
      maxWidth: 225,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: ParametersTableFragment) => item?.data_set_description?.descr ?? '',
      onRender: (item?: ParametersTableFragment) => {
        return <Text>{item?.data_set_description?.descr}</Text>;
      },
    },
    {
      key: 'Data Set Comments',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: ParametersTableFragment) => getDataSetComments(item),
      onRender: (item?: ParametersTableFragment) => {
        return <Text>{getDataSetComments(item)}</Text>;
      },
    },
  ];
};

const getDataSetComments = (item?: ParametersTableFragment) => array2String(item?.data_set_comments || [], 'descr');

export interface ParametersTableProps {
  data: ParametersTableFragment[];
  defaultSort: SortState;
}

export default function ParametersTable(props: ParametersTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const { isDialogVisible, dialogData, showWithData, hideDialog } = useParameterDialog();

  const columns = useMemo(() => _buildColumns(links, showWithData, columnClass), [links, showWithData, columnClass]);

  return (
    <FilterableTable<ParametersTableFragment> items={data} columns={columns} sortState={defaultSort}>
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </FilterableTable>
  );
}
