import React from 'react';
import { IStackStyles, IStackTokens, ITextStyles, Stack, Text } from 'office-ui-fabric-react';

interface DescriptionProps {
  title: string;
  description: string;
  developmentMethod: string;
}

const mainStackStyles: IStackStyles = {
  root: {
    paddingBottom: 10,
  },
};

const stackTokens: IStackTokens = {
  childrenGap: 10,
};

const labelStyles: ITextStyles = {
  root: {
    fontWeight: '600',
    fontSize: 'mediumPlus',
  },
};

export function Description(props: React.PropsWithChildren<DescriptionProps>) {
  return (
    <Stack styles={mainStackStyles} tokens={stackTokens}>
      <Stack.Item>
        <Text styles={labelStyles}>Title of Data:</Text>
        <Text> {props.title}</Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={labelStyles}>Description of Data:</Text>
        <Text>{props.description}</Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={labelStyles}>Acquisition/Development Method:</Text>
        <Text> {props.developmentMethod}</Text>
      </Stack.Item>
    </Stack>
  );
}
