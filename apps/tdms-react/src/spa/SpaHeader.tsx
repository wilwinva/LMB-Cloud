import React from 'react';
import Help from './help/Help';
import AppHeader, { APP_HEADER_ROUTE_CONFIG } from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';

export const SPA_HEADER_ROUTE_CONFIG_MAP = {
  ...APP_HEADER_ROUTE_CONFIG,
  help: { path: 'help', element: <Help />, linkText: 'Help!', parameters: {} },
};
export const SPA_HEADER_ROUTE_CONFIG = routesToTextLinksProps(SPA_HEADER_ROUTE_CONFIG_MAP);

export interface SpaHeaderProps {
  baseRef: string;
}
export default function SpaHeader(props: SpaHeaderProps) {
  return (
    <AppHeader
      {...props}
      headers={{ name: 'SPA', description: 'System Performance Assessment' }}
      linkProps={SPA_HEADER_ROUTE_CONFIG}
    />
  );
}
