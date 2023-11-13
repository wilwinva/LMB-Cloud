import React, { useCallback, useState } from 'react';
import {
  Stack,
  Text,
  IComboBoxOption,
  VirtualizedComboBox,
  IStackTokens,
  IComboBox,
  IStackStyles,
} from 'office-ui-fabric-react';
import { gql, useQuery } from '@apollo/client';
import { HeaderDropdownQuery, HeaderDropdownQuery_db_tdms_data_set } from './__generated__/HeaderDropdownQuery';
import { Loading } from '@nwm/util';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { compact } from 'lodash';
import HeaderTable from './HeaderTable';

export const HEADER_DROPDOWN_QUERY = gql`
  query HeaderDropdownQuery {
    db_tdms_data_set(distinct_on: tdif_no) {
      tdif_no
      ds
    }
  }
`;

export interface HeaderProps {
  tdif_no: number;
  ds: string;
}

function Header(props: HeaderProps) {
  const [tdif_no, setTdif] = useState<number | string | undefined>(props.tdif_no);

  const headerTableStackStyles: IStackStyles = {
    root: {
      width: `calc(95vw - 300px)`,
    },
  };

  const _onTdifChange = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
      setTdif(option?.key);
    },
    [setTdif]
  );

  const _onDtnChange = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
      setTdif(option?.key);
    },
    [setTdif]
  );

  const { loading, error, data } = useQuery<HeaderDropdownQuery>(HEADER_DROPDOWN_QUERY);

  if (error !== undefined) {
    throw error;
  }

  if (loading || data === undefined) {
    return <Loading name={'...'} />;
  }

  const tdifComboBoxOptions: IComboBoxOption[] = compact(
    data.db_tdms_data_set.map((item: HeaderDropdownQuery_db_tdms_data_set) => {
      return item.tdif_no ? { key: item.tdif_no, text: item.tdif_no.toString() } : undefined;
    })
  );

  const dtnComboBoxOptions: IComboBoxOption[] = compact(
    data.db_tdms_data_set.map((item: HeaderDropdownQuery_db_tdms_data_set) => {
      return item.tdif_no && item.ds ? { key: item.tdif_no, text: item.ds } : undefined;
    })
  );

  const stackTokens: IStackTokens = {
    childrenGap: 24,
  };

  return (
    <>
      <Stack horizontal tokens={stackTokens}>
        <VirtualizedComboBox
          defaultSelectedKey={props.tdif_no}
          allowFreeform
          autoComplete="on"
          options={tdifComboBoxOptions}
          dropdownMaxWidth={200}
          useComboBoxAsMenuWidth
          label="TDIF No:"
          onChange={_onTdifChange}
          scrollSelectedToTop={true}
          style={{ width: 170 }}
          selectedKey={tdif_no}
        />
        <VirtualizedComboBox
          defaultSelectedKey={props.tdif_no}
          allowFreeform
          autoComplete="on"
          options={dtnComboBoxOptions}
          dropdownMaxWidth={200}
          useComboBoxAsMenuWidth
          label="DTN:"
          onChange={_onDtnChange}
          scrollSelectedToTop={true}
          style={{ width: 230 }}
          selectedKey={tdif_no}
        />
      </Stack>
      <Stack styles={headerTableStackStyles}>
        <HeaderTable tdif_no={tdif_no} />
      </Stack>
    </>
  );
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch header dropdown lists with error: ${props.error} `}</Text>;
}
export default withErrorBoundary(Header, ErrorFallback);
