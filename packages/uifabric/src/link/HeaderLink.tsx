import React from 'react';
import { Link } from 'react-router-dom';
import { TextLinkProps } from './TextLink';
import { getTheme, IPalette, IStackStyles, Stack } from 'office-ui-fabric-react';

/*
 * @const {IStackStyles} headerMenuLink
 * styles for stack containing a header menu link - one child, Link element
 */
const headerMenuLink: IStackStyles = {
  root: {
    transform: 'rotate(-30deg)',
    selectors: {
      a: {
        fontWeight: 'bold',
        textShadow: '2px 2px 2px grey',
        textDecoration: 'none',
      },
    },
  },
};

/*
 * @typedef {type} HeaderLinkProps
 * describes type (interface) for parameters being passed into HeaderLink function
 */
export type HeaderLinkProps = { index: number } & TextLinkProps;

/*
 * @function HeaderLink
 * @param <HeaderLinkProps> props
 * @return <JSX.Element>
 * builds out HeaderLink component
 */
function HeaderLinkBase(props: HeaderLinkProps) {
  const { linkText, ...rest } = props;
  const positionStart = 200 + rest.index * 70;
  const palette: IPalette = getTheme().palette;

  return (
    <Stack styles={headerMenuLink} style={{ left: positionStart }}>
      <Link {...rest} style={{ color: palette.black }}>
        {linkText}
      </Link>
    </Stack>
  );
}

export const HeaderLink: React.FunctionComponent<HeaderLinkProps> = React.memo(HeaderLinkBase);
