import React from 'react';
import Help from './help/Help';
import AppHeader, { APP_HEADER_ROUTE_CONFIG } from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';
import { TodoPlaceholder } from '@nwm/util';
import SepDtnModel from './SepDtnModel';

export const SEP_HEADER_ROUTE_CONFIG_MAP = {
  sepdat: {
    path: 'dataset',
    element: <SepDtnModel />,
    linkText: 'Sep Data',
    parameters: { tdifId: '' },
  },
  search: { path: 'search', element: <TodoPlaceholder />, linkText: 'Search', parameters: {} },
  maint: { ...APP_HEADER_ROUTE_CONFIG.maint },
  help: { path: 'help', element: <Help />, linkText: 'Help!', parameters: {} },
};
export const SEP_HEADER_ROUTE_CONFIG = routesToTextLinksProps(SEP_HEADER_ROUTE_CONFIG_MAP);

export interface SepHeaderProps {
  baseRef: string;
}
export default function SepHeader(props: SepHeaderProps) {
  return (
    <AppHeader
      {...props}
      headers={{ name: 'SEP', description: 'Site & Engineering Properties' }}
      linkProps={SEP_HEADER_ROUTE_CONFIG}
    />
  );
}
