import React from 'react';
import { Stack, Text, IStackStyles, ITextStyles, getTheme, IPalette } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import { TextLinkProps } from '../link';
import { linkFactory } from './util';
import { Path } from '@nwm/util';

/*
 * @const {IStackStyles} header
 * styles for header component
 */
const header: IStackStyles = {
  root: {
    maxWidth: 'auto',
    height: 71,
    borderBottomRightRadius: 35,
    marginBottom: 20,
    marginLeft: 100,
    marginRight: 5,
    position: 'relative',
  },
};

/*
 * @const {ITextStyles} headerOvalBehind
 * styles for oval behind title - used to create the upsweep of green on the bottom left edge of header component
 */
const headerOvalBehind: ITextStyles = {
  root: {
    width: 230,
    height: 70,
    borderRadius: '50%',
    position: 'absolute',
    left: -130,
    top: 1,
  },
};

/*
 * @const {IStackStyles} headerOval
 * styles for oval containing link to application base page
 */
const headerOval: IStackStyles = {
  root: {
    width: 250,
    height: 70,
    borderRadius: '50%',
    position: 'absolute',
    left: -160,
    top: -3,
    selectors: {
      a: {
        textDecoration: 'none',
      },
    },
  },
};

/*
 * @const {IStackStyles} headerHeadingLink
 * styles for link containing the application name - two children, both text elements
 */
const headerHeadingLink: IStackStyles = {
  root: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    selectors: {
      'span:first-child': {
        textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
        fontSize: '30px',
        textAlign: 'center',
      },
      'span:last-child': {
        fontSize: '10px',
        fontWeight: 'bold',
        width: 120,
        textAlign: 'center',
      },
    },
  },
};

/*
 * @const {IStackStyles} headerCenter
 * styles for menu portion of the header - two children - 1. headerTopBar 2.headerMenuLinks
 */
const headerCenter: IStackStyles = {
  root: {
    marginLeft: 100,
    width: '100%',
    alignItems: 'center',
  },
};

/*
 * @const {IStackStyles} headerTopBar
 * styles for top bar of the menu section with full title of application as a link
 */
const headerTopBar: IStackStyles = {
  root: {
    width: '100%',
    height: '20',
    justifyContent: 'center',
    alignItems: 'center',
    selectors: {
      a: {
        textDecoration: 'none',
      },
    },
  },
};

/*
 * @const {IStackStyles} headerMenuLinks
 * styles for wrapper element containing page menu links from router
 */
const headerMenuLinks: IStackStyles = {
  root: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 20,
    marginRight: 10,
  },
};

/*
 * @const {IStackStyles} headerStaticLogoOvalBehind
 * styles for oval containing static nwm portal text
 */
const headerStaticLogoOvalBehind: IStackStyles = {
  root: {
    width: 100,
    height: 40,
    borderRadius: '50%',
    borderTopRightRadius: 0,
    position: 'absolute',
    right: -5,
    top: -2,
  },
};

/*
 * @const {ITextStyles} headerStaticLogo
 * styles for static title of parent application
 */
const headerStaticLogo: ITextStyles = {
  root: {
    width: 50,
    height: 30,
    textAlign: 'center',
    position: 'absolute',
    right: 20,
    top: 3,
    lineHeight: '1.1em',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

/*
 * @const {object} localPalette
 * object to hold colors for component styles that are not in the theme.palette
 */
const localPalette = {
  green: '#6ba694', //themeTertiary: '#95A66B', isn't the right color 107 166 148 (#6ba694)
  themeTertiary: '#95A66B',
  //purple: '#7369a5', //palette.themePrimary
  //yellow: 'yellow', //palette.themeSecondary
};

/*
 * @typedef {interface} HeaderProps
 * describes interface for parameters being passed into Header function
 */
export interface HeaderProps {
  baseRef: string;
  linkProps: TextLinkProps[];
  title?: {
    text?: string;
    color?: string;
  };
  headers: {
    name: string;
    description: string;
  };
  colors?: {
    headerBackground?: string;
    headerTopBar?: string;
    headerHeadingLink?: {
      name?: string;
      description?: string;
    };
    headerStaticLogo?: string;
  };
}

/*
 * @function Header
 * @param <HeaderProps> props
 * @return <JSX.Element>
 * builds out Header component
 */
function HeaderBase(props: HeaderProps): JSX.Element {
  const { name, description } = props.headers;
  const title = props.title ?? { text: '&nbsp;', color: 'transparent' };
  const palette: IPalette = getTheme().palette;
  const defaultColors = {
    headerBackground: localPalette.green,
    headerTopBar: palette.themePrimary,
    headerHeadingLink: { name: palette.themeSecondary, description: palette.black },
    headerStaticLogo: palette.themePrimary,
  };
  const colors = props.colors ? { ...defaultColors, ...props.colors } : { ...defaultColors };

  return (
    <header role={'banner'}>
      <Stack horizontal styles={header} style={{ backgroundColor: localPalette.green }}>
        <Stack.Item>
          <Text styles={headerOvalBehind} style={{ backgroundColor: colors.headerBackground }}>
            &nbsp;
          </Text>
          <Stack styles={headerOval} style={{ backgroundColor: palette.white }}>
            <Link to={Path.joinPaths(['/', props.baseRef])}>
              <Stack styles={headerHeadingLink}>
                <Text style={{ color: colors.headerHeadingLink.name }}>{name}</Text>
                <Text style={{ color: colors.headerHeadingLink.description }}>{description}</Text>
              </Stack>
            </Link>
          </Stack>
        </Stack.Item>
        <Stack.Item grow styles={headerCenter}>
          <Stack styles={headerTopBar} style={{ backgroundColor: colors.headerTopBar }}>
            <Link to="/" style={{ color: title.color }}>
              <Text as="h1">{title.text}</Text>
            </Link>
          </Stack>
          <Stack role={'nav'} styles={headerMenuLinks}>
            {linkFactory(props.linkProps)}
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Text styles={headerStaticLogoOvalBehind} style={{ backgroundColor: palette.white }}>
            &nbsp;
          </Text>
          <Text styles={headerStaticLogo} style={{ backgroundColor: palette.white, color: colors.headerStaticLogo }}>
            NWM
            <br />
            Portal
          </Text>
        </Stack.Item>
      </Stack>
    </header>
  );
}

export const Header: React.FunctionComponent<HeaderProps> = React.memo(HeaderBase);
