import React, { ReactElement, useMemo } from 'react';
import { StackRow } from './StackRow';

import { IStackItemStyles, IStackStyles, IFontWeight } from 'office-ui-fabric-react';
import { StackCell } from './StackCell';
import { Dimension } from '../themes';

export interface RowProps {
  stackDimension: Dimension;
  cellNumber: number;
  cellText: (string | ReactElement)[];
  fontWeight?: IFontWeight;
  fontSize?: string;
}

export interface RowComponentProps extends RowProps {
  rowStyles: IStackStyles;
  firstCellStyles?: IStackItemStyles;
  cellStyles: IStackItemStyles;
  lastCellStyles?: IStackItemStyles;
}

export function Row(props: RowComponentProps) {
  const { rowStyles, firstCellStyles, cellStyles, lastCellStyles, cellText, fontWeight, fontSize } = props;
  const cells: ReactElement[] = useMemo(
    () =>
      cellText.map((text: string | ReactElement, idx: number) => {
        const thisCellStyles = getCellStyles(
          { totalCellNum: cellText.length, idx },
          cellStyles,
          firstCellStyles,
          lastCellStyles
        );
        return (
          <StackCell
            key={idx}
            stackItemStyles={thisCellStyles}
            text={text}
            fontWeight={fontWeight}
            fontSize={fontSize}
          />
        );
      }),
    [cellText]
  );

  return <StackRow stackStyles={rowStyles}>{cells}</StackRow>;
}

const calcCellHeight = (numCells: number, height?: string | number) => {
  const tester = /((\d*\.?\d+)\s?(px|em|ex|%|in|cn|mm|pt|pc+))|(auto|none)/gim;

  if (typeof height === 'string' && tester.test(height)) {
    return height;
  }

  return Number(height) || 0 / numCells;
};
export function getCellDimension(numCells: number, stackDimension: Dimension): Dimension {
  return {
    height: calcCellHeight(numCells, stackDimension.height),
    width: stackDimension.width,
  };
}

interface CellIndex {
  totalCellNum: number;
  idx: number;
}
function getCellStyles(
  cellIndex: CellIndex,
  cellStyles: IStackItemStyles,
  firstCellStyles?: IStackItemStyles,
  lastCellStyles?: IStackItemStyles
) {
  const { totalCellNum, idx } = cellIndex;
  if (idx === 0) {
    return firstCellStyles ?? cellStyles;
  } else if (totalCellNum === idx + 1) {
    return lastCellStyles ?? cellStyles;
  }

  return cellStyles;
}
