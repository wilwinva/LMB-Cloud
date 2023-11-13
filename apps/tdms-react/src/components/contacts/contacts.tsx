import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { gql, useMutation, useQuery, ApolloError } from '@apollo/client';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  IComboBox,
  IComboBoxOption,
  Selection,
  SelectionMode,
  Spinner,
} from 'office-ui-fabric-react';
import { ContactsQuery } from './__generated__/ContactsQuery';
import { HeaderRow, useBaseStyles, useDataWrapper } from '@nwm/uifabric';
import { CONTACTS_TABLE_FRAGMENT } from './contactsTable';
import { ContactsTableFragment } from './__generated__/ContactsTableFragment';
import ContactsEditableTable, { CONTACT_LIST_FRAGMENT } from './contactsEditableTable';
import { UpdateContacts } from './__generated__/UpdateContacts';
import moment from 'moment';
import { DeleteContact } from './__generated__/DeleteContact';
import useToggle from '../../atdt/tdif/change-history/useToggle';

export const CONTACTS_QUERY = gql`
  query ContactsQuery {
    db_tdms_contact(order_by: { contact_key: asc }) {
      ...ContactsTableFragment
    }
    db_tdms_person(where: { first_nm: { _neq: "" }, last_nm: { _neq: "" } }, order_by: { person_key: asc }) {
      ...ContactListFragment
    }
  }
  ${CONTACTS_TABLE_FRAGMENT}
  ${CONTACT_LIST_FRAGMENT}
`;

export const CONTACTS_MUTATION = gql`
  mutation UpdateContacts($contact_changes: [db_tdms_contact_insert_input!]!) {
    insert_db_tdms_contact(
      objects: $contact_changes
      on_conflict: {
        constraint: idx_43190_pk_contact_c
        update_columns: [descr, title, id, insert_dt, insert_user, lock_no, person_key, update_dt]
      }
    ) {
      affected_rows
      returning {
        contact_key
        person_key
        descr
        title
        insert_dt
        insert_user
        update_dt
        update_user
        lock_no
        id
      }
    }
  }
`;

export const CONTACTS_DELETE = gql`
  mutation DeleteContact($id: [Int!]!) {
    delete_db_tdms_contact(where: { id: { _in: $id } }) {
      affected_rows
    }
  }
`;

export interface ContactsData
  extends Omit<ContactsTableFragment, '__typename'>,
    Partial<Pick<ContactsTableFragment, '__typename'>> {}

export interface ContactsDict {
  [key: number]: ContactsData;
}

export interface LocalData {
  contacts: ContactsData[];
  changes: ContactsDict;
  addCount: number;
}

interface IUpdatedChange {
  id: number;
  contact_key: number;
  person_key: number;
  descr: string;
  title: string;
  lock_no: number;
  insert_dt: string;
  insert_user: string;
  update_dt: string;
  update_user: string;
}
const setUpdateChange = (newChange: any): IUpdatedChange => {
  const { personKey, ...rest } = newChange;
  return rest;
};

const initChanges = (contacts: ContactsData[] | undefined) => {
  return { contacts: contacts ?? [], changes: {}, addCount: 0 };
};

export function Contacts() {
  const { stackStyles } = useBaseStyles();
  const { loading, error, data } = useQuery<ContactsQuery>(CONTACTS_QUERY);

  const [selected, setSelected] = useState<ContactsData[]>([]);
  const selection: Selection = useMemo(
    () =>
      new Selection({
        onSelectionChanged: () => {
          //todo -- some intelligent way to check if IObjectWithKey is ChangeHistoryDataWithId?
          setSelected(selection.getSelection() as ContactsData[]);
        },
      }),
    [setSelected]
  );

  const [toDelete, setToDelete] = useState<ContactsData[]>([]);

  const loadingEle = useDataWrapper<ContactsQuery>({ data, loading, error, name: 'Contacts' });

  const contactsData = data ? data.db_tdms_contact : [];

  const [localData, setLocalData] = useState<LocalData>(initChanges(contactsData));

  const [isEditable, toggleEditable] = useToggle();

  const reset = useCallback(() => {
    toggleEditable(false);
    setLocalData(initChanges(contactsData));
    setToDelete([]);
  }, [contactsData, toggleEditable, setLocalData, setToDelete]);

  const edit = useCallback(() => {
    toggleEditable(true);
  }, [toggleEditable]);

  useEffect(() => {
    /** Data from network / cache layer has changed, clear changes and reset to default read state. */
    reset();
  }, [reset]);

  const newLocalChange = useCallback(
    (prev: LocalData, newChange: ContactsData) => {
      const { contacts, changes, addCount } = prev;
      const index = newChange.id;

      let found = false;
      const updatedContactChanges = contacts.map((orig) => {
        if (orig.id === index) {
          found = true;
          return newChange;
        }
        return orig;
      });

      if (!found) {
        updatedContactChanges.unshift(newChange);
      }

      return { contacts: updatedContactChanges, changes: { ...changes, [index]: newChange }, addCount };
    },
    [setLocalData]
  );

  const deleteLocalChange = useCallback(
    (prev: LocalData, deleteChanges: ContactsData[]) => {
      const { contacts, changes, addCount } = prev;

      deleteChanges.forEach((change) => {
        delete changes[change.id];
      }, changes);

      const updatedContactChanges = contacts.filter((orig) => !deleteChanges.find((change) => orig.id === change.id));

      return { contacts: updatedContactChanges, changes: changes, addCount };
    },
    [setLocalData]
  );

  const onTextFieldChange = useCallback(
    (
      it: ContactsData,
      name: keyof ContactsData,
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ): void => {
      const index = it.id;
      if (index !== undefined) {
        setLocalData((prev) => {
          const { changes } = prev;
          const { __typename, ..._it } = it;
          return newLocalChange(prev, { ...(changes[index] ?? _it), [name]: newValue });
        });
      }
    },
    [setLocalData, newLocalChange]
  );
  const onDropDownChange = useCallback(
    (
      it: ContactsData,
      name: keyof ContactsData,
      _event: React.FormEvent<IComboBox>,
      option?: IComboBoxOption
    ): void => {
      const index = it.id;
      if (index !== undefined) {
        setLocalData((prev) => {
          const { changes } = prev;
          const { __typename, ..._it } = it;
          const _optionKey = option?.key;
          return newLocalChange(prev, {
            ...(changes[index] ?? _it),
            [name]: _optionKey,
          });
        });
      }
    },
    [setLocalData, newLocalChange]
  );

  const id = data?.db_tdms_contact[0].id;

  const onNewClick = useCallback(() => {
    if (id === undefined || id === null) {
      return;
    }
    localData.addCount = getLastId(localData); //get id of last contact
    setLocalData((prev) => {
      const { addCount } = prev;
      if (!isEditable) {
        edit();
      }
      const newContactKey = getLastContactKey(localData) + 1; //get contact_key of last contact_key
      const newId = addCount + 1;
      const newChange = newContact(newContactKey, newId);
      return newLocalChange({ ...prev, addCount: newId }, newChange);
    });
  }, [edit, isEditable, newLocalChange, id, setLocalData, localData]);

  const onDeleteClick = useCallback(() => {
    setLocalData((prev) => deleteLocalChange(prev, selected));
    setToDelete((prev) => [...prev, ...selected]);
    setSelected([]);
  }, [deleteLocalChange, setToDelete, setLocalData, selected]);

  const [save, saveResponse] = useMutation<UpdateContacts>(CONTACTS_MUTATION, {
    refetchQueries: [{ query: CONTACTS_QUERY, variables: { id: id } }],
  });

  const [deleteChanges, deleteChangesResponse] = useMutation<DeleteContact>(CONTACTS_DELETE, {
    refetchQueries: [{ query: CONTACTS_QUERY, variables: { id: id } }],
  });

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function _save() {
      const { changes } = localData;
      const _changes = Object.values(changes);

      if (_changes.length) {
        _changes.filter((val) => val.id < 0); //.forEach((newVal) => (newVal.id = undefined));
        const updatedChanges: IUpdatedChange[] = _changes.map((item) => {
          return setUpdateChange(item);
        });
        /**
         * Note: don't call reset() from here; results in race condition with the localData here & reset reference, usually
         *   these references will be out of date and execute after the useEffect update, overwriting the new useQuery data.
         *   Allow useEffect() to handle resetting to the appropriate state.
         * */
        await save({ variables: { contact_changes: updatedChanges } });
      }

      if (toDelete.length) {
        const toDeleteIds = toDelete.filter((val) => val.id > 0).map((val) => val.id);
        await deleteChanges({ variables: { id: toDeleteIds } });
      }

      setUpdating(false);
    }

    if (updating) {
      _save();
    }
  }, [localData, setUpdateChange, save, deleteChanges, setUpdating, updating]);

  const onSaveClick = useCallback(() => {
    setUpdating(true);
  }, [setUpdating]);

  const errors: ApolloError[] = [saveResponse.error, deleteChangesResponse.error].filter(notEmpty);

  if (!loadingEle && data?.db_tdms_contact.length) {
    return (
      <Stack styles={stackStyles}>
        <HeaderRow
          stackDimension={{ height: 30, width: '100%' }}
          cellNumber={1}
          cells={[{ cellText: 'Contacts' }]}
          background="themePrimary"
          color="themeSecondary"
          fontWeight="600"
        />
        <br />
        <Stack horizontal styles={stackStyles} gap={5}>
          <PrimaryButton text={'Save'} disabled={!isEditable} onClick={onSaveClick} />
          <DefaultButton onClick={onDeleteClick} disabled={!isEditable || selected.length < 1} text={'Delete'} />
          <DefaultButton onClick={onNewClick} text={'Add'} />
          <DefaultButton onClick={isEditable ? reset : edit} text={isEditable ? 'Cancel' : 'Edit'} />
          <SaveStatus errors={errors} loading={saveResponse.loading || deleteChangesResponse.loading} />
        </Stack>
        <ContactsEditableTable
          rowData={localData.contacts}
          editable={isEditable}
          selection={selection}
          selectionMode={SelectionMode.multiple}
          onTextFieldChange={onTextFieldChange}
          onDropDownChange={onDropDownChange}
          personList={data.db_tdms_person}
        />
      </Stack>
    );
  } else if (loadingEle) {
    return loadingEle;
  }

  return (
    <Stack horizontal styles={stackStyles}>
      <Text variant="xLarge"> The contact data set could not be found.</Text>
    </Stack>
  );
}

const newContact = (contact_key: number, addIdx: number): ContactsData => {
  const now = moment().format();
  //todo -- set users, should we be setting dates on backend?
  return {
    contact_key,
    id: addIdx,
    person_key: 0,
    descr: '',
    title: '',
    insert_dt: now,
    insert_user: 'todo',
    update_dt: now,
    update_user: 'todo',
    lock_no: 0,
    personKey: {
      first_nm: '',
      middle_nm: '',
      last_nm: '',
      phone_num: '',
      email: '',
    },
  };
};

interface SaveStatusProps {
  errors: ApolloError[];
  loading?: boolean;
}

function SaveStatus(props: SaveStatusProps) {
  const { errors, loading } = props;
  if (errors.length) {
    return (
      <Stack>
        {errors.map((err, _idx) => (
          <Text key={_idx}> An error occurred while saving: {err} </Text>
        ))}
      </Stack>
    );
  } else if (loading) {
    return <Spinner />;
  } else {
    return <></>;
  }
}

const notEmpty = <T extends {}>(value: T | null | undefined): value is T => value !== undefined && value !== null;

const getLastId = (localData: LocalData) => {
  const lastOne = localData.contacts.reduce((acc, obj) => {
    return acc.id > obj.id ? acc : obj;
  });
  return lastOne.id;
};

const getLastContactKey = (localData: LocalData) => {
  const lastOne = localData.contacts.reduce((acc, obj) => {
    return acc.contact_key > obj.contact_key ? acc : obj;
  });
  return lastOne.contact_key;
};
