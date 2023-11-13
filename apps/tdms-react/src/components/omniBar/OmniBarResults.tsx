import * as React from 'react';
import { useMemo } from 'react';
import { Stack, Text } from 'office-ui-fabric-react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@apollo/client';
import { OmniQuery, OmniQueryVariables } from './__generated__/OmniQuery';
import { OMNI_QUERY } from './OmniBarFragments';
import { Loading } from '@nwm/util';
import { buildVariables } from './helpers';
import StandardTable from './results/StandardTable';
import CategoriesTable from './results/CategoriesTable';
import RecordsRoadmapTable from './results/RecordsRoadmapTable';
import StatusTable from './results/DataSetStatusTable';
import ParametersTable from './results/ParametersDateKeywordsTable';
import SubmittalIdTable from './results/SubmittalIdTable';
import SourceTable from './results/SourcesTable';
import SubmittalTextTable from './results/SubmittalTextTable';
import AdminTable from './results/AdminTable';
import AcqDevSourceTable from './results/AcqDevTable';

interface IOmniBarResults {
  searchString: string | undefined;
  navItem: string | undefined;
}

const getResultObject = (searchString: string | undefined, navItem: string | undefined, data: OmniQuery) => {
  switch (navItem) {
    case 'Standard':
      return <StandardTable data={data.db_tdms_data_set} defaultSort={{ key: 'DTN', isSortedDescending: true }} />;
    case 'Categories':
      return (
        <CategoriesTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />
      );
    case 'Parameters/Dates/Keywords':
      return (
        <ParametersTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />
      );
    case 'Data Set Status':
      return <StatusTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />;
    case 'Submittal ID':
      return (
        <SubmittalIdTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />
      );
    case 'Submittal Text':
      return (
        <SubmittalTextTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />
      );
    case 'Acq / Dev':
      return (
        <AcqDevSourceTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />
      );
    case 'Sources':
      return <SourceTable data={data.db_tdms_data_set} defaultSort={{ key: 'TDIF No', isSortedDescending: true }} />;
    case 'Records Roadmap':
      return <RecordsRoadmapTable data={data.db_tdms_data_set} sort={{ columnKey: 'TDIF No', isDescending: true }} />;
    case 'Administrative':
      return <AdminTable data={data.db_tdms_data_set} defaultSort={{ key: 'DTN', isSortedDescending: true }} />;
    default:
      throw OmniBarPropsError();
  }
};

export function OmniBarResultsComponent(props: IOmniBarResults) {
  const { searchString, navItem } = props;

  const vars = useMemo(() => buildVariables(searchString, navItem ?? ''), [searchString, navItem]);
  const { loading, error, data } = useQuery<OmniQuery, OmniQueryVariables>(OMNI_QUERY, {
    variables: vars,
    skip: searchString === undefined || searchString === '',
  });

  if (!searchString || !navItem) {
    return <Stack />;
  }

  if (error !== undefined) {
    throw error;
  }

  if (loading || data === undefined) {
    return <Loading />;
  }

  return <Stack>{getResultObject(searchString, navItem, data)}</Stack>;
}

function OmniBarPropsError() {
  return new Error(`A Search string and a Navigation Item are required to search for Omni Bar Results`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch Omni Bar Results with error: ${props.error} `}</Text>;
}

const OmniBarResults = withErrorBoundary(OmniBarResultsComponent, ErrorFallback);
export default OmniBarResults;
