import React, { useCallback } from 'react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { Loading } from '@nwm/util';
import { curry, get } from 'lodash';

import { ISearchComboBoxProps, ISearchTextFieldProps, SearchBy } from '../components/search/search';
import { buildQueryString, searchStackItemStyles, useComboBox, useTextField } from '../components/search/helpers';
import useLinks from '../hooks/links/useLinks';
import { GI_ListGiSearchOptions } from './__generated__/GI_ListGiSearchOptions';

const GET_OPTIONS = gql`
  query GI_ListGiSearchOptions {
    subdirs: db_tdms_data_set_gis(distinct_on: sub_dir, order_by: { sub_dir: asc }) {
      category: sub_dir
    }
    productNames: db_tdms_data_set_gis(distinct_on: product_name, order_by: { product_name: asc }) {
      productName: product_name
      data_set {
        tdif_no
        ds
      }
    }
    dtns: db_tdms_data_set_gis(order_by: { data_set: { ds: asc } }, where: { tdif: { _is_null: false } }) {
      tdif
      data_set {
        tdif_no
        ds
      }
    }
  }
`;

// Tools to fetch the correct options from the query data
const getOptions = curry(<T, K extends keyof T>(key: K, itemKey: string, itemLabelKey: string, data: T | undefined) => {
  return get(data, key, [])
    .map((item: any) => ({
      key: get(item, itemKey),
      text: get(item, itemLabelKey),
    }))
    .filter((item: any) => item.key != null && item.text != null);
});
const getDtns = getOptions('dtns', 'data_set.ds', 'data_set.ds');
const getProductNames = getOptions('productNames', 'data_set.ds', 'productName');
const getSubDirectories = getOptions('subdirs', 'category', 'category');

type SearchQueryVars = {
  query: string;
};

const SearchIndexComponent = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<GI_ListGiSearchOptions, SearchQueryVars>(GET_OPTIONS);

  // Factories to create state and event handlers for each search field
  const {
    field: keyword,
    error: keywordError,
    change: setKeyword,
    reset: resetKeyword,
    validate: validateKeyword,
  } = useTextField();

  const { field: dtn, error: dtnError, change: setDtn, reset: resetDtn, validate: validateDtn } = useComboBox();

  const {
    field: productName,
    error: productNameError,
    change: setProductName,
    reset: resetProductName,
    validate: validateProductName,
  } = useComboBox();

  const {
    field: subdirectory,
    error: subdirectoryError,
    change: setSubdirectory,
    reset: resetSubdirectory,
    validate: validateSubdirectory,
  } = useComboBox();

  // Fetch links from the global list of links
  const tdmsLinks = useLinks();
  const tdifLinks = tdmsLinks.atdt.tdif;
  const giLinks = tdmsLinks.gis.dtnModel;

  // Event handlers for the search buttons
  const onKeywordSubmit = useCallback(() => {
    validateKeyword() && navigate(buildQueryString('keyword', keyword));
  }, [validateKeyword, navigate]);

  const onDtnSubmit = useCallback(() => {
    if (validateDtn()) {
      const { to } = tdifLinks.globalTextLinkProps({ tdifId: dtn });
      navigate(to);
    }
  }, [validateDtn, navigate]);

  const onProductNameSubmit = useCallback(() => {
    if (validateProductName()) {
      const { to } = giLinks.globalTextLinkProps({ tdifId: productName });
      navigate(to);
    }
  }, [validateProductName, navigate]);

  const onSubdirectorySubmit = useCallback(
    () => validateSubdirectory() && navigate(buildQueryString('subDirectory', subdirectory)),
    [validateSubdirectory, navigate]
  );

  const onResetClick = () => {
    resetKeyword();
    resetDtn();
    resetProductName();
    resetSubdirectory();
  };

  // Props for SearchIndex to generate each search field
  const keywordProps: ISearchTextFieldProps = {
    value: keyword,
    errorMessage: keywordError,
    buttonClick: onKeywordSubmit,
    reset: resetKeyword,
    validate: validateKeyword,
    onChange: setKeyword,
    deferredValidationTime: 10000,
  };

  const dtnProps: ISearchComboBoxProps = {
    selectedKey: dtn,
    errorMessage: dtnError,
    buttonClick: onDtnSubmit,
    reset: resetDtn,
    validate: validateDtn,
    onChange: setDtn,
    options: getDtns(data),
  };

  const productNameProps: ISearchComboBoxProps = {
    selectedKey: productName,
    errorMessage: productNameError,
    buttonClick: onProductNameSubmit,
    reset: resetProductName,
    validate: validateProductName,
    onChange: setProductName,
    options: getProductNames(data),
  };

  const subdirectoryProps: ISearchComboBoxProps = {
    selectedKey: subdirectory,
    errorMessage: subdirectoryError,
    buttonClick: onSubdirectorySubmit,
    reset: resetSubdirectory,
    validate: validateSubdirectory,
    onChange: setSubdirectory,
    options: getSubDirectories(data),
  };

  const resetProps = [{ reset: onResetClick }];

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Text>Something went wrong</Text>;
  }

  return (
    <Stack.Item styles={searchStackItemStyles}>
      <Text variant={'large'}>Searches</Text>
      <SearchBy
        keywordProps={keywordProps}
        dtnProps={dtnProps}
        productNameProps={productNameProps}
        subdirectoryProps={subdirectoryProps}
        resetProps={resetProps}
      />
    </Stack.Item>
  );
};

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

const SearchDocument = withErrorBoundary(SearchIndexComponent, ErrorFallback);
export default SearchDocument;
