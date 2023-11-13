import * as React from 'react';

import { IStackItemStyles, IStackStyles, IStackTokens, Stack, Text } from 'office-ui-fabric-react';
import { getTheme, IPalette } from 'office-ui-fabric-react/lib/Styling';
import DtnSearchCard from './search/dtn/DtnSearchCard';
import DirsSearchCard from './search/dirs/DirsSearchCard';
import { ReactNode } from 'react';
import { PageWithIntro } from '@nwm/uifabric';

const atdtTextHeader = {
  title: 'Automated Technical Data Tracking (ATDT)',
  description:
    'The Automated Technical Data Tracking (ATDT) System is a master indexing sub-system of the TDMS designed' +
    ' to provide an indexed capability to identify, track, and trace technical data acquired or developed for the project.',
};

const defaultProps: {} = {
  statusMessage: (
    <PageWithIntro title={atdtTextHeader.title}>
      <Text>{atdtTextHeader.description}</Text>
    </PageWithIntro>
  ),
};

export interface DtnSearchProps {
  statusMessage?: string | ReactNode;
}
function Index(props: React.PropsWithChildren<DtnSearchProps>) {
  const palette: IPalette = getTheme().palette;

  const horizontalGapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
  };

  const stackStyles: IStackStyles = {
    root: {
      overflow: 'hidden',
      maxWidth: '1200px',
      minWidth: '400px',
    },
  };

  const stackItemStyles: IStackItemStyles = { root: { flexBasis: '100%' } };

  return (
    <>
      <Text
        variant="small"
        styles={{ root: { fontWeight: 'bold', color: palette.black, paddingLeft: 10, paddingRight: 10 } }}
      >
        {props.statusMessage}
      </Text>
      <Stack horizontal wrap styles={stackStyles} tokens={horizontalGapStackTokens}>
        <Stack.Item styles={stackItemStyles} align={'baseline'}>
          <DtnSearchCard />
        </Stack.Item>
        <Stack.Item styles={stackItemStyles} align={'baseline'}>
          <DirsSearchCard />
        </Stack.Item>
      </Stack>
    </>
  );
}

Index.defaultProps = {
  ...defaultProps,
};

export default React.memo(Index);
