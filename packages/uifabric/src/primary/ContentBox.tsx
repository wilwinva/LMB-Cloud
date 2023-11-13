import React, { PropsWithChildren } from 'react';
import { getTheme, Stack, Text } from 'office-ui-fabric-react';

type ContentCardProps = {
  title: string;
};

export function backgroundColor() {
  return getTheme().palette.themePrimary;
}

export function headerTextColor() {
  return getTheme().palette.themeSecondary;
}

export function ContentBox(props: PropsWithChildren<ContentCardProps>) {
  const palette = getTheme().palette;
  const { title, children } = props;
  return (
    <Stack
      style={{
        border: '0.15em solid',
        padding: '0.15em',
        minWidth: '1em',
        maxHeight: '13em',
      }}
      grow
    >
      <Stack.Item
        grow
        styles={{
          root: {
            backgroundColor: palette.themePrimary,
          },
        }}
      >
        <Text
          variant="large"
          style={{
            color: palette.themeSecondary,
            fontWeight: 'bold',
            padding: '0.05em',
          }}
        >
          {title}
        </Text>
      </Stack.Item>
      {children}
    </Stack>
  );
}
