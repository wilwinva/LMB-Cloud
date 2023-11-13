import React from 'react';
import { getCellDimension, Row, RowProps } from './Row';
import { getValueRowStyles } from './helpers/rows';
import { getValueCellStyles } from './helpers/cells';
import { getColorValue } from './helpers/getColorValue';
import { useCustomizations } from '../themes';

export interface ValueRowProps extends RowProps {
  topOff?: boolean;
  background?: string;
  color?: string;
}

export function ValueRow(props: ValueRowProps) {
  const { stackDimension, cellNumber, topOff, background, color } = props;
  const cellDimension = getCellDimension(cellNumber, stackDimension);

  const currentPalette = useCustomizations().settings.extended!.palette;
  const cellColor = getColorValue(color, currentPalette);
  const backgroundColor = getColorValue(background, currentPalette);

  const rowStyles = getValueRowStyles(topOff, backgroundColor);
  const { cellStyles, lastCellStyles, firstCellStyles } = getValueCellStyles(cellNumber, cellDimension, cellColor);
  return (
    <Row
      {...props}
      rowStyles={rowStyles}
      cellStyles={cellStyles}
      lastCellStyles={lastCellStyles}
      firstCellStyles={firstCellStyles}
    />
  );
}
