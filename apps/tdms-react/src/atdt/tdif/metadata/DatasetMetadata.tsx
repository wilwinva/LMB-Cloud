import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { useParamsEncoded } from '@nwm/react-hooks';
import { Loading } from '@nwm/util';
import { IStackTokens, Stack, Text } from 'office-ui-fabric-react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { HEADER_INFORMATION_FRAGMENT, HeaderInformation } from './HeaderInformation';
import { DatasetMetadataQuery, DatasetMetadataQueryVariables } from './__generated__/DatasetMetadataQuery';
import { SUBMITTAL_INFORMATION_FRAGMENT, SubmittalInformation } from './SubmittalInformation';
import { ACQDEV_INFORMATION_FRAGMENT, AcqDevInformation } from './AcqDevInformation';
import { SOURCE_INFORMATION_FRAGMENT, SourceInformation } from './SourceInformation';
import { RECORD_ROADMAP_INFORMATION_FRAGMENT, RecordRoadmapInformation } from './RecordsRoadmapInformation';
import { PageWithIntro } from '@nwm/uifabric';

export interface AtdtDocumentProps {}

const DATASET_METADATA_QUERY = gql`
  query DatasetMetadataQuery($ds: String) {
    db_tdms_data_set(limit: 1, where: { ds: { _eq: $ds } }) {
      ...HeaderInformationFragment
      ...SubmittalInformationFragment
      ...AcqDevInformationFragment
      ...SourceInformationFragment
      ...RecordRoadmapInformationFragment
    }
  }
  ${HEADER_INFORMATION_FRAGMENT}
  ${SUBMITTAL_INFORMATION_FRAGMENT}
  ${ACQDEV_INFORMATION_FRAGMENT}
  ${SOURCE_INFORMATION_FRAGMENT}
  ${RECORD_ROADMAP_INFORMATION_FRAGMENT}
`;

const styles = {
  maxWidth: 1200,
};

const containerStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 5,
};

export function DatasetMetadataComponent(_props: AtdtDocumentProps) {
  const [tdifId] = useParamsEncoded();
  const { loading, error, data } = useQuery<DatasetMetadataQuery, DatasetMetadataQueryVariables>(
    DATASET_METADATA_QUERY,
    { variables: { ds: tdifId } }
  );

  if (!tdifId || error !== undefined) {
    throw TdifError(tdifId, error);
  }

  if (loading || data === undefined) {
    return <Loading />;
  }
  const _data = data.db_tdms_data_set[0];
  return (
    <PageWithIntro title={'Data Set Metadata'}>
      <Stack tokens={containerStackTokens}>
        <HeaderInformation data={{ ..._data }} styles={styles} />
        <SubmittalInformation data={{ ..._data }} styles={styles} />
        <AcqDevInformation data={{ ..._data }} styles={styles} />
        <SourceInformation data={{ ..._data }} styles={styles} />
        <RecordRoadmapInformation data={{ ..._data }} styles={styles} />
      </Stack>
    </PageWithIntro>
  );
}

function TdifError(tdif: string = '', innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to find metadata with ds: ${tdif}.${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

const DatasetMetadata = withErrorBoundary(DatasetMetadataComponent, ErrorFallback);
export default DatasetMetadata;
