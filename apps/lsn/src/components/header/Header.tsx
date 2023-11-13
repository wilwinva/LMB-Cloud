import React from 'react';
import { Stack, Text, IStackStyles, getTheme, IPalette, FontIcon, mergeStyles } from 'office-ui-fabric-react';

export default function Header() {
  const palette: IPalette = getTheme().palette;
  const iconClass = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,
    margin: '0 10px',
    color: 'deepskyblue',
  });

  const headerStyles: IStackStyles = {
    root: {
      background: palette.black,
      color: palette.white,
      width: '100%',
    },
  };
  return (
    <header role={'banner'}>
      <Stack styles={headerStyles} horizontal>
        <Stack.Item>
          <FontIcon iconName="WorkFlow" className={iconClass} />
        </Stack.Item>
        <Stack.Item align={'center'}>
          <Text variant={'large'}>DOE Documents Review Workflow</Text>
        </Stack.Item>
      </Stack>
    </header>
  );
}
