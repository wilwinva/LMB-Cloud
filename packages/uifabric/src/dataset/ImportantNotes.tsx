import React from 'react';
import { IStackStyles, IStackTokens, ITextStyles, Link, Stack, Text } from 'office-ui-fabric-react';

interface DatasetProps {
  dtn: string;
  verificationStatus: string;
  qualifStatus: string;
  preliminaryData: string;
  parameters: Array<string>;
  headerNote: string;
}

const mainStackStyles: IStackStyles = {
  root: {
    paddingTop: 10,
    selectors: {
      div: {
        display: 'list-item',
        listStyleType: 'disc',
        listStylePosition: 'inside',
        paddingLeft: 10,
      },
    },
  },
};

const stackTokens: IStackTokens = {
  childrenGap: 10,
};

const accentStyles: ITextStyles = {
  root: {
    fontWeight: '600',
    fontSize: 'mediumPlus',
  },
};

const dtnNote: string = '(Click on DTN above for links to source data and other related information';

export function ImportantNotes(props: React.PropsWithChildren<DatasetProps>) {
  return (
    <Stack styles={mainStackStyles} tokens={stackTokens}>
      <Text variant={'xLarge'}>Important Notes:</Text>

      <Stack.Item>
        <Text styles={accentStyles}> {props.headerNote} </Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={accentStyles}> Data Tracking Number: </Text>
        <Link> {props.dtn} </Link>
        <Text block> {dtnNote} </Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={accentStyles}> Verification Status: </Text>
        <Text> {props.verificationStatus} </Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={accentStyles}> Data Qualification Status: </Text>
        <Text> {props.qualifStatus} </Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={accentStyles}> Preliminary Data: </Text>
        <Text> {props.preliminaryData} </Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={accentStyles}> Parameters: </Text>
        {props.parameters.map((param, idx) => (
          <Text key={idx} block>
            {` ${param} `}
          </Text>
        ))}
      </Stack.Item>
    </Stack>
  );
}
