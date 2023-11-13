import React, { ReactElement } from 'react';
import { Stack, StackItem, Text, IStackItemStyles, IStackProps } from 'office-ui-fabric-react';

export interface StackRowProps {
  stackItemHeaderStyles: IStackItemStyles;
  stackItemValueStyles: IStackItemStyles;
  headerText: string | ReactElement;
  valueText?: string | null | ReactElement;
  stackProps?: Partial<IStackProps>;
}

export function StackRow(props: StackRowProps) {
  const { stackItemHeaderStyles, stackItemValueStyles, headerText, valueText } = props;

  return (
    <>
      <StackItem styles={stackItemHeaderStyles}>
        <Text>{headerText}</Text>
      </StackItem>
      <StackItem grow styles={stackItemValueStyles}>
        <Text>{valueText}</Text>
      </StackItem>
    </>
  );
}

export function CellStack(props: { stackRowProps: StackRowProps[] }) {
  const { stackRowProps } = props;
  return (
    <Stack horizontal>
      {stackRowProps.map((prop, idx) => (
        <StackRow key={idx} {...prop} />
      ))}
    </Stack>
  );
}
