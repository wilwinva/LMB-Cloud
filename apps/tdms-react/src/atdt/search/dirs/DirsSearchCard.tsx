import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import { ChoiceGroup, IChoiceGroupOption, ITextStyles, Text } from 'office-ui-fabric-react';
import SearchCard from '../SearchCard';
import DirsInstructions from './DirsInstructions';
import { gql } from '@apollo/client';
import { LinkContext } from '../../../Routes';
import { getOptions, useComboBox } from '../../../components/search/helpers';
import { ISearchComboBoxProps } from '../../../components/search/search';
import { useNavigate } from 'react-router';
import { Loading } from '@nwm/util';
import { useQuery } from '@apollo/client';
import { DirsOptions } from './__generated__/DirsOptions';

const GET_DIRS_OPTIONS = gql`
  query DirsOptions {
    dirs: db_tdms_dirs_tdms_docs(order_by: { doc_id: asc }) {
      doc_id
    }
  }
`;

function DirsSearchCard() {
  const [choiceKey, setChoiceKey] = useState('tdif');
  function _onChange(
    ev?: React.FormEvent<HTMLElement | HTMLInputElement | undefined>,
    option?: IChoiceGroupOption | undefined
  ): void {
    if (ev && option) {
      setChoiceKey(option.key);
    }
  }

  //todo -- these run way more than they should right now, probably need add callbacks / memo
  const links = useContext(LinkContext);

  const atdtLinkProps = links.atdt;
  const documentByIdPropsBuilder = (() => {
    switch (choiceKey) {
      case 'atdt_dirs': {
        return atdtLinkProps.tdif;
      }
      default: {
        return atdtLinkProps.tdif;
      }
    }
  })().relativeTextLinkProps;

  /* dirs combobox*/
  const navigate = useNavigate();
  const { field: dirs, error: dirsError, change: setDirs, reset: resetDirs, validate: validateDirs } = useComboBox();

  const onDirsOnClick = useCallback(() => {
    if (validateDirs()) {
      const { to } = documentByIdPropsBuilder({ tdifId: dirs });
      navigate(to);
    }
  }, [validateDirs, navigate]);

  const { loading, data } = useQuery<DirsOptions>(GET_DIRS_OPTIONS);

  if (loading || data === undefined) {
    return <Loading />;
  }

  const comboBoxProps: ISearchComboBoxProps = {
    errorMessage: dirsError,
    buttonClick: onDirsOnClick,
    reset: resetDirs,
    validate: validateDirs,
    onChange: setDirs,
    options: getOptions('dirs', 'doc_id', 'doc_id', data),
    selectedKey: dirs,
  };

  const labelStyles: ITextStyles = {
    root: {
      fontWeight: 'bold',
    },
  };

  return (
    <SearchCard
      headerText={'DIRS Trace'}
      inputHeader="DIRS Document ID:"
      comboBoxProps={comboBoxProps}
      loading={loading}
      choiceGroup={
        <ChoiceGroup
          className="defaultChoiceGroup"
          defaultSelectedKey="atdt_only"
          label={
            (
              <Text variant="mediumPlus" styles={labelStyles}>
                Trace Type:
              </Text>
            ) as any
          }
          required={true}
          onChange={_onChange}
          options={[
            {
              key: 'atdt_only',
              text: 'ATDT Citations',
            },
            {
              key: 'atdt_dirs',
              text: 'ATDT and DIRS Citations',
            },
          ]}
        />
      }
      instructions={<DirsInstructions />}
    />
  );
}

export default React.memo(DirsSearchCard);
