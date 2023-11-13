import React from 'react';
import { getCellDimension, Row, RowProps } from './Row';
import { getHeaderCellStyles } from './helpers/cells';
import { getHeaderRowStyles } from './helpers/rows';
import { getColorValue } from './helpers/getColorValue';
import { IFontWeight } from '@uifabric/styling';
import { useCustomizations } from '../themes';

export interface HeaderRowProps extends RowProps {
  topOff?: boolean;
  background?: string;
  color?: string;
  fontWeight?: IFontWeight;
  fontSize?: string; //IFontStyles; //'small' | 'medium' | 'large' | 'xlarge';
}

export function HeaderRow(props: HeaderRowProps) {
  const { stackDimension, cellNumber, topOff, background, color, fontWeight, fontSize } = props;
  const cellDimension = getCellDimension(cellNumber, stackDimension);

  const currentPalette = useCustomizations().settings.extended!.palette;
  const cellColor = getColorValue(color, currentPalette);
  const backgroundColor = getColorValue(background, currentPalette);
  const fw = fontWeight ?? 'normal';
  const fs = fontSize ?? 'medium';

  const rowStyles = getHeaderRowStyles(topOff, backgroundColor ?? '#dbd9bd');
  const { cellStyles, lastCellStyles, firstCellStyles } = getHeaderCellStyles(cellNumber, cellDimension, cellColor);
  return (
    <Row
      {...props}
      rowStyles={rowStyles}
      cellStyles={cellStyles}
      lastCellStyles={lastCellStyles}
      firstCellStyles={firstCellStyles}
      fontWeight={fw}
      fontSize={fs}
    />
  );
}
