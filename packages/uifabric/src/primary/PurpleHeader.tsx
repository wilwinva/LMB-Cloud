import React, { PropsWithChildren } from 'react';
import { getTheme, Stack, Text, ITextStyles, IStackStyles, IStackItemStyles } from 'office-ui-fabric-react';

/* Purple header without a border.  Takes a title and is left aligned */

const containerStack: IStackStyles = {
  root: {
    marginTop: '1em',
    minWidth: '1em',
    maxHeight: '13em',
  },
};

interface ContentCardProps {
  title: string;
}

export function PurpleHeader(props: PropsWithChildren<ContentCardProps>) {
  const palette = getTheme().palette;
  const { title } = props;

  const containerItem: IStackItemStyles = {
    root: {
      backgroundColor: palette.themePrimary,
    },
  };

  const textStyles: ITextStyles = {
    root: {
      color: palette.themeSecondary,
      fontWeight: 'bold',
      padding: '0.05em',
    },
  };

  return (
    <Stack styles={containerStack} grow>
      <Stack.Item styles={containerItem} grow>
        <Text variant="large" styles={textStyles}>
          {title}
        </Text>
      </Stack.Item>
    </Stack>
  );
}
