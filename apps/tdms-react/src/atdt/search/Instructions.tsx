import * as React from 'react';
import { ReactNode } from 'react';
import { Stack, Text } from 'office-ui-fabric-react';
import { ITextStyles } from 'office-ui-fabric-react/lib/components/Text/Text.types';

export interface InstructionProps {
  text: string | ReactNode;
}

function Instructions(props: InstructionProps) {
  const textInstructionsStyles: ITextStyles = {
    root: {
      fontWeight: 'bold',
    },
  };

  return (
    <Stack styles={{ root: { marginRight: '7px', width: '100%' } }}>
      <Text variant="large" styles={textInstructionsStyles}>
        Instructions:
      </Text>
      <Text>{props.text}</Text>
    </Stack>
  );
}

export default React.memo(Instructions);
