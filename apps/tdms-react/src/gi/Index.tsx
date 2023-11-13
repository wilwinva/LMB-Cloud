import React from 'react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Text, Stack } from 'office-ui-fabric-react';
import { PageWithIntro } from '@nwm/uifabric';

import GiLinks from './GiLinks';
import GiSearchFields from './GiSearchFields';

const giIndexHeader = {
  title: 'Geographic Information (GI)',
  description:
    'Geographic Information (GI) is a database component of TDMS, which contains spatial data, consisting of geo-referenced x, y, z coordinates, providing location information for activities on or around the project study area.',
};

function GiIndex() {
  return (
    <PageWithIntro title={giIndexHeader.title}>
      <Text>{giIndexHeader.description}</Text>
      <Stack style={{ marginLeft: '55px' }}>
        <GiLinks />
        <GiSearchFields />
      </Stack>
    </PageWithIntro>
  );
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

export default withErrorBoundary(GiIndex, ErrorFallback);
