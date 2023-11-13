import React, { useCallback, useState } from 'react';
import { useParamsEncoded } from '@nwm/react-hooks';
import { HeaderRow, useBaseStyles, useDataWrapper } from '@nwm/uifabric';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CHANGE_HISTORY_TABLE_FRAG } from './ChangeHistoryTable';
import { DefaultButton, PrimaryButton, Stack, Text } from 'office-ui-fabric-react';
import { ChangeHistoryQuery } from './__generated__/ChangeHistoryQuery';
import ChangeHistoryEditableTable from './ChangeHistoryEditableTable';
import useToggle from './useToggle';
import { ChangeHistoryTableFrag_tdif_changes as ChangeHistoryData } from './__generated__/ChangeHistoryTableFrag';

export const CHANGE_HISTORY_QUERY = gql`
  query ChangeHistoryQuery($ds: String!) {
    db_tdms_data_set(where: { ds: { _eq: $ds } }) {
      ...ChangeHistoryTableFrag
    }
  }
  ${CHANGE_HISTORY_TABLE_FRAG}
`;

export const CHANGE_HISTORY_MUTATION = gql`
  mutation UpdateChangeHistory($tdif_changes: [db_tdms_tdif_change_insert_input!]!) {
    insert_db_tdms_tdif_change(
      objects: $tdif_changes
      on_conflict: { constraint: tdif_change_pkey, update_columns: [descr, change_dt] }
    ) {
      affected_rows
      returning {
        id
        descr
        change_dt
      }
    }
  }
`;

type _ChangeHistoryData = Omit<ChangeHistoryData, '__typename'>;

interface ChangeHistoryDict {
  [key: number]: _ChangeHistoryData;
}

//todo -- split out stack with buttons into its own component without header for maint and read only screens
export default function ChangeHistory() {
  const [ds] = useParamsEncoded();
  const { stackStyles } = useBaseStyles();
  const { loading, error, data } = useQuery<ChangeHistoryQuery>(CHANGE_HISTORY_QUERY, {
    variables: {
      ds: ds,
    },
  });

  const loadingEle = useDataWrapper<ChangeHistoryQuery>({ data, loading, error, name: 'Change History' });

  const [changedData, setChangeData] = useState<ChangeHistoryDict>({});
  const onTextFieldChange = useCallback(
    (
      it: ChangeHistoryData,
      name: keyof ChangeHistoryData,
      index: number,
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ): void => {
      setChangeData((prev) => {
        const { __typename, ..._it } = it;
        return { ...prev, [index]: prev[index] ? { ...prev[index], [name]: newValue } : _it };
      });
    },
    [setChangeData]
  );

  const [isEditable, toggleEditable] = useToggle();
  const cancelOnClick = useCallback(() => {
    toggleEditable();
    setChangeData({});
  }, [toggleEditable, setChangeData]);
  const editButton = <DefaultButton onClick={cancelOnClick} text={isEditable ? 'Cancel' : 'Edit'} />;

  const [save, saveData] = useMutation(CHANGE_HISTORY_MUTATION, {
    update: (cache, { data: { save } }) => {
      cache.modify({
        fields: {
          db_tdms_tdif_change: (cacheData = []) => {
            const newCacheData = cache.writeFragment({
              data: save,
              fragment: gql`
                fragment UpdateChangeHistoryResults on db_tdms_tdif_change {
                  id
                  descr
                  change_dt
                }
              `,
            });
            return [...cacheData, newCacheData];
          },
        },
      });
    },
  });

  const onSaveClick = useCallback(() => {
    save({ variables: { tdif_changes: Object.values(changedData) } });
  }, [data, changedData]);

  if (!loadingEle && data?.db_tdms_data_set.length) {
    return (
      <Stack styles={stackStyles}>
        <HeaderRow
          stackDimension={{ height: 30, width: '100%' }}
          cellNumber={1}
          cellText={[getHeaderText(ds, data)]}
          background="themePrimary"
          color="themeSecondary"
          fontWeight="600"
        />
        <br />
        <Stack horizontal styles={stackStyles} gap={5}>
          <PrimaryButton text={'Save'} disabled={!isEditable} onClick={onSaveClick} />
          {editButton}
        </Stack>
        <ChangeHistoryEditableTable
          data={data.db_tdms_data_set[0]}
          editable={isEditable}
          onTextFieldChange={onTextFieldChange}
        />
      </Stack>
    );
  } else if (loadingEle) {
    return loadingEle;
  }

  return (
    <Stack horizontal styles={stackStyles}>
      <Text variant="xLarge"> The data set with dtn {ds} could not be found.</Text>
    </Stack>
  );
}

const getHeaderText = (ds: string, data: ChangeHistoryQuery) => {
  const dtnSubstring = `Change History for DTN: ${ds}`;
  const tdif_no = data?.db_tdms_data_set[0]?.tdif_changes[0]?.tdif_no;
  const tdifSubstring = tdif_no ? `, TDIF_NO: ${tdif_no}` : '';
  return `${dtnSubstring}${tdifSubstring}`;
};
