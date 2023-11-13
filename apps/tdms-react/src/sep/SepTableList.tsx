import React, { useMemo } from 'react';
import { gql } from '@apollo/client';
import { ColumnGeneric, Table, useBaseStyles } from '@nwm/uifabric';
import { Stack, StackItem, Text } from 'office-ui-fabric-react';
import { flow } from 'lodash/fp';

import {
  SepDtnModelTableFragment,
  SepDtnModelTableFragment_dbsep_table_description as DataSetTableDescription,
} from './__generated__/SepDtnModelTableFragment';
import { TransferComponent } from '../query/Transfer';
import { ParametersDialog } from '../components/list/dtn/ParameterDialog';
import ListDtnDataParameters, { DataParameters } from '../components/list/dtn/ListDtnDataParameters';
import { ReportFileList } from './ReportFileList';
import { useParameterDialog } from '../components/list/dtn/useDialog';
import { getParameterNames } from '../components/omniBar/helpers';
import { getAllTableItems, findTableItems } from '../components/helpers/TdmsFilesHelper';
import {
  SepDtnModelQuery,
  SepDtnModelQuery_db_tdms_data_set_data_set_tdms_files,
} from './__generated__/SepDtnModelQuery';

export const SEP_DTN_MODEL_TABLE_FRAGMENT = gql`
  fragment SepDtnModelTableFragment on query_root {
    dbsep_parameters {
      param_key
      name
      definition
    }
    dbsep_table_description(
      order_by: { table_name: asc }
      where: { submittal_table_link: { submittal_inventory: { ds: { ds: { _eq: $ds } } } } }
    ) {
      table_key
      table_desc
      table_name
      footnotes
      footnotes1: addnl_footnotes {
        addnl_footnotes
      }
      footnotes2: addnl_footnotes2 {
        addnl_footnotes2
      }
      column_descriptions(order_by: { sort_order: asc }, where: { att_key: { _ilike: "P%" } }) {
        att_key
      }
    }
  }
`;

const _buildColumns = (
  onDefinitionClick: (...args: any[]) => void,
  classNames: any,
  transfer: TransferComponent,
  parameterLookups: SepDtnModelTableFragment['dbsep_parameters'],
  files: SepDtnModelQuery_db_tdms_data_set_data_set_tdms_files[]
): ColumnGeneric<DataSetTableDescription>[] => {
  return [
    {
      key: 'Table Name',
      minWidth: 130,
      maxWidth: 130,
      className: classNames.dataCells,
      getTargetString: (data: DataSetTableDescription) => data?.table_name ?? '',
      onRender: (item?: DataSetTableDescription) => {
        return <Text>{item?.table_name}</Text>;
      },
    },
    {
      key: 'Table File',
      minWidth: 180,
      maxWidth: 180,
      className: classNames.dataCells,
      getTargetString: (data: DataSetTableDescription) => data?.table_name ?? '',
      onRender: (item?: DataSetTableDescription) => {
        if (!item) {
          return null;
        }

        const currentTableLinks = flow(getAllTableItems, findTableItems(item.table_name))(files);

        return <ReportFileList files={currentTableLinks} />;
      },
    },
    {
      key: 'Table Description',
      minWidth: 200,
      maxWidth: 500,
      isMultiline: true,
      className: classNames.dataCells,
      getTargetString: (data: DataSetTableDescription) => data?.table_desc ?? '',
      onRender: (item?: DataSetTableDescription) => {
        return <Text>{item?.table_desc}</Text>;
      },
    },
    {
      key: 'Footnotes',
      minWidth: 200,
      maxWidth: 500,
      isMultiline: true,
      className: classNames.dataCells,
      getTargetString: (data: DataSetTableDescription) =>
        `${data?.footnotes}, ${data?.footnotes1?.addnl_footnotes}, ${data?.footnotes2?.addnl_footnotes2}`,
      onRender: (item?: DataSetTableDescription) => {
        return item ? <Footnotes item={item} /> : undefined;
      },
    },
    {
      key: 'Parameter Name',
      minWidth: 200,
      maxWidth: 500,
      isMultiline: true,
      className: classNames.dataCells,
      getTargetString: (data: DataSetTableDescription) => {
        const data_set_parameters = buildParameterList(data?.column_descriptions, parameterLookups);
        return getParameterNames(data_set_parameters) ?? '';
      },
      onRender: (item?: DataSetTableDescription) => {
        if (!item?.column_descriptions) {
          return undefined;
        }
        const data_set_parameters = buildParameterList(item?.column_descriptions, parameterLookups);
        return <ListDtnDataParameters data={data_set_parameters} onDefinitionClick={onDefinitionClick} />;
      },
    },
  ];
};

const buildParameterList = <T extends Function>(
  column_descriptions: DataSetTableDescription['column_descriptions'],
  parameterLookups: SepDtnModelTableFragment['dbsep_parameters']
) => {
  const parameterList = column_descriptions.map((parameterObj) => {
    const pKey = parseInt(parameterObj.att_key.substr(1), 10);
    return parameterLookups.filter((parameter) => {
      return parameter.param_key === pKey;
    });
  });
  return parameterList.map<DataParameters>((pObj) => {
    return {
      __typename: 'db_tdms_data_set_parameter',
      parameter_no: pObj[0].param_key,
      parameter: { __typename: 'db_tdms_parameters', definition: pObj[0].definition, name: pObj[0].name },
    };
  });
};

interface FootNotesProps {
  item: DataSetTableDescription;
}

const Footnotes = ({ item }: FootNotesProps) => {
  return (
    <Stack>
      <StackItem>{item.footnotes}</StackItem>
      {item.footnotes1 ? <StackItem>{item.footnotes1.addnl_footnotes}</StackItem> : undefined}
      {item.footnotes2 ? <StackItem>{item.footnotes2.addnl_footnotes2}</StackItem> : undefined}
    </Stack>
  );
};

export interface SepTableProps {
  data: SepDtnModelQuery;
  transfer: TransferComponent;
}

function SepTableList(props: SepTableProps) {
  const { data, transfer } = props;

  const { columnClass, purpleTableHeader, stackStyles } = useBaseStyles();
  const { isDialogVisible, dialogData, showWithData, hideDialog } = useParameterDialog();

  const columns = useMemo(
    () =>
      _buildColumns(
        showWithData,
        columnClass,
        transfer,
        data.dbsep_parameters,
        data.db_tdms_data_set[0].data_set_tdms_files
      ),
    [showWithData, columnClass, transfer, data.dbsep_parameters, data.db_tdms_data_set]
  );

  const table =
    data.dbsep_table_description.length > 0 ? (
      <Table<DataSetTableDescription>
        items={data.dbsep_table_description}
        columns={columns}
        sortState={{ key: 'Table Name', isSortedDescending: false }}
      />
    ) : (
      <Text>No data files found.</Text>
    );

  return (
    <Stack styles={stackStyles}>
      {table}
      <ParametersDialog {...dialogData} showDialog={isDialogVisible} close={hideDialog} />
    </Stack>
  );
}
export default React.memo(SepTableList);
