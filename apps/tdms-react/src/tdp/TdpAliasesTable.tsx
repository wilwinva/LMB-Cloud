import React, { useMemo } from 'react';
import { IColumn, Text } from 'office-ui-fabric-react';
import { gql, useQuery } from '@apollo/client';
import { TdpAliasesTableQuery, TdpAliasesTableQuery_db_tdms_aliases } from './__generated__/TdpAliasesTableQuery';
import { ColumnGeneric, FilterableTable, PageWithIntro, useBaseStyles } from '@nwm/uifabric';
import { Loading } from '@nwm/util';
import withTextBoundryError from '../components/error/TextBoundryError';

export const TDP_ALIASES_TABLE_QUERY = gql`
  query TdpAliasesTableQuery {
    db_tdms_aliases(where: { alias: { _neq: "" } }, distinct_on: alias) {
      id
      alias
      parameter {
        id
        name
      }
    }
  }
`;

const _buildColumns = (classNames: any): ColumnGeneric<TdpAliasesTableQuery_db_tdms_aliases>[] => {
  return [
    {
      key: 'Alias',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpAliasesTableQuery_db_tdms_aliases) => data?.alias ?? '',
      onRender: (item?: TdpAliasesTableQuery_db_tdms_aliases, index?: number, column?: IColumn) => {
        return <Text>{item?.alias}</Text>;
      },
    },
    {
      key: 'Parameter Name',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpAliasesTableQuery_db_tdms_aliases) => data.parameter?.name ?? '',
      onRender: (item?: TdpAliasesTableQuery_db_tdms_aliases, index?: number, column?: IColumn) => {
        return <Text>{item?.parameter?.name}</Text>;
      },
    },
  ];
};

export interface TdpAliasesProps {}

export function TdpAliasesComponent(props: TdpAliasesProps) {
  const defaultSort = { key: 'Alias', isSortedDescending: true };

  const { columnClass } = useBaseStyles();
  const columns = useMemo(() => _buildColumns(columnClass), [columnClass]);

  const { loading, error, data } = useQuery<TdpAliasesTableQuery>(TDP_ALIASES_TABLE_QUERY);

  if (error !== undefined) {
    throw buildError(error);
  }

  if (loading || data === undefined) {
    return <Loading />;
  }
  const aliases = data.db_tdms_aliases;
  return (
    <PageWithIntro title="Technical Data Parameter Dictionary: Aliases List">
      <FilterableTable<TdpAliasesTableQuery_db_tdms_aliases>
        items={aliases}
        columns={columns}
        sortState={defaultSort}
      />
    </PageWithIntro>
  );
}

const { ErrorBoundry, buildError } = withTextBoundryError<TdpAliasesProps>(
  TdpAliasesComponent,
  'Failed to fetch TDP Aliases with error'
);
export default ErrorBoundry;
