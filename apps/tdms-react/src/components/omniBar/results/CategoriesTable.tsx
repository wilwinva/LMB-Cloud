import React, { useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import {
  array2String,
  buildDtnLink,
  buildDtnLinksFromArray,
  buildName,
  buildTdifNoLink,
  getHeaderRowTooltip,
} from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { ParametersDialog } from '../../list/dtn/ParameterDialog';
import ListDtnDataParameters, {
  getDtnDataParameterText,
  LIST_DTN_DATA_PARAMETERS_FRAGMENT,
} from '../../list/dtn/ListDtnDataParameters';
import {
  CategoriesTableFragment,
  CategoriesTableFragment_data_set_parameters_parameter,
} from './__generated__/CategoriesTableFragment';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';
import { useParameterDialog } from '../../list/dtn/useDialog';

export const CATEGORIES_TABLE_QUERY = gql`
  fragment CategoriesTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    pi_last_nm
    pi_first_nm
    pi_middle_nm
    transfer {
      component
    }
    data_set_activities(where: { act: { _neq: "" } }) {
      id
      act
    }
    data_set_dev_sources(where: { ds: { _neq: "" } }) {
      id
      ds
    }
    data_set_records {
      id
      accn
      pkg_id
    }
    ...ListDtnDataParametersFragment
  }
  ${LIST_DTN_DATA_PARAMETERS_FRAGMENT}
`;

type ParameterData = Omit<CategoriesTableFragment_data_set_parameters_parameter, '__typename'>;

const _buildColumns = (
  links: any,
  onDefinitionClick: (...args: any[]) => void,
  classNames: any
): ColumnGeneric<CategoriesTableFragment>[] => {
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: CategoriesTableFragment) => String(data.tdif_no),
      onRender: (item?: CategoriesTableFragment) => {
        return buildTdifNoLink(tdifDataSetLinkProps, item?.tdif_no, item?.ds);
      },
    },
    {
      key: 'DTN',
      minWidth: 130,
      maxWidth: 130,
      className: classNames.dataCells,
      isMultiline: true,
      ariaLabel: getHeaderRowTooltip('DTN'),
      getTargetString: (item: CategoriesTableFragment) => item?.ds ?? '',
      onRender: (item?: CategoriesTableFragment) => {
        return buildDtnLink(tdifLinkProps, item?.ds);
      },
    },
    {
      key: 'Parameter Name',
      minWidth: 300,
      maxWidth: 400,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: CategoriesTableFragment) => getDtnDataParameterText(item.data_set_parameters),
      onRender: (item?: CategoriesTableFragment) => {
        return <ListDtnDataParameters data={item?.data_set_parameters} onDefinitionClick={onDefinitionClick} />;
      },
    },
    {
      key: 'PI Names',
      minWidth: 100,
      maxWidth: 100,
      className: classNames.dataCells,
      getTargetString: (item: CategoriesTableFragment) => getPIName(item),
      onRender: (item?: CategoriesTableFragment) => {
        return <Text>{getPIName(item)}</Text>;
      },
    },
    {
      key: 'SCP Activity',
      minWidth: 100,
      maxWidth: 100,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: CategoriesTableFragment) => getSCP(item),
      onRender: (item?: CategoriesTableFragment) => {
        return <Text>{getSCP(item)}</Text>;
      },
    },
    {
      key: 'Source DTNs',
      minWidth: 170,
      maxWidth: 170,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('DTN'),
      isMultiline: true,
      getTargetString: (item: CategoriesTableFragment) => array2String(item?.data_set_dev_sources || [], 'ds'),
      onRender: (item?: CategoriesTableFragment) => {
        return <Text>{buildDtnLinksFromArray(item?.data_set_dev_sources || [], 'ds', tdifLinkProps)}</Text>;
      },
    },
    {
      key: 'Accession #',
      minWidth: 130,
      maxWidth: 130,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: CategoriesTableFragment) => getAccn(item),
      onRender: (item?: CategoriesTableFragment) => {
        return <Text>{getAccn(item)}</Text>;
      },
    },
    {
      key: 'Package IDs',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: CategoriesTableFragment) => getPkgId(item),
      onRender: (item?: CategoriesTableFragment) => {
        return <Text>{getPkgId(item)}</Text>;
      },
    },
  ];
};

const getPIName = (item?: CategoriesTableFragment) =>
  buildName(item?.pi_last_nm, item?.pi_first_nm, item?.pi_middle_nm);
const getSCP = (item?: CategoriesTableFragment) => array2String(item?.data_set_activities || [], 'act');
const getAccn = (item?: CategoriesTableFragment) => array2String(item?.data_set_records || [], 'accn');
const getPkgId = (item?: CategoriesTableFragment) => array2String(item?.data_set_records || [], 'pkg_id');

export interface CategoriesTableProps {
  data: CategoriesTableFragment[];
  defaultSort: SortState;
}

export default function CategoriesTable(props: CategoriesTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const { isDialogVisible, dialogData, showWithData, hideDialog } = useParameterDialog();

  const columns = useMemo(() => _buildColumns(links, showWithData, columnClass), [links, showWithData, columnClass]);

  return (
    <FilterableTable<CategoriesTableFragment> items={data} columns={columns} sortState={defaultSort}>
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </FilterableTable>
  );
}
