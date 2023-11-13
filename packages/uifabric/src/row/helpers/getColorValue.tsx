import { IPalette } from '@uifabric/styling';

export type IPartialPalette = Partial<IPalette>;
export type PaletteColor = keyof IPalette;

/**
 * Parses a stringname into appropriate color string. If provided a hash value, the value will be echoed. If a valid
 * IPalette color is provided the IPalette index will be returned. All other values will return undefined.
 *
 * This function may be useful when static type checking is not an option, such as when a parent is passing in a color
 * value to a child and the parent does not want to know the details of the IPalette exposed by the theme.
 *
 * @param colorName the colorName to be checked for # and IPalette index
 * @param palette the current theme's palette
 */
export function getColorValue<T extends Partial<IPalette>>(
  colorName: string | PaletteColor | undefined,
  palette: T
): T[PaletteColor] | undefined {
  if (!colorName) {
    return undefined;
  }

  if (isHashColor(colorName)) {
    return colorName;
  }

  return isPaletteColor(colorName, palette) ? palette[colorName] : undefined;
}

export const isPaletteColor = (color: string | PaletteColor, palette: IPartialPalette): color is PaletteColor => {
  return palette[color as PaletteColor] !== undefined;
};

export const isHashColor = (color: string) => {
  return color.startsWith('#');
};
