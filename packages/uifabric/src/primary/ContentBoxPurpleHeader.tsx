import React, { PropsWithChildren } from 'react';
import { getTheme, Stack, Text, ITextStyles, IStackStyles, IStackItemStyles } from 'office-ui-fabric-react';

interface ContentCardProps {
  title: string;
}

const purpleBox: IStackStyles = {
  root: {
    border: '0.15em solid',
    marginTop: '1em',
    minWidth: '1em',
    marginBottom: '.25em',
  },
};

const headerText: ITextStyles = {
  root: {
    color: 'yellow',
    fontWeight: 'bold',
    padding: '0.05em',
  },
};

const childrenContainer: IStackStyles = {
  root: {
    padding: '5px',
  },
};

export function ContentBoxPurpleHeader(props: PropsWithChildren<ContentCardProps>) {
  const palette = getTheme().palette;
  const { title, children } = props;

  const purpleBoxHeader: IStackItemStyles = {
    root: {
      backgroundColor: palette.themePrimary,
    },
  };

  return (
    <Stack styles={purpleBox} grow>
      <Stack.Item grow styles={purpleBoxHeader}>
        <Text variant="large" styles={headerText}>
          {title}
        </Text>
      </Stack.Item>
      <Stack grow styles={childrenContainer}>
        {children}
      </Stack>
    </Stack>
  );
}
