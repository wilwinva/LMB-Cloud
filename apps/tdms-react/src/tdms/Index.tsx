import React, { useContext, useMemo } from 'react';
import { getTheme, IPalette } from 'office-ui-fabric-react/lib/Styling';
import { IStackStyles, ITextStyles, Stack, Text } from 'office-ui-fabric-react';
import { LinkContext } from '../Routes';
import { Typescript } from '@nwm/util';
import OmniBar from '../components/omniBar/OmniBar';

const { keyGuard } = Typescript;

export default function Index() {
  const palette: IPalette = getTheme().palette;

  const headerStyles: ITextStyles = {
    root: {
      fontWeight: 'bold',
      color: palette.themePrimary,
      paddingBottom: 10,
    },
  };

  const headerStackStyles: IStackStyles = {
    root: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 150,
      maxWidth: '100%',
      minWidth: 200,
    },
  };

  const links = useContext(LinkContext);
  const baseLinksList = useMemo(
    () =>
      Object.entries(links)
        .filter(keyGuard(links, ['root', 'tdms'], true))
        .map(([_name, value]) => value.globalLink({}).props),
    [links]
  );

  return (
    <main id="tdms-main" role={'main'}>
      <Stack styles={headerStackStyles}>
        <Text variant="large" styles={headerStyles}>
          Technical Data Management Systems (TDMS)
        </Text>
      </Stack>
      <Stack horizontal>
        <OmniBar baseLinksList={baseLinksList} />
      </Stack>
    </main>
  );
}
