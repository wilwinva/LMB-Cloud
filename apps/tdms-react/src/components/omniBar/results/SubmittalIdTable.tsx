import React, { useMemo } from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { array2String, buildDtnLinksFromArray, buildName, buildTdifNoLink, getHeaderRowTooltip } from '../helpers';
import useLinks from '../../../hooks/links/useLinks';
import { SubmittalIdTableFragment } from './__generated__/SubmittalIdTableFragment';
import { ColumnGeneric, FilterableTable, SortState, useBaseStyles } from '@nwm/uifabric';
import { useParameterDialog } from '../../list/dtn/useDialog';
import ListDtnDataParameters, {
  getDtnDataParameterText,
  LIST_DTN_DATA_PARAMETERS_FRAGMENT,
} from '../../list/dtn/ListDtnDataParameters';
import { ParametersDialog } from '../../list/dtn/ParameterDialog';

export const SUBMITTALID_TABLE_QUERY = gql`
  fragment SubmittalIdTableFragment on db_tdms_data_set {
    id
    tdif_no
    ds
    rpt
    pi_last_nm
    pi_first_nm
    pi_middle_nm
    pi_org
    tdif {
      id
      qced_flg
      qced_dt
      submit_dt
      preparer_first_nm
      preparer_last_nm
      preparer_middle_nm
      preparer_org
    }
    data_set_superseded_bies(where: { superseded_by_dtn: { _neq: "" } }) {
      id
      superseded_by_dtn
    }
    data_set_supersedes(where: { supersedes_dtn: { _neq: "" } }) {
      id
      supersedes_dtn
    }
    data_set_wbs(where: { wbs_no: { _neq: "" } }) {
      id
      wbs_no
    }
    ...ListDtnDataParametersFragment
  }
  ${LIST_DTN_DATA_PARAMETERS_FRAGMENT}
`;

const _buildColumns = (
  links: any,
  onDefinitionClick: any,
  classNames: any
): ColumnGeneric<SubmittalIdTableFragment>[] => {
  const tdifLinkProps = links.atdt.tdif.globalTextLinkProps;
  const tdifDataSetLinkProps = links.atdt.dataset_metadata.globalTextLinkProps;

  return [
    {
      key: 'TDIF No',
      minWidth: 70,
      maxWidth: 70,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('TDIF No'),
      getTargetString: (data: SubmittalIdTableFragment) => String(data.tdif_no),
      onRender: (item?: SubmittalIdTableFragment) => {
        return buildTdifNoLink(tdifDataSetLinkProps, item?.tdif_no, item?.ds);
      },
    },
    {
      key: 'TDIF Preparer',
      minWidth: 100,
      maxWidth: 100,
      className: classNames.dataCells,
      getTargetString: (item: SubmittalIdTableFragment) => getTDIFName(item),
      onRender: (item?: SubmittalIdTableFragment) => {
        return <Text>{getTDIFName(item)}</Text>;
      },
    },
    {
      key: 'TDIF Preparer Org',
      minWidth: 130,
      maxWidth: 130,
      isMultiline: true,
      className: classNames.dataCells,
      getTargetString: (item: SubmittalIdTableFragment) => item?.tdif?.preparer_org ?? '',
      onRender: (item?: SubmittalIdTableFragment) => {
        return <Text>{item?.tdif?.preparer_org}</Text>;
      },
    },
    {
      key: 'Originator/Preparer',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SubmittalIdTableFragment) => getPIName(item),
      onRender: (item?: SubmittalIdTableFragment) => {
        return <Text>{getPIName(item)}</Text>;
      },
    },
    {
      key: 'Originator/Preparer Org',
      minWidth: 155,
      maxWidth: 155,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SubmittalIdTableFragment) => item?.pi_org ?? '',
      onRender: (item?: SubmittalIdTableFragment) => {
        return <Text>{item?.pi_org}</Text>;
      },
    },
    {
      key: 'Parameter Name',
      minWidth: 140,
      maxWidth: 140,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SubmittalIdTableFragment) => getDtnDataParameterText(item.data_set_parameters),
      onRender: (item?: SubmittalIdTableFragment) => {
        return <ListDtnDataParameters data={item?.data_set_parameters} onDefinitionClick={onDefinitionClick} />;
      },
    },
    {
      key: 'WBS Number',
      minWidth: 100,
      maxWidth: 100,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SubmittalIdTableFragment) => getWBS(item),
      onRender: (item?: SubmittalIdTableFragment) => {
        return <Text>{getWBS(item)}</Text>;
      },
    },
    {
      key: 'Superseded by DTN',
      minWidth: 170,
      maxWidth: 170,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('DTN'),
      isMultiline: true,
      getTargetString: (item: SubmittalIdTableFragment) => getSupersededBies(item),
      onRender: (item?: SubmittalIdTableFragment) => {
        return (
          <Text>
            {buildDtnLinksFromArray(item?.data_set_superseded_bies || [], 'superseded_by_dtn', tdifLinkProps)}
          </Text>
        );
      },
    },
    {
      key: 'Supersedes DTN',
      minWidth: 170,
      maxWidth: 170,
      className: classNames.dataCells,
      ariaLabel: getHeaderRowTooltip('DTN'),
      isMultiline: true,
      getTargetString: (item: SubmittalIdTableFragment) => getSupersedes(item),
      onRender: (item?: SubmittalIdTableFragment) => {
        return <Text>{buildDtnLinksFromArray(item?.data_set_supersedes || [], 'supersedes_dtn', tdifLinkProps)}</Text>;
      },
    },
    {
      key: 'Report No',
      minWidth: 110,
      maxWidth: 110,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (item: SubmittalIdTableFragment) => item?.rpt ?? '',
      onRender: (item?: SubmittalIdTableFragment) => {
        return <Text>{item?.rpt}</Text>;
      },
    },
  ];
};

const getPIName = (item?: SubmittalIdTableFragment) =>
  buildName(item?.pi_last_nm, item?.pi_first_nm, item?.pi_middle_nm);
const getTDIFName = (item?: SubmittalIdTableFragment) =>
  buildName(item?.tdif?.preparer_last_nm, item?.tdif?.preparer_first_nm, item?.tdif?.preparer_middle_nm);
const getWBS = (item?: SubmittalIdTableFragment) => array2String(item?.data_set_wbs || [], 'wbs_no');
const getSupersededBies = (item?: SubmittalIdTableFragment) =>
  array2String(item?.data_set_superseded_bies || [], 'superseded_by_dtn');
const getSupersedes = (item?: SubmittalIdTableFragment) =>
  array2String(item?.data_set_supersedes || [], 'supersedes_dtn');

export interface SubmittalIdTableProps {
  data: SubmittalIdTableFragment[];
  defaultSort: SortState;
}

export default function SubmittalIdTable(props: SubmittalIdTableProps) {
  const { data, defaultSort } = props;

  const links = useLinks();

  const { columnClass } = useBaseStyles();

  const { isDialogVisible, dialogData, showWithData, hideDialog } = useParameterDialog();

  const columns = useMemo(() => _buildColumns(links, showWithData, columnClass), [links, showWithData, columnClass]);

  return (
    <FilterableTable<SubmittalIdTableFragment> items={data} columns={columns} sortState={defaultSort}>
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </FilterableTable>
  );
}
