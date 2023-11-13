import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Text } from 'office-ui-fabric-react';
import { useParamsEncoded } from '@nwm/react-hooks';
import { TransferComponent } from '../query/Transfer';
import GiResultsTable, { GI_RESULTS_TABLE_FRAGMENT } from './components/GiResultsTable';
import { GiSearchResultsQuery, GiSearchResultsQueryVariables } from './__generated__/GiSearchResultsQuery';
import { Loading } from '@nwm/util';

export const GI_SEARCH_RESULTS_QUERY = gql`
  query GiSearchResultsQuery(
    $giType: String
    $ds: String
    $transfer: String
    $keyword: String
    $productName: String
    $subDir: String
  ) {
    db_tdms_data_set(
      distinct_on: tdif_no
      where: {
        _and: [
          { tdif_no: { _is_null: false } }
          { ds: { _eq: $ds } }
          { transfer: { component: { _eq: $transfer } } }
          { data_set_gis: { gis_type: { _eq: $giType } } }
          { data_set_gis: { product_name: { _eq: $productName } } }
          { data_set_gis: { sub_dir: { _eq: $subDir } } }
        ]
        _or: [
          { data_set_title: { title: { _ilike: $keyword } } }
          { data_set_gis: { gis_descr: { _ilike: $keyword } } }
        ]
        _not: { data_set_superseded_bies: { superseded_by_dtn: { _neq: "" } } }
      }
    ) {
      ...GiResultsTableFragment
    }
  }
  ${GI_RESULTS_TABLE_FRAGMENT}
`;

const baseVariables = {
  transfer: TransferComponent.GIS,
};

const getVariables = (type: string, query: string): GiSearchResultsQueryVariables => {
  switch (type) {
    case 'all':
      return { ...baseVariables };
    case 'coverage':
      return {
        ...baseVariables,
        giType: 'coverage',
      };
    case 'mapProduct':
      return {
        ...baseVariables,
        giType: 'map_product',
      };
    case 'dtn':
      return {
        ...baseVariables,
        ds: query,
      };
    case 'keyword':
      return {
        ...baseVariables,
        keyword: `%${query}%`,
      };
    case 'productName':
      return {
        ...baseVariables,
        productName: query,
      };
    case 'subDirectory':
      return {
        ...baseVariables,
        subDir: query,
      };
    default:
      throw Error('Unknown search type');
  }
};

interface Titles {
  [key: string]: string;
}

const titles: Titles = {
  category: 'Geographic Information by Category',
  keyword: 'Geographic Information by Keyword',
  dtn: 'Geographic Information by Category: DTN',
  all: 'Geographic Information by Category: All',
  coverage: 'Geographic Information by Category: Coverages',
  mapProduct: 'Geographic Information by Category: Map Products',
  productName: 'Geographic Information by Category: Product Name',
  subDirectory: 'Geographic Information by Sub Directory',
};

export const CATEGORIES = {
  category: 'category',
  keyword: 'keyword',
  dtn: 'dtn',
  all: 'all',
  coverage: 'coverage',
  mapProduct: 'mapProduct',
  productName: 'productName',
  subDirectory: 'subDirectory',
};

interface GiSearchResultsProps {
  category?: string;
}

function GiSearchResults({ category }: GiSearchResultsProps) {
  const [searchType, query] = useParamsEncoded();
  const searchCategory = category ?? searchType;

  const title = `${titles[searchCategory]}${query ? ': ' + query : ''}`;
  const queryVariables = getVariables(searchCategory, query);

  const { loading, error, data } = useQuery<GiSearchResultsQuery, GiSearchResultsQueryVariables>(
    GI_SEARCH_RESULTS_QUERY,
    { variables: queryVariables }
  );

  if (error !== undefined) {
    throw error;
  }

  if (loading || data === undefined) {
    return <Loading name={'GI Results'} />;
  }

  return (
    <GiResultsTable title={title} data={data.db_tdms_data_set} defaultSort={{ key: 'DTN', isSortedDescending: true }} />
  );
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch dtn with error: ${props.error} `}</Text>;
}

export default withErrorBoundary(GiSearchResults, ErrorFallback);
