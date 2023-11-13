import React, { useMemo } from 'react';
import { IColumn, Text } from 'office-ui-fabric-react';
import { gql, useQuery } from '@apollo/client';
import { TdpAttributesTableQuery, TdpAttributesTableQuery_db_tdms_atts } from './__generated__/TdpAttributesTableQuery';
import { ColumnGeneric, FilterableTable, PageWithIntro, useBaseStyles } from '@nwm/uifabric';
import { Loading } from '@nwm/util';
import withTextBoundryError from '../components/error/TextBoundryError';

export const TDP_ATTRIBUTES_TABLE_QUERY = gql`
  query TdpAttributesTableQuery {
    db_tdms_atts(where: { att_dscr: { _neq: "" } }, distinct_on: att_dscr) {
      id
      att_dscr
      att_key
    }
  }
`;

const _buildColumns = (classNames: any): ColumnGeneric<TdpAttributesTableQuery_db_tdms_atts>[] => {
  return [
    {
      key: 'Attribute Name',
      minWidth: 500,
      maxWidth: 500,
      className: classNames.dataCells,
      getTargetString: (data: TdpAttributesTableQuery_db_tdms_atts) => data?.att_dscr ?? '',
      onRender: (item?: TdpAttributesTableQuery_db_tdms_atts, index?: number, column?: IColumn) => {
        return <Text>{item?.att_dscr}</Text>;
      },
    },
    {
      key: 'Key',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpAttributesTableQuery_db_tdms_atts) => data.att_key ?? '',
      onRender: (item?: TdpAttributesTableQuery_db_tdms_atts, index?: number, column?: IColumn) => {
        return <Text>{item?.att_key}</Text>;
      },
    },
    {
      key: 'Table',
      minWidth: 300,
      maxWidth: 300,
      className: classNames.dataCells,
      getTargetString: (data: TdpAttributesTableQuery_db_tdms_atts) => tableName(data.att_key),
      onRender: (item?: TdpAttributesTableQuery_db_tdms_atts, index?: number, column?: IColumn) => {
        return <Text>{tableName(item?.att_key)}</Text>;
      },
    },
  ];
};

const tableName = (attKey: string | undefined) => {
  const key = attKey?.charAt(0).toLowerCase();
  switch (key) {
    case 'p':
      return 'Parameters';
    case 'm':
      return 'Materials';
    case 'c':
      return 'Conditions';
    case 't':
      return 'Types';
    case 'l':
      return 'Locations';
    default:
      return '';
  }
};

export interface TdpAttributesProps {}

export function TdpAttributesComponent(props: TdpAttributesProps) {
  const defaultSort = { key: 'Attribute Name', isSortedDescending: true };

  const { columnClass } = useBaseStyles();
  const columns = useMemo(() => _buildColumns(columnClass), [columnClass]);

  const { loading, error, data } = useQuery<TdpAttributesTableQuery>(TDP_ATTRIBUTES_TABLE_QUERY);

  if (error !== undefined) {
    throw buildError(error);
  }

  if (loading || data === undefined) {
    return <Loading />;
  }
  const atts = data.db_tdms_atts;
  return (
    <PageWithIntro title="Technical Data Parameter Dictionary: Attribute List">
      <FilterableTable<TdpAttributesTableQuery_db_tdms_atts> items={atts} columns={columns} sortState={defaultSort} />
    </PageWithIntro>
  );
}

const { ErrorBoundry, buildError } = withTextBoundryError<TdpAttributesProps>(
  TdpAttributesComponent,
  'Failed to fetch TDP Attributes with error'
);
export default ErrorBoundry;
