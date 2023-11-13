import React, { useMemo } from 'react';
import { IColumn, Text } from 'office-ui-fabric-react';
import { gql, useQuery } from '@apollo/client';
import {
  TdpKeywordTableQuery,
  TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union,
  TdpKeywordTableQueryVariables,
} from './__generated__/TdpKeywordTableQuery';
import { ColumnGeneric, FilterableTable, PageWithIntro, useBaseStyles } from '@nwm/uifabric';
import { Loading } from '@nwm/util';
import { useParamsEncoded } from '@nwm/react-hooks';
import withTextBoundryError from '../components/error/TextBoundryError';

export const TDP_KEYWORD_TABLE_QUERY = gql`
  query TdpKeywordTableQuery($search: String) {
    db_tdms_view_tdp_keyword_union(
      where: { _or: [{ name: { _ilike: $search } }, { definition: { _ilike: $search } }] }
    ) {
      name
      key
      definition
      type
    }
  }
`;

const _buildColumns = (classNames: any): ColumnGeneric<TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union>[] => {
  return [
    {
      key: 'Name',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union) => data?.name ?? '',
      onRender: (item?: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union, index?: number, column?: IColumn) => {
        return <Text>{item?.name}</Text>;
      },
    },
    {
      key: 'Definition',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union) => data.definition ?? '',
      onRender: (item?: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union, index?: number, column?: IColumn) => {
        return <Text>{item?.definition}</Text>;
      },
    },
    {
      key: 'Key',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union) => data.key ?? '',
      onRender: (item?: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union, index?: number, column?: IColumn) => {
        return <Text>{item?.key}</Text>;
      },
    },
    {
      key: 'Type',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union) => data?.type ?? '',
      onRender: (item?: TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union, index?: number, column?: IColumn) => {
        const type = item?.type ?? '';
        return <Text>{getType(type)}</Text>;
      },
    },
  ];
};

const getType = (type: string | undefined) => {
  switch (type) {
    case 'A':
      return 'Alias';
    case 'C':
      return 'Attribute - Conditions';
    case 'L':
      return 'Attribute - Locations';
    case 'M':
      return 'Attribute - Materials';
    case 'T':
      return 'Attribute - Types';
    default:
      return 'Parameter';
  }
};

export interface TdpKeywordProps {}

export function TdpKeywordComponent(props: TdpKeywordProps) {
  const [keyword] = useParamsEncoded();
  const defaultSort = { key: 'Name', isSortedDescending: true };

  const { columnClass } = useBaseStyles();
  const columns = useMemo(() => _buildColumns(columnClass), [columnClass]);

  //  const { loading, error, data } = useQuery<TdpKeywordTableQuery>(TDP_KEYWORD_TABLE_QUERY);
  const { loading, error, data } = useQuery<TdpKeywordTableQuery, TdpKeywordTableQueryVariables>(
    TDP_KEYWORD_TABLE_QUERY,
    {
      variables: { search: `${keyword}%` },
    }
  );

  if (error !== undefined) {
    throw buildError(error);
  }

  if (loading || data === undefined) {
    return <Loading />;
  }
  const tdp_keyword_union = data.db_tdms_view_tdp_keyword_union;
  return (
    <PageWithIntro title={`Technical Data Parameter Dictionary by Keyword: ${keyword}`}>
      <FilterableTable<TdpKeywordTableQuery_db_tdms_view_tdp_keyword_union>
        items={tdp_keyword_union}
        columns={columns}
        sortState={defaultSort}
      />
    </PageWithIntro>
  );
}

const { ErrorBoundry, buildError } = withTextBoundryError<TdpKeywordProps>(
  TdpKeywordComponent,
  'Failed to fetch TDP Keyword with error'
);
export default ErrorBoundry;
