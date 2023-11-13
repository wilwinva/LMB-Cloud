import React, { ReactElement } from 'react';
import { Stack, IStackStyles } from 'office-ui-fabric-react';
import { StackCellProps } from './StackCell';

export interface StackRowProps {
  stackStyles?: IStackStyles;
  children: ReactElement<StackCellProps> | ReactElement<StackCellProps>[];
}

function StackRowComponent(props: StackRowProps) {
  const { stackStyles, children } = props;

  return (
    <Stack horizontalAlign={'center'} horizontal grow styles={stackStyles}>
      {children}
    </Stack>
  );
}
export const StackRow = React.memo(StackRowComponent);
