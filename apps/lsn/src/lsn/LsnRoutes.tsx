import React from 'react';
import Index from './Index';
import LsnHeader, { LSN_HEADER_ROUTE_CONFIG_MAP } from './LsnHeader';
import { App } from '@nwm/uifabric';

export type LsnRouteConfigMap = typeof LSN_ROUTE_CONFIG_MAP;
export const LSN_ROUTE_CONFIG_MAP = {
  lsn: {
    path: 'lsn/*',
    parameters: {},
    element: <App headerElement={<LsnHeader baseRef={'lsn'} />} />,
    linkText: 'LSN',
    children: {
      main: { path: '*', element: <Index />, linkText: 'LSN', parameters: {} },
      ...LSN_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
