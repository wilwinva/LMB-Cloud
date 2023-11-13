import React from 'react';
import Help from './help/Help';
import AppHeader, { APP_HEADER_ROUTE_CONFIG } from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';

export const GI_HEADER_ROUTE_CONFIG_MAP = {
  ...APP_HEADER_ROUTE_CONFIG,
  help: { path: 'help', element: <Help />, linkText: 'Help!', parameters: {} },
};
export const GI_HEADER_ROUTE_CONFIG = routesToTextLinksProps(GI_HEADER_ROUTE_CONFIG_MAP);

export interface GiHeaderProps {
  baseRef: string;
}
export default function GiHeader(props: GiHeaderProps) {
  return (
    <AppHeader
      {...props}
      headers={{ name: 'GI', description: 'Geographic Information' }}
      linkProps={GI_HEADER_ROUTE_CONFIG}
    />
  );
}
