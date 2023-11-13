import { ISpacing } from 'office-ui-fabric-react';
import { baseUnit } from './units';

export interface IExtendedSpacing extends ISpacing {
  s4: string;
  s3: string;
  l3: string;
  l4: string;
}

export const spacing: ISpacing = {
  s2: `${baseUnit * 0.25}rem`, //16px font = 4px
  s1: `${baseUnit * 0.5}rem`, //16px font = 8px
  m: `${baseUnit}rem`, //16px font = 16px
  l1: `${baseUnit * 1.25}rem`, //16px font = 20px
  l2: `${baseUnit * 1.5}rem`, //16px font = 24px
};

export const extendedSpacing: IExtendedSpacing = {
  ...spacing,
  s4: `${baseUnit * 0.06125}rem`, //16px font = 1px
  s3: `${baseUnit * 0.125}rem`, //16px font = 2px
  l3: `${baseUnit * 2}rem`, //16px font = 32px
  l4: `${baseUnit * 3}rem`, //16px font = 48px
};
