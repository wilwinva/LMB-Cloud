import { IPalette, ITheme, createTheme } from '@uifabric/styling';
import { defaultPalette } from '@nwm/uifabric';
import { baseTheme, baseThemeExtended, IThemeExtended } from '@nwm/uifabric';
import { getNwmCustomizations } from '@nwm/uifabric';

const appPalette: Partial<IPalette> = {
  themePrimary: '#4550ed',
  themeLighterAlt: '#f7f8fe',
  themeLighter: '#e0e1fc',
  themeLight: '#c4c8fa',
  themeTertiary: '#8c93f4',
  themeSecondary: '#5a64ef',
  themeDarkAlt: '#3e48d5',
  themeDark: '#343db4',
  themeDarker: '#272d85',
  neutralLighterAlt: '#f8f8f8',
  neutralLighter: '#f4f4f4',
  neutralLight: '#eaeaea',
  neutralQuaternaryAlt: '#dadada',
  neutralQuaternary: '#d0d0d0',
  neutralTertiaryAlt: '#c8c8c8',
  neutralTertiary: '#595959',
  neutralSecondary: '#373737',
  neutralPrimaryAlt: '#2f2f2f',
  neutralPrimary: '#000000',
  neutralDark: '#151515',
  black: '#0b0b0b',
  white: '#ffffff',
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
