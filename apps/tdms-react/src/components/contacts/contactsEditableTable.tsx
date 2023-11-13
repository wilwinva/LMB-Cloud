import React, { useMemo } from 'react';
import { ColumnGeneric, Table } from '@nwm/uifabric';
import { gql } from '@apollo/client';
import { Text, TextField, IComboBox, IComboBoxOption, IDetailsListProps } from 'office-ui-fabric-react';
import { partial } from 'lodash/fp';
import { baseColumns, buildContactName } from './contactsTable';
import ComboBoxComponent from './ComboBoxComponent';
import { ContactsQuery_db_tdms_person } from './__generated__/ContactsQuery';
import { ContactListFragment } from './__generated__/ContactListFragment';
import { ContactsData } from './contacts';

export const CONTACT_LIST_FRAGMENT = gql`
  fragment ContactListFragment on db_tdms_person {
    first_nm
    middle_nm
    last_nm
    email
    phone_num
    person_key
  }
`;

export type TextFieldChange = (
  it: ContactsData,
  name: keyof ContactsData,
  event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  newValue?: string
) => void;

export type DropDownChange = (
  it: ContactsData,
  name: keyof ContactsData,
  event: React.FormEvent<IComboBox>,
  option?: IComboBoxOption
) => void;

export interface ContactsEditableTableProps extends Pick<IDetailsListProps, 'selection' | 'selectionMode'> {
  rowData: ContactsData[];
  editable: boolean;
  onTextFieldChange: TextFieldChange;
  onDropDownChange: DropDownChange;
  personList: ContactsQuery_db_tdms_person[];
}

export default function ContactsEditableTable(props: ContactsEditableTableProps) {
  const { rowData, editable, onTextFieldChange, onDropDownChange, personList, selection, selectionMode } = props;

  const contactNameOption: IComboBoxOption[] =
    personList && personList.length
      ? personList.map((contact: ContactListFragment) => ({
          key: contact.person_key,
          text:
            contact.middle_nm === ''
              ? `${contact.first_nm} ${contact.last_nm}`
              : `${contact.first_nm} ${contact.middle_nm} ${contact.last_nm}`,
        }))
      : [];

  const _columns = useMemo(
    () => columns(onTextFieldChange, editable, onDropDownChange, ComboBoxComponent, contactNameOption),
    [onTextFieldChange, editable, onDropDownChange, ComboBoxComponent, contactNameOption]
  );
  return <Table<ContactsData> items={rowData} columns={_columns} selection={selection} selectionMode={selectionMode} />;
}

//todo -- validate change date is a date on input or save
export const columns = (
  onTextFieldChange: TextFieldChange,
  editable: boolean,
  onDropDownChange: DropDownChange,
  ContactsComboBox: any,
  contactListData: IComboBoxOption[]
): ColumnGeneric<ContactsData>[] => {
  const updatedColumns = {
    ...baseColumns,
    descr: {
      ...baseColumns.descr,
      onRender: (it?: ContactsData, index?: number) => {
        const text = it?.descr;
        if (editable && it && index !== undefined) {
          //todo -- useCallback these?
          const onChange = partial(onTextFieldChange, [it, 'descr']);
          return <TextField defaultValue={text} multiline onChange={onChange} />;
        } else if (it) {
          return <Text>{text}</Text>;
        }
        return <></>;
      },
    },
    title: {
      ...baseColumns.title,
      onRender: (it?: ContactsData, index?: number) => {
        const text = it?.title;
        if (editable && it && index !== undefined) {
          const onChange = partial(onTextFieldChange, [it, 'title']);
          return <TextField defaultValue={text} multiline onChange={onChange} />;
        } else if (it) {
          return <Text>{text}</Text>;
        }
        return <></>;
      },
    },
    contact_name: {
      ...baseColumns.contact_name,
      onRender: (it?: ContactsData, index?: number) => {
        if (editable && it && index !== undefined) {
          const onChange = partial(onDropDownChange, [it, 'person_key']);
          return (
            <ComboBoxComponent comboBoxOptions={contactListData} selected_key={it.person_key} onChange={onChange} />
          );
        } else if (it) {
          const text = buildContactName(it);
          return <Text>{text}</Text>;
        }
        return <></>;
      },
    },
  };
  return Object.values(updatedColumns);
};
