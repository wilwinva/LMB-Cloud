import { IStackItemStyles } from 'office-ui-fabric-react';
import { ICSSRule, ICSSDisplayRule, ICSSPixelUnitRule, IFontWeight } from '@uifabric/merge-styles/lib/IRawStyleBase';
import { borders, Dimension, spacing } from '../../themes';

/*cells*/

export interface ICell {
  display: ICSSRule | ICSSDisplayRule;
  overflow: ICSSRule | 'auto' | 'hidden' | 'scroll' | 'visible';
  padding?: ICSSRule | ICSSPixelUnitRule;
  borderRight?: ICSSRule | ICSSPixelUnitRule;
  height?: ICSSRule | ICSSPixelUnitRule;
  width?: ICSSRule | ICSSPixelUnitRule;
  justifyContent?:
    | ICSSRule
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  alignItems?: ICSSRule | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  background?: ICSSRule | string;
  color?: ICSSRule | string;
  fontWeight?: IFontWeight;
}

export interface ICells {
  start: ICell;
  center: ICell;
  end: ICell;
  startLast: ICell;
  centerLast: ICell;
  endLast: ICell;
}

export const cellDefault: ICell = {
  display: 'flex',
  overflow: 'auto',
  padding: spacing.s2,
  borderRight: borders.default,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};

export const cellStart: ICell = {
  ...cellDefault,
};
export const cellCenter: ICell = {
  ...cellDefault,
  justifyContent: 'center',
};
export const cellEnd: ICell = {
  ...cellDefault,
  justifyContent: 'flex-end',
};

export const cellStartLast: ICell = {
  ...cellStart,
  borderRight: borders.none,
};
export const cellCenterLast: ICell = {
  ...cellCenter,
  borderRight: borders.none,
};
export const cellEndLast: ICell = {
  ...cellEnd,
  borderRight: borders.none,
};

export const cells: ICells = {
  start: cellStart,
  center: cellCenter,
  end: cellEnd,
  startLast: cellStartLast,
  centerLast: cellCenterLast,
  endLast: cellEndLast,
};

export interface ICellStyles {
  cellStyles: Partial<IStackItemStyles>;
  lastCellStyles: Partial<IStackItemStyles>;
  firstCellStyles: Partial<IStackItemStyles>;
}

export function getHeaderCellStyles(
  cellNumber: number,
  cellDimension: Dimension,
  color: string = '',
  fw: string = ''
): ICellStyles {
  const cellColor = color !== '' ? { color: color } : {};
  const cellStyles: Partial<IStackItemStyles> = {
    root: { ...cellCenter, ...{ alignItems: 'center' }, ...cellColor, ...cellDimension },
  };
  const lastCellStyles: Partial<IStackItemStyles> = {
    root: { ...cellCenterLast, ...{ alignItems: 'center' }, ...cellColor, ...cellDimension },
  };
  const firstCellStyles = cellNumber === 1 ? lastCellStyles : cellStyles;
  return { cellStyles, lastCellStyles, firstCellStyles };
}
export function getValueCellStyles(cellNumber: number, cellDimension: Dimension, color: string = ''): ICellStyles {
  const cellColor = color !== '' ? { color: color } : {};
  const cellStyles: Partial<IStackItemStyles> = { root: { ...cellStart, ...cellColor, ...cellDimension } };
  const lastCellStyles: Partial<IStackItemStyles> = { root: { ...cellStartLast, ...cellColor, ...cellDimension } };
  const firstCellStyles = cellNumber === 1 ? lastCellStyles : cellStyles;
  return { cellStyles, lastCellStyles, firstCellStyles };
}
