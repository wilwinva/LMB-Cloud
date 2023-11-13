import React from 'react';
import { Text } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import useLinks from '../../hooks/links/useLinks';

interface ITextBlock {
  textBlock: string;
}

export default function searchTextBlocks(props: ITextBlock) {
  const links = useLinks();
  const { linkText, ...atdtRouteProps } = links.atdt.globalTextLinkProps({});

  return (
    <>
      <Text>
        <p>{props.textBlock}</p>
        <Link {...atdtRouteProps}>Search the Automated Technical Data Tracking System (ATDT)</Link>
      </Text>
    </>
  );
}
