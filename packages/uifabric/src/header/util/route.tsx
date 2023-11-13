import { TextLinkProps } from '../../link';
import { HeaderLink } from '../../link';
import { RouteLinkableProps } from 'react-router';
import React from 'react';

//todo -- replace these with links context props
export function linkFactory(props: TextLinkProps[]) {
  return props.map((prop, index) => <HeaderLink key={index} index={index} {...prop} />);
}

export function toHeaderLinkProps(routeProps: RouteLinkableProps[]): TextLinkProps[] {
  return routeProps.map((route) => Object.assign({ ...route, to: route.path }));
}
