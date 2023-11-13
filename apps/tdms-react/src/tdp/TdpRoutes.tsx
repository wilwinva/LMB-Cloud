import React from 'react';
import { App } from '@nwm/uifabric';
import TdpHeader, { TDP_HEADER_ROUTE_CONFIG_MAP } from './TdpHeader';
import Index from './Index';
import TdpAliasesTable from './TdpAliasesTable';
import TdpAttributesTable from './TdpAttributesTable';
import TdpParametersTable from './TdpParametersTable';
import TdpKeywordTable from './TdpKeywordTable';

export type TdpRouteConfigMap = typeof TDP_ROUTE_CONFIG_MAP;
export const TDP_ROUTE_CONFIG_MAP = {
  tdp: {
    path: 'tdp/*',
    parameters: {},
    element: <App headerElement={<TdpHeader baseRef={'tdp'} />} />,
    linkText: 'TDP',
    children: {
      index: { path: '*', element: <Index />, linkText: 'TDP', parameters: {} },
      keyword: {
        path: 'search/keyword/:query',
        element: <TdpKeywordTable />,
        linkText: 'TDP by keyword',
        parameters: { query: '' },
      },
      parameters: {
        path: 'parameters',
        element: <TdpParametersTable />,
        linkText: 'Parameter List',
        parameters: {},
      },
      aliases: {
        path: 'aliases',
        element: <TdpAliasesTable />,
        linkText: 'Aliases List',
        parameters: {},
      },
      attributes: {
        path: 'attributes',
        element: <TdpAttributesTable />,
        linkText: 'Attribute List',
        parameters: {},
      },
      ...TDP_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
