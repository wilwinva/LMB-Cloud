import { baseUnits } from './units';
import { IRawStyle } from 'office-ui-fabric-react';

export const borderBase = `${baseUnits.bu2}px`;
export const borderSolid = `${borderBase} solid black`;

export type IBorder = IRawStyle['border'];
export interface IBorders {
  default: IBorder;
  none: IBorder;
  borderAll: IBorder;
  borderTop: IBorder;
  borderRight: IBorder;
  borderBottom: IBorder;
  borderLeft: IBorder;
  borderOff: IBorder;
  borderTopOff: IBorder;
  borderRightOff: IBorder;
  borderBottomOff: IBorder;
  borderLeftOff: IBorder;
}
export const borders: IBorders = {
  default: `${borderSolid}`,
  none: '0',
  borderAll: `${borderSolid}`,
  borderTop: `${borderSolid}`,
  borderRight: `${borderSolid}`,
  borderBottom: `${borderSolid}`,
  borderLeft: `${borderSolid}`,
  borderOff: '0',
  borderTopOff: `0 ${borderSolid} ${borderSolid} ${borderSolid}`,
  borderRightOff: `${borderSolid} 0 ${borderSolid} ${borderSolid}`,
  borderBottomOff: `${borderSolid} ${borderSolid} 0 ${borderSolid}`,
  borderLeftOff: `${borderSolid} ${borderSolid} ${borderSolid} 0`,
};
