import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { getTheme, Text } from 'office-ui-fabric-react';

type ContentCardLinkProps = {
  to: string;
};

export function ContentBoxLink(props: PropsWithChildren<ContentCardLinkProps>) {
  const { to, children } = props;
  return (
    <Link
      to={to}
      style={{
        color: getTheme().palette.themeTertiary,
        fontWeight: 'bold',
        margin: '0.25em',
      }}
    >
      <Text>{children}</Text>
    </Link>
  );
}
