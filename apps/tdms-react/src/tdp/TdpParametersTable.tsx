import React, { useMemo } from 'react';
import { IColumn, Text } from 'office-ui-fabric-react';
import { gql, useQuery } from '@apollo/client';
import {
  TdpParametersTableQuery,
  TdpParametersTableQuery_db_tdms_parameters,
} from './__generated__/TdpParametersTableQuery';
import { ColumnGeneric, FilterableTable, PageWithIntro, useBaseStyles } from '@nwm/uifabric';
import { Loading } from '@nwm/util';
import withTextBoundryError from '../components/error/TextBoundryError';

export const TDP_PARAMETERS_TABLE_QUERY = gql`
  query TdpParametersTableQuery {
    db_tdms_parameters(where: { name: { _neq: "" } }, distinct_on: name) {
      id
      name
      definition
      param_key
    }
  }
`;

const _buildColumns = (classNames: any): ColumnGeneric<TdpParametersTableQuery_db_tdms_parameters>[] => {
  return [
    {
      key: 'Parameter Name',
      minWidth: 400,
      maxWidth: 400,
      className: classNames.dataCells,
      getTargetString: (data: TdpParametersTableQuery_db_tdms_parameters) => data?.name ?? '',
      onRender: (item?: TdpParametersTableQuery_db_tdms_parameters, index?: number, column?: IColumn) => {
        return <Text>{item?.name}</Text>;
      },
    },
    {
      key: 'Definition',
      minWidth: 1000,
      maxWidth: 1000,
      className: classNames.dataCells,
      isMultiline: true,
      getTargetString: (data: TdpParametersTableQuery_db_tdms_parameters) => data.definition ?? '',
      onRender: (item?: TdpParametersTableQuery_db_tdms_parameters, index?: number, column?: IColumn) => {
        return <Text>{item?.definition}</Text>;
      },
    },
    {
      key: 'Parameter Key',
      minWidth: 100,
      maxWidth: 100,
      className: classNames.dataCells,
      getTargetString: (data: TdpParametersTableQuery_db_tdms_parameters) => String(data.param_key),
      onRender: (item?: TdpParametersTableQuery_db_tdms_parameters, index?: number, column?: IColumn) => {
        return <Text>{item?.param_key}</Text>;
      },
    },
  ];
};

export interface TdpParametersProps {}

export function TdpParametersComponent(props: TdpParametersProps) {
  const defaultSort = { key: 'Parameter Name', isSortedDescending: true };

  const { columnClass } = useBaseStyles();
  const columns = useMemo(() => _buildColumns(columnClass), [columnClass]);

  const { loading, error, data } = useQuery<TdpParametersTableQuery>(TDP_PARAMETERS_TABLE_QUERY);

  if (error !== undefined) {
    throw buildError(error);
  }

  if (loading || data === undefined) {
    return <Loading />;
  }
  const parameters = data.db_tdms_parameters;
  return (
    <PageWithIntro title="Technical Data Parameter Dictionary: Parameter List">
      <FilterableTable<TdpParametersTableQuery_db_tdms_parameters>
        items={parameters}
        columns={columns}
        sortState={defaultSort}
      />
    </PageWithIntro>
  );
}

const { ErrorBoundry, buildError } = withTextBoundryError<TdpParametersProps>(
  TdpParametersComponent,
  'Failed to fetch TDP Keyword with error'
);
export default ErrorBoundry;
