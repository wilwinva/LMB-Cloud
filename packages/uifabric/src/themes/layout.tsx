import { spacing } from './spacing';
import { IRawStyle } from 'office-ui-fabric-react';

export type IMargin = IRawStyle['margin'];
/*margins*/
export interface IMargins {
  m4: IMargin;
  m8: IMargin;
  neg: INegMargin;
}
export interface INegMargin {
  (margin: string): string;
}
export const margins: IMargins = {
  m4: `${spacing.s2}`,
  m8: `${spacing.s1}`,
  neg: function (margin: string) {
    return margin.indexOf('-') === -1 ? '-' + margin : margin;
  },
};

export type IPadding = IRawStyle['padding'];
/*paddings*/
export interface IPaddings {
  p4: IPadding;
  p8: IPadding;
}
export const paddings: IPaddings = {
  p4: `${spacing.s2}`,
  p8: `${spacing.s1}`,
};
