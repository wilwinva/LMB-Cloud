import React from 'react';
import Help from './help/Help';
import AppHeader, { APP_HEADER_ROUTE_CONFIG } from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';

export const MWD_HEADER_ROUTE_CONFIG_MAP = {
  ...APP_HEADER_ROUTE_CONFIG,
  help: { path: 'help', element: <Help />, linkText: 'Help!', parameters: {} },
};
export const MWD_HEADER_ROUTE_CONFIG = routesToTextLinksProps(MWD_HEADER_ROUTE_CONFIG_MAP);

export interface MwdHeaderProps {
  baseRef: string;
}
export default function MwdHeader(props: MwdHeaderProps) {
  return (
    <AppHeader
      {...props}
      headers={{ name: 'MWD', description: 'Model Warehouse Data' }}
      linkProps={MWD_HEADER_ROUTE_CONFIG}
    />
  );
}
