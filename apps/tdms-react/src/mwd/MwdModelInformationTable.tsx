import React from 'react';
import { getTheme, IPalette } from '@uifabric/styling';
import { Stack, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { Text } from 'office-ui-fabric-react';

const boldStyle = { fontWeight: 800 };

// Remove or update this item to reflect real data source
const dataTable = {
  fileSize: 'Num KB',
  readmeFile: 'File.doc',
  description: 'Description',
};

//Todo -- frag or data as a prop??
export interface MwdDataSetProps {
  data: any;
}
export default function MwdModelInformationTable() {
  const palette: IPalette = getTheme().palette;
  const borderStyle = '1px solid ' + palette.black;
  // Styles definition
  const stackStyles: IStackStyles = {
    root: {
      background: palette.white,
      borderTop: borderStyle,
      borderBottom: borderStyle,
      borderLeft: borderStyle,
      width: 1200,
    },
  };
  const stackStylesLabel: IStackStyles = {
    root: {
      background: '#FFFFFF',
      alignItems: 'initial',
      display: 'flex',
      height: 30,
      justifyContent: 'flex-start',
      paddingLeft: 10,
      paddingTop: 10,
      width: 400,
      borderRight: borderStyle,
      borderBottom: borderStyle,
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
      borderRight: borderStyle,
      borderBottom: borderStyle,
    },
  };

  return (
    <>
      <Text style={boldStyle}>Model Information:</Text>
      <Stack styles={stackStyles}>
        <Stack horizontal>
          <Stack.Item styles={stackStylesLabel}>
            <Text style={boldStyle}>File Size</Text>
          </Stack.Item>
          <Stack.Item styles={stackStylesLabel}>
            <Text style={boldStyle}>Readme File</Text>
          </Stack.Item>
          <Stack.Item styles={stackStylesLabel}>
            <Text style={boldStyle}>Description</Text>
          </Stack.Item>
        </Stack>
        <Stack horizontal>
          <Stack.Item styles={stackStylesInfo}>{dataTable.fileSize}</Stack.Item>
          <Stack.Item styles={stackStylesInfo}>{dataTable.readmeFile}</Stack.Item>
          <Stack.Item styles={stackStylesInfo}>{dataTable.description}</Stack.Item>
        </Stack>
        <Stack horizontal>
          <Stack.Item styles={stackStylesInfo}>{dataTable.fileSize}</Stack.Item>
          <Stack.Item styles={stackStylesInfo}>{dataTable.readmeFile}</Stack.Item>
          <Stack.Item styles={stackStylesInfo}>{dataTable.description}</Stack.Item>
        </Stack>
      </Stack>
    </>
  );
}
