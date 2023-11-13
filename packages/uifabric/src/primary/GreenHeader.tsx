import React, { PropsWithChildren } from 'react';
import { getTheme, IStackItemStyles, IStackStyles, ITextStyles, Stack, Text } from 'office-ui-fabric-react';

/* Green header without a border.  Takes a title and is left aligned */

interface ContentCardProps {
  title: string;
}

const containerStack: IStackStyles = {
  root: {
    marginTop: '1em',
    minWidth: '1em',
    maxHeight: '13em',
  },
};

const containerItem: IStackItemStyles = {
  root: {
    backgroundColor: '#6ba694',
  },
};

export function GreenHeader(props: PropsWithChildren<ContentCardProps>) {
  const palette = getTheme().palette;
  const { title } = props;
  const containerText: ITextStyles = {
    root: {
      color: palette.themeSecondary,
      fontWeight: 'bold',
      padding: '0.05em',
    },
  };

  return (
    <Stack styles={containerStack} grow>
      <Stack.Item grow styles={containerItem}>
        <Text variant="large" styles={containerText}>
          {title}
        </Text>
      </Stack.Item>
    </Stack>
  );
}
