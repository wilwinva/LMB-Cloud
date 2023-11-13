import React, { useCallback } from 'react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Stack, Text } from 'office-ui-fabric-react';
import { Loading } from '@nwm/util';
import useLinks from '../../hooks/links/useLinks';
import { ISearchComboBoxProps, ISearchTextFieldProps, SearchBy } from './search';
import { buildQueryString, getOptions, searchStackItemStyles, useComboBox, useTextField } from './helpers';
import { GET_SEARCH_OPTIONS } from './SearchOptions';
import { PageWithIntro } from '@nwm/uifabric';
import { SearchOptions, SearchOptionsVariables } from './__generated__/SearchOptions';
import { TransferComponent } from '../../query/Transfer';

export interface searchIndexProps {
  pagetTitle: string;
  pageHeaderText: string;
  pageCategoryLinks?: any;
  transfer: TransferComponent;
}

const SearchIndexComponent = (props: searchIndexProps) => {
  const navigate = useNavigate();
  const links = useLinks();
  const tdifLinks = links.atdt.tdif;

  /* keyword */
  const {
    field: keyword,
    error: keywordError,
    change: setKeyword,
    reset: resetKeyword,
    validate: validateKeyword,
  } = useTextField();

  const onKeywordClick = useCallback(() => {
    validateKeyword() && navigate(buildQueryString('keyword', keyword));
  }, [validateKeyword, navigate]);

  /* dtn */
  const { field: dtn, error: dtnError, change: setDtn, reset: resetDtn, validate: validateDtn } = useComboBox();

  const onDtnClick = useCallback(() => {
    if (validateDtn()) {
      const { to } = tdifLinks.globalTextLinkProps({ tdifId: dtn });
      navigate(to);
    }
  }, [validateDtn, navigate]);

  /* parameter */
  const {
    field: parameter,
    error: parameterError,
    change: setParameter,
    reset: resetParameter,
    validate: validateParameter,
  } = useComboBox();
  const onParameterClick = useCallback(() => {
    validateParameter() && navigate(buildQueryString('parameter', parameter));
  }, [validateParameter, navigate]);

  const { loading, data } = useQuery<SearchOptions, SearchOptionsVariables>(GET_SEARCH_OPTIONS, {
    variables: { transfer: props.transfer },
  });

  if (loading || data === undefined) {
    return <Loading />;
  }

  const { linkText, ...atdtRouteProps } = links.atdt.globalTextLinkProps({});

  const keywordProps: ISearchTextFieldProps = {
    value: keyword,
    errorMessage: keywordError,
    buttonClick: onKeywordClick,
    reset: resetKeyword,
    validate: validateKeyword,
    onChange: setKeyword,
    deferredValidationTime: 10000,
  };

  const dtnProps: ISearchComboBoxProps = {
    errorMessage: dtnError,
    buttonClick: onDtnClick,
    reset: resetDtn,
    validate: validateDtn,
    onChange: setDtn,
    options: getOptions('dtns', 'ds', 'ds', data),
    selectedKey: dtn,
  };

  const parameterProps: ISearchComboBoxProps = {
    errorMessage: parameterError,
    buttonClick: onParameterClick,
    reset: resetParameter,
    validate: validateParameter,
    onChange: setParameter,
    options: getOptions('parameters', 'name', 'name', data),
    selectedKey: parameter,
  };

  const resetProps = [{ reset: resetKeyword }, { reset: resetDtn }, { reset: resetParameter }];

  return (
    <PageWithIntro title={props.pagetTitle}>
      <Text>{props.pageHeaderText}</Text>
      <Stack style={{ marginLeft: '55px' }}>
        <Stack.Item styles={searchStackItemStyles}>
          <Text variant={'large'}>Categories</Text>
          <ul>
            {props.pageCategoryLinks}
            <li>
              <Link {...atdtRouteProps}>Search the Automated Technical Data Tracking System (ATDT)</Link>
            </li>
          </ul>
        </Stack.Item>
        <Stack.Item styles={searchStackItemStyles}>
          <Text variant={'large'}>Searches</Text>
          <SearchBy
            keywordProps={keywordProps}
            dtnProps={dtnProps}
            parameterProps={parameterProps}
            resetProps={resetProps}
          />
        </Stack.Item>
      </Stack>
    </PageWithIntro>
  );
};

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

const SearchDocument = withErrorBoundary(SearchIndexComponent, ErrorFallback);
export default SearchDocument;
