import React from 'react';
import Index from './Index';
import TdmsHeader, { TDMS_HEADER_ROUTE_CONFIG_MAP } from './TdmsHeader';
import { App } from '@nwm/uifabric';

export type TdmsRouteConfigMap = typeof TDMS_ROUTE_CONFIG_MAP;
export const TDMS_ROUTE_CONFIG_MAP = {
  tdms: {
    path: 'tdms/*',
    parameters: {},
    element: <App headerElement={<TdmsHeader baseRef={'tdms'} />} />,
    linkText: 'TDMS',
    tooltip: 'Technical Data Management Systems',
    children: {
      main: { path: '*', element: <Index />, linkText: 'TDMS', parameters: {} },
      ...TDMS_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
