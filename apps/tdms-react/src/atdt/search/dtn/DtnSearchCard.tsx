import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import { ChoiceGroup, IChoiceGroupOption, ITextStyles, Text } from 'office-ui-fabric-react';
import SearchCard from '../SearchCard';
import DtnInstructions from './DtnInstructions';
import { gql } from '@apollo/client';
import { LinkContext } from '../../../Routes';
import { getOptions, useComboBox } from '../../../components/search/helpers';
import { ISearchComboBoxProps } from '../../../components/search/search';
import { useNavigate } from 'react-router';
import { Loading } from '@nwm/util';
import { useQuery } from '@apollo/client';
import { DtnOptions } from './__generated__/DtnOptions';

const GET_DTN_OPTIONS = gql`
  query DtnOptions {
    dtns: db_tdms_data_set(order_by: { ds: asc }) {
      ds
      ds_key
    }
  }
`;

function DtnSearchCard() {
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
      case 'tdif': {
        return atdtLinkProps.tdif;
      }
      case 'source': {
        return atdtLinkProps.source;
      }
      case 'descendant': {
        return atdtLinkProps.descendant;
      }
      default: {
        return atdtLinkProps.supersede;
      }
    }
  })().relativeTextLinkProps;

  /* dtn combobox*/
  const navigate = useNavigate();
  //  const tdifLinks = links.atdt.tdif;

  const { field: dtn, error: dtnError, change: setDtn, reset: resetDtn, validate: validateDtn } = useComboBox();

  const onDtnOnClick = useCallback(() => {
    if (validateDtn()) {
      const { to } = documentByIdPropsBuilder({ tdifId: dtn });
      navigate(to);
    }
  }, [validateDtn, navigate]);

  const { loading, data } = useQuery<DtnOptions>(GET_DTN_OPTIONS);

  if (loading || data === undefined) {
    return <Loading />;
  }

  const comboBoxProps: ISearchComboBoxProps = {
    errorMessage: dtnError,
    buttonClick: onDtnOnClick,
    reset: resetDtn,
    validate: validateDtn,
    onChange: setDtn,
    options: getOptions('dtns', 'ds', 'ds', data),
    selectedKey: dtn,
  };

  const labelStyles: ITextStyles = {
    root: {
      fontWeight: 'bold',
    },
  };

  return (
    <SearchCard
      headerText={'DTN Trace'}
      inputHeader="DTN:"
      comboBoxProps={comboBoxProps}
      loading={loading}
      choiceGroup={
        <ChoiceGroup
          className={'defaultChoiceGroup'}
          defaultSelectedKey={'tdif'}
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
              key: 'tdif',
              text: 'Get TDIF',
            },
            {
              key: 'source',
              text: 'Build Source Tree',
            },
            {
              key: 'descendant',
              text: 'Build Descendant Tree',
            },
            {
              key: 'supersede',
              text: 'Build Supersede Tree',
            },
          ]}
        />
      }
      instructions={<DtnInstructions />}
    />
  );
}

export default React.memo(DtnSearchCard);
