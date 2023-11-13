import React from 'react';
import { ContentBox, ContentBoxLink } from '@nwm/uifabric';
import { DefaultButton, getTheme, IPalette, Label, Stack, Text, TextField } from 'office-ui-fabric-react';

export default function AtdtManagerMenu() {
  const palette: IPalette = getTheme().palette;
  const placeholder = '/placeholder';
  const textBesideLinksStyles = {
    root: {
      marginTop: '0.25em',
      marginLeft: '0.25em',
      marginBottom: '0.25em',
    },
  };
  return (
    <ContentBox title="ATDT Manager Menu">
      <Stack.Item grow>
        <ContentBoxLink to={placeholder} children="View Comments" />
      </Stack.Item>
      <Stack.Item grow>
        <ContentBoxLink to={placeholder} children="RPC Submittal Deficiency Report" />
      </Stack.Item>
      <Stack horizontal grow>
        <Text styles={textBesideLinksStyles}>TAGS: [</Text>
        <ContentBoxLink to={placeholder} children="View/Update" />
        <Text styles={textBesideLinksStyles}>] [</Text>
        <ContentBoxLink to={placeholder} children="RPC Submittal Deficiency Report" />
        <Text styles={textBesideLinksStyles}>]</Text>
      </Stack>
      <Stack.Item grow>
        <ContentBoxLink to={placeholder} children="Add/Update People" />
      </Stack.Item>
      <Stack.Item grow>
        <ContentBoxLink to={placeholder} children="Add/Update Organization" />
      </Stack.Item>
      <Stack.Item grow>
        <Stack
          horizontal
          styles={{
            root: {
              marginTop: '1em',
              marginBottom: '1em',
              backgroundColor: palette.themeSecondary,
            },
          }}
        >
          <Label
            htmlFor="numberEntry"
            style={{
              whiteSpace: 'nowrap',
              paddingRight: '0.5em',
            }}
          >
            DTN or TDIF #
          </Label>
          <TextField
            id="numberEntry"
            styles={{
              root: {
                paddingRight: '0.5em',
              },
            }}
          />
          <DefaultButton
            style={{
              backgroundColor: palette.neutralTertiaryAlt,
              minWidth: '1em',
              width: '1em',
            }}
          >
            Go!
          </DefaultButton>
        </Stack>
      </Stack.Item>
    </ContentBox>
  );
}
