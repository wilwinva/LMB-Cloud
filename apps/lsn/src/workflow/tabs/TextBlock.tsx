import React, { ReactElement } from 'react';
import { Text, IStackStyles, Stack } from 'office-ui-fabric-react';

interface TextBlockProps {
  displayText: ReactElement;
}
export default function TextBlock(props: TextBlockProps) {
  const stackStyles: IStackStyles = {
    root: {
      selectors: {
        span: {
          display: 'block',
          overflowY: 'scroll',
          textAlign: 'justify',
          lineHeight: '1.6',
          letterSpacing: '2',
          paddingLeft: '10px',
          paddingRight: '10px',
          selectors: {
            em: {
              backgroundColor: 'aqua',
            },
          },
        },
      },
    },
  };

  return (
    <Stack styles={stackStyles}>
      <Text>{props.displayText}</Text>
    </Stack>
  );
}
