import { IRawStyle } from 'office-ui-fabric-react';

export type Styles = IRawStyle | Array<IRawStyle>;

export const alignCenterStyles: Styles = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
};

export interface Dimension extends Pick<IRawStyle, 'height' | 'width'> {}
export interface Dimensions {
  [key: string]: Dimension;
}
