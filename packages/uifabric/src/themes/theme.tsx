import { defaultPalette } from './palette';
import { extendedSpacing, IExtendedSpacing, spacing } from './spacing';
import { effects, extendedEffects, IExtendedEffects } from './effects';
import { createTheme, IPartialTheme, ITheme } from '@uifabric/styling';
import { borders, IBorders } from './borders';
import { IMargins, IPaddings, margins, paddings } from './layout';

export interface IThemeExtendedBase {
  spacing: IExtendedSpacing;
  effects: IExtendedEffects;
  borders: IBorders;
  margins: IMargins;
  paddings: IPaddings;
  palette: Required<IPartialTheme>['palette'];
}
/** Types that are only in IPartialTheme */
type IThemeStandard = Pick<IPartialTheme, Exclude<keyof ITheme, keyof IThemeExtendedBase>>;

/** IPartialTheme types, with IPartialTheme extended fields replaced with new types */
export interface IThemeExtended extends IThemeStandard, IThemeExtendedBase {}

export type INwmTheme = [ITheme, IThemeExtended];
export interface INwmThemes {
  [key: string]: INwmTheme;
}

export const baseTheme: IPartialTheme = {
  spacing: spacing,
  effects: effects,
};

export const baseThemeExtended: Omit<IThemeExtended, 'palette'> = {
  spacing: extendedSpacing,
  effects: extendedEffects,
  borders,
  margins,
  paddings,
};

//create theme creates a new theme internally using IPartialTheme
const defaultTheme: ITheme = createTheme({
  ...baseTheme,
  palette: defaultPalette,
});

const extDefaultTheme: IThemeExtended = {
  ...baseThemeExtended,
  palette: defaultPalette,
};

/*const customTheme: ITheme = createTheme({
  ...baseTheme,
  palette: customPalette,
});

const extCustomTheme: IThemeExtended = {
  ...baseThemeExtended,
  palette: customPalette,
};*/

export const themes: INwmThemes = {
  default: [defaultTheme, extDefaultTheme],
  //  custom: [customTheme, extCustomTheme],
};

export const baseThemes: INwmTheme = [defaultTheme, extDefaultTheme];

//export const defaultTheme = themes.default;
