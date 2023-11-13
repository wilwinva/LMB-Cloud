import { IPalette, ITheme, createTheme } from '@uifabric/styling';
import { defaultPalette } from '@nwm/uifabric';
import { baseTheme, baseThemeExtended, IThemeExtended } from '@nwm/uifabric';
import { getNwmCustomizations } from '@nwm/uifabric';

const appPalette: Partial<IPalette> = {
  themeDarkAlt: '#685f95',
  themeDark: '#58517e',
  themeDarker: '#413b5d',
  themePrimary: '#6D63A1', //'#7369a5',
  themeSecondary: '#F7F79B',
  themeTertiary: '#95A66B',
  themeLight: '#d0cce4',
  themeLighter: '#e5e3f1',
  themeLighterAlt: '#f8f8fb',
  neutralDark: '#605e5d',
  neutralPrimary: '#323130',
  neutralPrimaryAlt: '#8d8b8a',
  neutralSecondary: '#a3a2a0', //'#5B5757',
  neutralSecondaryAlt: '#8a8886',
  neutralTertiary: '#bab8b7',
  neutralTertiaryAlt: '#c8c8c8',
  neutralQuaternary: '#d0d0d0',
  neutralQuaternaryAlt: '#dadada',
  neutralLight: '#eaeaea',
  neutralLighter: '#f4f4f4',
  neutralLighterAlt: '#f8f8f8',
  blackTranslucent40: 'rgba(0,0,0,.4)',
  black: '#0E0B0B', //'#494847',
};

const customPalette: Partial<IPalette> = { ...defaultPalette, ...appPalette };
const customTheme: ITheme = createTheme({
  ...baseTheme,
  palette: customPalette,
});

const extCustomTheme: IThemeExtended = {
  ...baseThemeExtended,
  palette: customPalette,
};

export const appCustomizations = getNwmCustomizations([customTheme, extCustomTheme]);
