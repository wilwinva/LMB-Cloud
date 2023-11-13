import React from 'react';
import { gql } from '@apollo/client';
import { Text } from 'office-ui-fabric-react';
import { isNil } from 'lodash';
import { ColumnGeneric, Table } from '@nwm/uifabric';
import { ContactsData } from './contacts';

export const CONTACTS_TABLE_FRAGMENT = gql`
  fragment ContactsTableFragment on db_tdms_contact {
    personKey {
      first_nm
      middle_nm
      last_nm
      phone_num
      email
    }
    descr
    title
    person_key
    contact_key
    id
    lock_no
    insert_dt
    insert_user
    update_dt
    update_user
  }
`;

export const baseColumns: { [key: string]: ColumnGeneric<ContactsData> } = {
  descr: {
    key: 'Position Description',
    minWidth: 200,
    maxWidth: 300,
    isMultiline: true,
    getTargetString: (it: ContactsData) => it?.descr,
    onRender: (it?: ContactsData) => (it ? <Text>{it?.descr}</Text> : <></>),
  },
  title: {
    key: 'Title',
    minWidth: 200,
    maxWidth: 200,
    isMultiline: true,
    getTargetString: (it: ContactsData) => it?.title,
    onRender: (it?: ContactsData) => <Text>{it?.title}</Text>,
  },
  contact_name: {
    key: 'Contact Name',
    minWidth: 200,
    maxWidth: 200,
    isMultiline: true,
    getTargetString: (it: ContactsData) => buildContactName(it),
    onRender: (it?: ContactsData) => (it ? <Text>{buildContactName(it)}</Text> : <> </>),
  },
  phone_num: {
    key: 'Phone Number',
    minWidth: 200,
    maxWidth: 200,
    isMultiline: true,
    getTargetString: (it: ContactsData) => it?.personKey?.phone_num,
    onRender: (it?: ContactsData) => (it ? <Text>{it?.personKey?.phone_num}</Text> : <></>),
  },
  email: {
    key: 'Email',
    fieldName: 'email',
    minWidth: 200,
    maxWidth: 200,
    isMultiline: true,
    getTargetString: (it: ContactsData) => it?.personKey?.email,
    onRender: (it?: ContactsData) => (it ? <Text>{it?.personKey?.email}</Text> : <></>),
  },
};
const columns: ColumnGeneric<ContactsData>[] = Object.values(baseColumns);

export interface CcontactsTableProps {
  data: ContactsData[];
}

export default function ContactsTable(props: CcontactsTableProps) {
  const { data } = props;
  return <Table<ContactsData> items={data} columns={columns} />;
}

export const buildContactName = (data: any): string => {
  const personKey = data.personKey;
  const personName =
    !isNil(personKey.middle_nm) && personKey.middle_nm !== ''
      ? `${personKey.first_nm} ${personKey.middle_nm} ${personKey.last_nm}`
      : `${personKey.first_nm} ${personKey.last_nm}`;
  return personName.trim();
};
