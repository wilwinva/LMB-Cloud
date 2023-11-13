import { RouteLinkableProps } from 'react-router';
import React from 'react';
import { ToolTipLink } from './tooltip';

export function RouteLink(props: RouteLinkableProps) {
  const { linkText, path, tooltip, ...rest } = props;

  return (
    <ToolTipLink to={props.path || ''} toolTipContent={tooltip} {...rest}>
      {linkText}
    </ToolTipLink>
  );
}
