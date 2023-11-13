import React from 'react';
import { withErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Stack, Text } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import { Typescript } from '@nwm/util';

import useLinks, { RoutableApp } from '../hooks/links/useLinks';
import { searchStackItemStyles } from '../components/search/helpers';

const { keyGuard } = Typescript;

const getLinks = (links: RoutableApp) =>
  Object.entries(links.gis)
    .filter(keyGuard(links.gis, ['coverages', 'mapProducts', 'all']))
    .map(([, link]) => link.relativeLink({}))
    .map((link, idx) => <li key={idx}>{link}</li>);

const SearchIndexComponent = () => {
  const links = useLinks();
  const giLinks = getLinks(links);
  const { linkText, ...atdtRouteProps } = links.atdt.globalTextLinkProps({});

  return (
    <Stack.Item styles={searchStackItemStyles}>
      <Text variant={'large'}>Categories</Text>
      <ul>
        {giLinks}
        <li>
          <Link {...atdtRouteProps}>Search the Automated Technical Data Tracking System (ATDT)</Link>
        </li>
      </ul>
    </Stack.Item>
  );
};

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

const SearchDocument = withErrorBoundary(SearchIndexComponent, ErrorFallback);
export default SearchDocument;
