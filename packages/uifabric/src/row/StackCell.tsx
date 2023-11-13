import React, { ReactElement } from 'react';
import { Text, StackItem, IStackItemStyles, ITextStyles, IFontWeight } from 'office-ui-fabric-react';

export interface StackCellProps {
  stackItemStyles: IStackItemStyles;
  text: string | ReactElement;
  fontWeight?: IFontWeight;
  fontSize?: string;
}

export function StackCell(props: StackCellProps) {
  const { stackItemStyles, text, fontWeight, fontSize } = props;
  const textStyles: ITextStyles = {
    root: {
      fontWeight: fontWeight,
      fontSize: fontSize,
    },
  };

  return (
    <StackItem grow styles={stackItemStyles}>
      <Text styles={textStyles}>{text}</Text> {/** todo -- make text links */}
    </StackItem>
  );
}
