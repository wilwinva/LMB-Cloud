import { borders } from '@nwm/uifabric';
import { IStackStyles, IStackItemStyles } from 'office-ui-fabric-react';

export const headerStyles: IStackStyles = {
  root: {
    background: '#dbd9bd',
    borderTop: borders.borderTop,
    borderRight: borders.borderRightOff,
    borderLeft: borders.borderLeft,
    borderBottom: borders.borderBottom,
  },
};
export const valueStyles: IStackStyles = {
  root: {
    borderRight: borders.borderRightOff,
    borderLeft: borders.borderLeft,
    borderBottom: borders.borderBottomOff,
    overflow: 'auto',
  },
};

export const stackItemStyles: IStackItemStyles = {
  root: {
    padding: 4,
    borderRight: borders.borderRight,
    minHeight: 30,
  },
};

export const valueRowStyles = {
  borderBottom: borders.borderBottom,
};
