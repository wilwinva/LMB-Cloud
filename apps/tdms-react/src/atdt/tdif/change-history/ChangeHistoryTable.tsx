import React from 'react';
import { ColumnGeneric, Table } from '@nwm/uifabric';
import { gql } from '@apollo/client';
import { formatMonthDate } from '../../../components/helpers/FormatDateTime';
import { Text } from 'office-ui-fabric-react';
import {
  ChangeHistoryTableFrag,
  ChangeHistoryTableFrag_tdif_changes as ChangeHistoryData,
} from './__generated__/ChangeHistoryTableFrag';

export const CHANGE_HISTORY_TABLE_FRAG = gql`
  fragment ChangeHistoryTableFrag on db_tdms_data_set {
    ds
    tdif_no
    id
    tdif_changes(order_by: { change_dt: desc }) {
      tdif_no
      id
      descr
      change_dt
      insert_dt
      insert_user
      tdif_no
      update_dt
      update_user
      lock_no
    }
  }
`;

export const baseColumns: { [key: string]: ColumnGeneric<ChangeHistoryData> } = {
  added: {
    key: 'Added',
    minWidth: 130,
    maxWidth: 130,
    isMultiline: true,
    getTargetString: (it: ChangeHistoryData) => `${formatMonthDate(it.insert_dt)}`,
    onRender: (it?: ChangeHistoryData) => (it ? <Text>{formatMonthDate(it.insert_dt)}</Text> : <></>),
  },
  updated: {
    key: 'Updated',
    minWidth: 130,
    maxWidth: 130,
    isMultiline: true,
    getTargetString: (it: ChangeHistoryData) => `${formatMonthDate(it.update_dt)}`,
    onRender: (it?: ChangeHistoryData) => (it ? <Text>{formatMonthDate(it.update_dt)}</Text> : <></>),
  },
  changeDate: {
    key: 'Change Date',
    minWidth: 130,
    maxWidth: 130,
    isMultiline: true,
    getTargetString: (it: ChangeHistoryData) => `${formatMonthDate(it.change_dt)}`,
    onRender: (it?: ChangeHistoryData) => (it?.change_dt ? <Text>{formatMonthDate(it.change_dt)}</Text> : <></>),
  },
  description: {
    key: 'Description',
    minWidth: 130,
    maxWidth: 130,
    isMultiline: true,
    getTargetString: (it: ChangeHistoryData) => `${it.descr}`,
    onRender: (it?: ChangeHistoryData) => (it?.descr ? <Text>{it.descr}</Text> : <></>),
  },
};
const columns: ColumnGeneric<ChangeHistoryData>[] = Object.values(baseColumns);

export interface ChangeHistoryTableProps {
  data: ChangeHistoryTableFrag;
}

export default function ChangeHistoryTable(props: ChangeHistoryTableProps) {
  const { data } = props;
  return <Table<ChangeHistoryData> items={data.tdif_changes} columns={columns} />;
}
