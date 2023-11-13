import { themes, INwmTheme, IThemeExtended } from './theme';
import { CustomizerContext, ICustomizations, ITheme, loadTheme } from 'office-ui-fabric-react';
import { useContext } from 'react';

export interface INwmCustomizations extends Omit<ICustomizations, 'settings'> {
  /** replace `export type ISettings = { [key: string]: any };` with strict type */
  settings: { theme?: ITheme; extended?: IThemeExtended };
}

/**
 * To consume a customization set, use the Customizer component and wrap your app.
 * @ref https://github.com/microsoft/fluentui/wiki/Component-Styling
 * @ref https://github.com/Microsoft/frontend-bootcamp/tree/master/step2-03/demo
 * @example setting up customizer
 *   import { Customizer } from 'office-ui-fabric-react';
 *   import { TeamsCustomizations } from 'office-ui-fabric-react/lib/customizations/TeamsCustomizations';
 *
 *     <Customizer {...TdmsCustomizations}>
 *       <App />
 *     </Customizer>
 * </code>
 *
 * @example scoped settings to customize all Text components and certain stack components
 *  export const TdmsCustomizations = {
 *     settings: {
 *       theme: loadTheme(themes.light),
 *       custom: test,
 *     },
 *     scopedSettings: {
 *       Text: {
 *         styles: {
 *           root: { color: 'red' },
 *         },
 *       },
 *       Stack: {
 *         styles: {
 *           root: [
 *             {
 *              selectors: {
 *                 span: { backgroundColor: 'black', color: 'teal' },
 *                 '.some-class-name': { backgroundColor: 'yellow' },
 *               },
 *             },
 *           ],
 *         },
 *       },
 *     },
 *   };
 *
 */
export const getNwmCustomizations = (theme: INwmTheme): INwmCustomizations => {
  return {
    settings: {
      theme: loadTheme(theme[0]),
      extended: theme[1],
    },
    scopedSettings: {},
  };
};

export const defaultNwmCustomizations = getNwmCustomizations(themes.default);

export const useCustomizations = (): INwmCustomizations => {
  const val = useContext(CustomizerContext).customizations;
  if (isNwmCustomizations(val)) {
    return val;
  }

  throw Error(`Tried to load bad theme shape. Val: ${val} is not of type INwmCustomizations.`);
};
export const useNwmCustomizations = (): INwmCustomizations => {
  const val = useContext(CustomizerContext).customizations;
  if (isNwmCustomizations(val)) {
    return val;
  }

  throw Error(`Tried to load bad theme shape. Val: ${val} is not of type INwmCustomizations.`);
};

const isNwmCustomizations = (custom: ICustomizations | INwmCustomizations): custom is INwmCustomizations => {
  return (custom as INwmCustomizations).settings?.extended !== undefined;
};
