import { IRawStyle } from 'office-ui-fabric-react';

export interface Dimension extends Pick<IRawStyle, 'height' | 'width'> {}
export interface Dimensions {
  [key: string]: Dimension;
}
