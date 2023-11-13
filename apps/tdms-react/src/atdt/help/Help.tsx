import React from 'react';
import { Stack, StackItem, Text, getTheme, IPalette } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import { Timestamp } from '@nwm/uifabric';
import { TodoPlaceholder } from '@nwm/util';
export default function Help() {
  const childrenGap = { childrenGap: 5 };
  const palette: IPalette = getTheme().palette;
  return (
    <>
      <Stack
        tokens={childrenGap}
        styles={{
          root: {
            marginBottom: '0.5em',
          },
        }}
      >
        <Stack
          horizontal
          styles={{
            root: {
              marginBottom: '1em',
            },
          }}
        >
          <Text variant="medium">Online &nbsp;</Text>
          <StackItem>
            <Link
              to="/data-entry"
              style={{
                color: palette.themeTertiary,
                fontWeight: 'bold',
              }}
            >
              DATA ENTRY SCREEN INSTRUCTIONS
            </Link>
          </StackItem>
          <Text variant="medium">&nbsp; are available.</Text>
        </Stack>
        <div
          style={{
            border: '0.10em solid',
            borderColor: palette.neutralPrimaryAlt,
            marginBottom: '2em',
          }}
        />
        <Text
          variant="xxLarge"
          styles={{
            root: {
              color: palette.themeDarkAlt,
            },
          }}
        >
          HELP!
        </Text>
        <Text
          variant="large"
          styles={{
            root: {
              marginBottom: '3em',
            },
          }}
        >
          Navigate using the title bar. All words are clickable.
        </Text>
        <Stack horizontal reversed>
          <TodoPlaceholder description="Please put header helper image for ATDT" />
        </Stack>
        <StackItem>
          <ol>
            <li>ATDT Logo. Clicking on the logo will always bring you back to the ATDT Main page.</li>
            <li>TDMS Logo. Clicking on the TDMS logo will send you to the TDMS Main page.</li>
            <li>BSC Intranet. Clicking on the BSC Intranet logo will take you directly to the BSC Intranet menu.</li>
            <li>
              ATDT web Sections. Clicking on any of these sections will take you to the respective menu page.{' '}
              <span style={{ fontStyle: 'italic' }}>Note</span> that the{' '}
              <span style={{ fontWeight: 'bold' }}>Maint</span> section requires a password.
            </li>
          </ol>
        </StackItem>
      </Stack>
      <Timestamp />
    </>
  );
}
