import React from 'react';
import AppHeader, { APP_HEADER_ROUTE_CONFIG } from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';
import Help from './help/help';

export const TDP_HEADER_ROUTE_CONFIG_MAP = {
  ...APP_HEADER_ROUTE_CONFIG,
  help: { path: 'help', element: <Help />, linkText: 'Help!', parameters: {} },
};
export const TDP_HEADER_ROUTE_CONFIG = routesToTextLinksProps(TDP_HEADER_ROUTE_CONFIG_MAP);

export interface TdpHeaderProps {
  baseRef: string;
}
export default function TdpHeader(props: TdpHeaderProps) {
  return (
    <AppHeader
      {...props}
      headers={{ name: 'TDP', description: 'Technical Data Parameter Dictionary' }}
      linkProps={TDP_HEADER_ROUTE_CONFIG}
    />
  );
}
