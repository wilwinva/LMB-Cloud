import React from 'react';
import { IStackItemStyles, IStackTokens, Separator, Stack, StackItem, Text } from 'office-ui-fabric-react';
import NavMenu from './NavMenu';
import Header from './header/Header';

const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 40,
};

const navStackStyles: IStackItemStyles = {
  root: {
    width: 300,
    paddingTop: 0,
    selectors: {
      button: {
        height: 40,
      },
      'div.ms-Nav-groupContent': {
        marginBottom: 10,
        selectors: {
          'ul li div button': {
            height: 26,
          },
          'ul li div button i': {
            height: 26,
            lineHeight: 26,
          },
        },
      },
      'button.ms-Button--command.is-disabled': {
        lineHeight: 26,
        color: '#323130',
        fontSize: 16,
      },
    },
  },
};

export interface MaintProps {}

export default function Maint(props: MaintProps) {
  return (
    <Stack horizontal tokens={horizontalGapStackTokens}>
      <Stack>
        <Text variant={'xLarge'} style={{ paddingLeft: 26 }}>
          Maintenance Menu
        </Text>
        <Separator />
        <StackItem styles={navStackStyles}>
          <NavMenu />
        </StackItem>
      </Stack>
      <StackItem>
        <Header tdif_no={0} ds={''} />
      </StackItem>
    </Stack>
  );
}
