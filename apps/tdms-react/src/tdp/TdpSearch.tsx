import React, { useCallback } from 'react';
import { withErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { Stack, Text } from 'office-ui-fabric-react';

import { ISearchTextFieldProps, SearchBy } from '../components/search/search';
import { buildQueryString, searchStackItemStyles, useTextField } from '../components/search/helpers';

const SearchIndexComponent = () => {
  const navigate = useNavigate();

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

  const keywordProps: ISearchTextFieldProps = {
    value: keyword,
    errorMessage: keywordError,
    buttonClick: onKeywordClick,
    reset: resetKeyword,
    validate: validateKeyword,
    onChange: setKeyword,
    deferredValidationTime: 10000,
    instructions: 'Instructions: Enter keyword(s) from name or definition,',
  };

  const resetProps = [{ reset: resetKeyword }];

  return (
    <Stack.Item styles={searchStackItemStyles}>
      <Text variant={'large'}>Searches</Text>
      <SearchBy keywordProps={keywordProps} resetProps={resetProps} />
    </Stack.Item>
  );
};

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

const SearchDocument = withErrorBoundary(SearchIndexComponent, ErrorFallback);
export default SearchDocument;
