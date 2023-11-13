import React from 'react';
import { getTheme, IPalette } from '@uifabric/styling';
import { Stack, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { DefaultButton, Link, Text } from 'office-ui-fabric-react';

const palette: IPalette = getTheme().palette;
// Styles definition
const stackStyles: IStackStyles = {
  root: {
    background: palette.white,
    width: 1200,
  },
};
const stackStylesInfo: IStackStyles = {
  root: {
    background: palette.white,
    alignItems: 'initial',
    display: 'flex',
    height: 'auto',
    width: 400,
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
};
const stackStylesInfo3: IStackStyles = {
  root: {
    background: palette.white,
    display: 'flex',
    height: 'auto',
    width: 400,
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
};
const stackStylesInfo2: IStackStyles = {
  root: {
    background: palette.white,
    alignItems: 'initial',
    display: 'flex',
    height: 'auto',
    width: 800,
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
};
const boldStyle = { fontWeight: 700, textDecorationLine: 'underline' };

//Todo -- frag or data as a prop??
export interface MwdDataSetProps {
  data: any;
}
export default function MwdContent() {
  return (
    <>
      <Stack styles={stackStyles}>
        <Stack horizontal>
          <Stack.Item styles={stackStylesInfo3}>
            <DefaultButton style={{ marginLeft: '240px' }}>Download Files</DefaultButton>
          </Stack.Item>
          <Stack.Item styles={stackStylesInfo2}>
            Important: To download all files, select the "Download Files" button. The directory contains 53 gzipped
            files and requires over 10.7 MB compressed. Checksums performed to verify the absence of date corruption.
          </Stack.Item>
        </Stack>
        <Stack horizontal>
          <Stack.Item styles={stackStylesInfo}>&nbsp;</Stack.Item>
          <Stack.Item styles={stackStylesInfo2}>
            <Text style={{ marginLeft: '240px' }}>Note:&nbsp; </Text> In order to display manageable portions of the zip
            file, save the files to disk, open with WinZip, and extract the files to a local directory.
          </Stack.Item>
        </Stack>
      </Stack>
      <Text style={{ marginLeft: '240px' }}>
        If the date submittal is too large for an electronic transfer, or if you need other assistance, please{' '}
        <Text style={boldStyle}>
          <Link to="/#" style={{ color: 'green' }} activeStyle={{ color: 'green' }}>
            contact the Model Warehouse Data Administrator
          </Link>
        </Text>
        . Be sure to reference the data tracking number in any correspondence.
      </Text>
    </>
  );
}
