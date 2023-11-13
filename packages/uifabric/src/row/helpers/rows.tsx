import { IStackStyles } from 'office-ui-fabric-react';
import { ICSSRule, ICSSPixelUnitRule, ICSSDisplayRule, IFontWeight } from '@uifabric/merge-styles/lib/IRawStyleBase';
import { borders } from '../../themes';

export interface IRow {
  width: ICSSRule | ICSSPixelUnitRule;
  display: ICSSRule | ICSSDisplayRule;
  border?: ICSSRule | 0 | string;
  borderTop?: ICSSRule | ICSSPixelUnitRule;
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
export const rowDefault: IRow = {
  width: 'auto',
  display: 'flex',
  border: `${borders.default}`,
  justifyContent: 'flex-start',
};
export const rowDefaultTopOff: IRow = {
  ...rowDefault,
  borderTop: `${borders.none}`,
  justifyContent: 'flex-start',
};

export const HeaderRow: IRow = {
  ...rowDefault,
  justifyContent: 'center',
};
export const HeaderRowTopOff: IRow = {
  ...rowDefaultTopOff,
  justifyContent: 'center',
};

export const ValueRowDefault: IRow = {
  ...rowDefault,
  justifyContent: 'flex-start',
};
export const ValueRowTopOff: IRow = {
  ...rowDefaultTopOff,
  justifyContent: 'flex-start',
};

export interface IRows {
  headerRow: IRow;
  headerRowTopOff: IRow;
  valueRow: IRow;
  valueRowTopOff: IRow;
}
export const rows: IRows = {
  headerRow: HeaderRow,
  headerRowTopOff: HeaderRowTopOff,
  valueRow: ValueRowDefault,
  valueRowTopOff: ValueRowTopOff,
};

export function getHeaderRowStyles(topOff: boolean = false, background: string = ''): Partial<IStackStyles> {
  const rowType = topOff ? HeaderRowTopOff : HeaderRow;
  return getRowStyles(rowType, background);
}
export function getValueRowStyles(topOff: boolean = true, background: string = ''): Partial<IStackStyles> {
  const rowType = topOff ? ValueRowTopOff : ValueRowDefault;
  return getRowStyles(rowType, background);
}
export function getRowStyles(rowType: IRow, background: string = ''): Partial<IStackStyles> {
  const rowBackground = background !== '' ? { background: background } : {};
  return { root: { ...rowType, ...rowBackground } };
}
