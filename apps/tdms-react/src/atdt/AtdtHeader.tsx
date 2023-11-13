import React from 'react';
import AppHeader from '../components/header/AppHeader';
import Help from './help/Help';
import { routesToTextLinksProps } from '@nwm/uifabric';
import { TodoPlaceholder } from '@nwm/util';
import Maint from '../components/maint/Maint';

export const ATDT_HEADER_ROUTE_CONFIG_MAP = {
  search: { path: 'search', element: <TodoPlaceholder />, linkText: 'Search', parameters: {} },
  maint: { path: 'maint', element: <Maint />, linkText: 'Maint', parameters: {} },
  reports: { path: 'reports', element: <TodoPlaceholder />, linkText: 'Reports', parameters: {} },
  help: { path: 'help', element: <Help />, linkText: 'Help!', parameters: {} },
};
export const ATDT_HEADER_ROUTE_CONFIG = routesToTextLinksProps(ATDT_HEADER_ROUTE_CONFIG_MAP);

export interface AtdtHeaderProps {
  baseRef: string;
}
export default function AtdtHeader(props: AtdtHeaderProps) {
  return (
    <AppHeader
      {...props}
      headers={{ name: 'ATDT', description: 'Automated Technical Data Tracking' }}
      linkProps={ATDT_HEADER_ROUTE_CONFIG}
    />
  );
}
