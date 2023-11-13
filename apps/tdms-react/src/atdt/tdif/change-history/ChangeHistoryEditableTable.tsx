import React, { useMemo } from 'react';
import { ColumnGeneric, Table } from '@nwm/uifabric';
import {
  ChangeHistoryTableFrag,
  ChangeHistoryTableFrag_tdif_changes as ChangeHistoryData,
} from './__generated__/ChangeHistoryTableFrag';
import { Text, TextField } from 'office-ui-fabric-react';
import { formatMonthDate } from '../../../components/helpers/FormatDateTime';
import { baseColumns } from './ChangeHistoryTable';
import { partial } from 'lodash/fp';

export type TextFieldChange = (
  it: ChangeHistoryData,
  name: keyof ChangeHistoryData,
  index: number,
  event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  newValue?: string
) => void;

export interface ChangeHistoryEditableTableProps {
  data: ChangeHistoryTableFrag;
  editable: boolean;
  onTextFieldChange: TextFieldChange;
}

export default function ChangeHistoryEditableTable(props: ChangeHistoryEditableTableProps) {
  const { data, editable, onTextFieldChange } = props;
  const _columns = useMemo(() => columns(onTextFieldChange, editable), [onTextFieldChange, editable]);
  return <Table<ChangeHistoryData> items={data.tdif_changes} columns={_columns} />;
}

//todo -- validate change date is a date on input or save
export const columns = (onTextFieldChange: TextFieldChange, editable: boolean): ColumnGeneric<ChangeHistoryData>[] => {
  const updatedColumns = {
    ...baseColumns,
    changeDate: {
      ...baseColumns.changeDate,
      onRender: (it?: ChangeHistoryData, index?: number) => {
        const text = it?.change_dt;
        if (editable && it && index !== undefined) {
          //todo -- useCallback these?
          const onChange = partial(onTextFieldChange, [it, 'change_dt', index]);
          return <TextField defaultValue={formatMonthDate(text)} multiline onChange={onChange} />;
        } else if (it) {
          return <Text>{formatMonthDate(text)}</Text>;
        }
        return <></>;
      },
    },
    description: {
      ...baseColumns.description,
      onRender: (it?: ChangeHistoryData, index?: number) => {
        const text = it?.descr;
        if (editable && it && index !== undefined) {
          const onChange = partial(onTextFieldChange, [it, 'descr', index]);
          return <TextField defaultValue={text} multiline onChange={onChange} />;
        } else if (it) {
          return <Text>{text}</Text>;
        }
        return <></>;
      },
    },
  };
  return Object.values(updatedColumns);
};
