import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { IStackItemStyles, IStackStyles, IStackTokens, SearchBox, Stack, StackItem } from 'office-ui-fabric-react';
import { INavLink, INavLinkGroup, INavStyles, Nav } from 'office-ui-fabric-react/lib/Nav';
import { useNavigate } from 'react-router';
import OmniBarResults from './OmniBarResults';
import { isNil } from 'lodash';

export interface IOmniBar {
  baseLinksList: any[];
}

const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 40,
};

const navStackStyles: IStackItemStyles = {
  root: {
    width: 300,
    paddingTop: 0,
    selectors: {
      button: {
        height: 40,
      },
      'div.ms-Nav-groupContent': {
        marginBottom: 10,
        selectors: {
          'ul li div button': {
            height: 26,
          },
          'ul li div button i': {
            height: 26,
            lineHeight: 26,
          },
        },
      },
      'button.ms-Button--command.is-disabled': {
        lineHeight: 26,
        color: '#323130',
        fontSize: 16,
      },
    },
  },
};

const searchResultsStackStyles: IStackItemStyles = {
  root: {
    paddingTop: 20,
    width: '80vw',
  },
};

const searchStackStyles: IStackStyles = {
  root: {
    width: 600,
    selectors: {
      '.ms-SearchBox': {
        borderRadius: 4,
        selectors: {
          '.ms-SearchBox-iconContainer': {
            order: 2,
          },
        },
      },
    },
  },
};

const navStyles: Partial<INavStyles> = {
  root: {},
};

interface INavLinkE extends INavLink {
  pathname?: string;
}

type LinkClickHandler = (ev?: React.MouseEvent<HTMLElement>, item?: INavLinkE) => void;

const baseNavItem = 'Standard';

const docList: object[] = [
  { children: 'Doc 1', to: '' },
  { children: 'Doc 2', to: '' },
];

const tableList: object[] = [
  { children: 'Standard', to: '' },
  { children: 'Categories', to: '' },
  { children: 'Parameters/Dates/Keywords', to: '' },
  { children: 'Data Set Status', to: '' },
  { children: 'Submittal ID', to: '' },
  { children: 'Submittal Text', to: '' },
  { children: 'Acq / Dev', to: '' },
  { children: 'Sources', to: '' },
  { children: 'Records Roadmap', to: '' },
  { children: 'Administrative', to: '' },
];

const buildLinkGroup = (linkList: object[], groupName: string, expanded: boolean, onClick: LinkClickHandler) => {
  const links: INavLinkE[] = linkList.map((link: any) => {
    const t: INavLinkE = {
      key: link.children,
      name: link.children,
      url: '',
      pathname: `/${link.children}`,
      onClick,
    };
    return t;
  });
  const linkGroup: INavLinkGroup = {
    links: [
      {
        name: groupName,
        key: groupName,
        url: '',
        expandAriaLabel: `Expand ${groupName} section`,
        collapseAriaLabel: `Collapse ${groupName} section`,
        isExpanded: expanded,
        links: links,
      },
    ],
  };
  return linkGroup;
};

function OmniBar(props: IOmniBar) {
  const { baseLinksList } = props;
  const [searchString, setSearchString] = useState<string | undefined>(
    sessionStorage.getItem('omniSearch') || undefined
  );
  const [navItem, setNavItem] = useState<string>(baseNavItem);
  const navigate = useNavigate();

  const _navOnClick = useCallback(
    (ev?: React.MouseEvent<HTMLElement>, item?: INavLinkE) => {
      if (item && item.pathname) {
        navigate(item.pathname);
      } else {
        console.error('Critical error: when navigating item is not defined');
      }
    },
    [navigate]
  );

  const _switchTableOnClick = useCallback(
    (ev?: React.MouseEvent<HTMLElement>, item?: INavLinkE) => {
      if (item && item.key) {
        setNavItem(item.key);
      } else {
        console.error('Critical error: when switching table item is not defined');
      }
    },
    [setNavItem]
  );

  const _onSearchSubmit = useCallback(
    (searchText: string) => {
      if (searchText.length > 0) {
        sessionStorage.setItem('omniSearch', searchText);
        setSearchString(searchText);
      } else {
        _onSearchClear();
      }
    },
    [setSearchString]
  );
  const _onSearchClear = useCallback(
    (_searchText?: string) => {
      sessionStorage.removeItem('omniSearch');
      setSearchString(undefined);
    },
    [setSearchString]
  );
  const _onSearchChange = useCallback(
    (_ele, _searchText?: string) => {
      sessionStorage.removeItem('omniSearch');
      setSearchString(undefined);
    },
    [setSearchString]
  );

  const showTables = !isNil(searchString);

  const baseLinksGroup: INavLinkGroup = useMemo(
    () => buildLinkGroup(baseLinksList, 'System Components', !showTables, _navOnClick),
    [baseLinksList, showTables, _navOnClick]
  );
  const docsLinksGroup: INavLinkGroup = useMemo(() => buildLinkGroup(docList, 'Docs', false, _switchTableOnClick), [
    docList,
    false,
    _switchTableOnClick,
  ]);
  const tablesLinksGroup: INavLinkGroup = useMemo(
    () => buildLinkGroup(tableList, 'Search Results By:', showTables, _switchTableOnClick),
    [tableList, showTables, _switchTableOnClick]
  );
  const navLinkGroups: INavLinkGroup[] = showTables
    ? [baseLinksGroup, docsLinksGroup, tablesLinksGroup]
    : [baseLinksGroup, docsLinksGroup];

  return (
    <Stack horizontal tokens={horizontalGapStackTokens}>
      <StackItem styles={navStackStyles}>
        <Nav
          initialSelectedKey={baseNavItem}
          styles={navStyles}
          ariaLabel="TDMS navigation panel"
          groups={navLinkGroups}
        />
      </StackItem>
      <StackItem>
        <Stack>
          <StackItem styles={searchStackStyles}>
            <SearchBox
              name={'OmniSearchBox'}
              placeholder="Search TDMS"
              onSearch={_onSearchSubmit}
              onChange={_onSearchChange}
              onClear={_onSearchClear}
              disableAnimation={true}
              value={searchString}
            />
          </StackItem>
          <StackItem styles={searchResultsStackStyles}>
            <OmniBarResults searchString={searchString} navItem={navItem} />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
}
export default React.memo(OmniBar);
