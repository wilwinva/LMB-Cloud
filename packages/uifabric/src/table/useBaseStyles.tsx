import {
  IDetailsListStyles,
  IScrollablePaneStyles,
  IStackStyles,
  IStyle,
  IStyleSet,
  mergeStyles,
} from 'office-ui-fabric-react';
import { mergeStyleSets } from '@uifabric/merge-styles';
import { useCustomizations } from '../themes';

type BaseStyles = Record<
  'baseStack' | 'columnClass' | 'boldText' | 'scrollable' | 'detailsList' | 'purpleTableHeader' | 'filterWrapper',
  IStyle
>;

export function useBaseStyles(styles?: IStyleSet<Record<any, IStyle>>) {
  const extSettings = useCustomizations().settings.extended!;
  const defaultBorder = extSettings.borders.default;
  const borderNone = `${extSettings.borders.none}!important`;
  const defaultPadding = extSettings.spacing.s1;
  const rowHeight = 25;

  const coloredHeader: IStyle = {
    selectors: {
      '.ms-DetailsHeader': {
        background: extSettings.palette.themePrimary!,
        color: extSettings.palette.themeSecondary,
      },
      '.ms-DetailsHeader-cell': {
        background: extSettings.palette.themePrimary,
        color: extSettings.palette.themeSecondary,
      },
      '.ms-Icon': {
        color: extSettings.palette.themeSecondary,
      },
    },
  };

  const detailsList: IStyle = {
    selectors: {
      '.ms-DetailsList': {
        overflow: 'auto',
      },
      '.ms-Icon': {
        color: extSettings.palette.themeSecondary,
      },
      '.ms-FocusZone': {
        padding: 0,
      },
    },
  };

  const detailsListHeader: IStyle = {
    selectors: {
      '.ms-DetailsHeader': {
        height: rowHeight,
        maxHeight: rowHeight,
        paddingTop: 0,
        paddingBottom: 0,
        borderBottom: defaultBorder,
      },
      '.ms-DetailsHeader-cell': {
        background: extSettings.palette.themePrimary,
        color: extSettings.palette.themeSecondary,
        minHeight: rowHeight,
        height: rowHeight,
        maxHeight: rowHeight,
        borderLeft: defaultBorder,
      },
      '.ms-DetailsHeader-cell:first-child': {
        borderLeft: `2px solid ${extSettings.palette.themePrimary}`,
      },
      '.ms-DetailsHeader-cell:hover': {
        background: extSettings.palette.themeLight,
      },
      '.ms-DetailsHeader-cell:first-child:hover': {
        borderLeft: `2px solid ${extSettings.palette.themeLight}`,
      },
      '.ms-DetailsHeader-cellTitle': {
        display: 'inline',
        top: '-9px',
      },
    },
  };

  const detailsListContent: IStyle = {
    selectors: {
      '.ms-List-cell': {
        minHeight: rowHeight,
        borderBottom: defaultBorder,
      },
      '.ms-List-page:last-child > .ms-List-cell:last-child': {
        borderBottom: borderNone,
      },
      '.ms-DetailsRow-cell': {
        minHeight: rowHeight,
        borderLeft: defaultBorder,
        color: 'black',
      },
      '.ms-DetailsRow-cell:first-child': {
        borderLeft: borderNone,
      },
      '.ms-Icon': {
        color: extSettings.palette.themeSecondary,
      },
    },
  };

  const scrollableDetailsListHeader: IStyle = {
    selectors: {
      '.ms-DetailsHeader': {
        borderTop: defaultBorder,
        borderLeft: defaultBorder,
      },
      '.ms-DetailsHeader-cell:first-child:hover': {
        borderLeft: `2px solid ${extSettings.palette.themeLight}`,
      },
    },
  };

  const extScrollableDetailsListHeader: IStyle = mergeStyles(detailsListHeader, scrollableDetailsListHeader);

  /**
   *  Need to explicitly type here with BaseStyles or typescript castes string literals as any string instead of a
   *  subset of string values. Can alternatively caste inline with: `position: 'absolute' as IStyle['position']` but
   *  that requires casting IStyle property that runs into this issue.
   */
  const baseStyles: IStyleSet<BaseStyles> = {
    baseStack: {
      padding: defaultPadding,
      selectors: {
        '.ms-Viewport': {
          borderTop: defaultBorder,
          borderRight: defaultBorder,
          borderLeft: defaultBorder,
        },
      },
    },
    scrollable: {
      ...coloredHeader,
      padding: `${defaultPadding} !important`,
    },
    detailsList: {
      ...detailsList,
    },
    columnClass: {
      paddingLeft: `${defaultPadding} !important`,
      paddingRight: `${defaultPadding} !important`,
    },
    boldText: { fontWeight: 'bold' },
    purpleTableHeader: coloredHeader,
    filterWrapper: { alignItems: 'flex-end' },
  };

  const _styles = styles ? mergeStyleSets(baseStyles, styles) : mergeStyleSets(baseStyles);

  const stackStyles: IStackStyles = { root: _styles.baseStack };

  const scrollablePaneStyles: Partial<IScrollablePaneStyles> = { root: detailsList };

  const detailsListStyles: Partial<IDetailsListStyles> = {
    root: detailsList,
    headerWrapper: detailsListHeader,
    contentWrapper: detailsListContent,
  };
  const scrollableDetailsListHeaderStyle: Partial<IScrollablePaneStyles> = {
    stickyAbove: extScrollableDetailsListHeader,
  };
  return {
    stackStyles,
    scrollablePaneStyles,
    detailsListStyles,
    columnClass: _styles.columnClass,
    boldText: _styles.boldText,
    purpleTableHeader: _styles.purpleTableHeader,
    filterWrapper: _styles.filterWrapper,
    borders: extSettings.borders,
    roundedCorner: extSettings.effects.roundedCorner2,
    spacings: extSettings.spacing,
    margins: extSettings.margins,
    paddings: extSettings.paddings,
    detailsList: _styles.detailsList,
    detailsListHeader: scrollableDetailsListHeaderStyle,
  };
}
