import React from 'react';
import { App } from '@nwm/uifabric';
import Index from './Index';
import SepHeader, { SEP_HEADER_ROUTE_CONFIG_MAP } from './SepHeader';
import SepDtn from './SepDtn';
import SepKeyword from './SepKeyword';
import SepParameter from './SepParameter';
import SepDtnModel from './SepDtnModel';

export type SepRouteConfigMap = typeof SEP_ROUTE_CONFIG_MAP;
export const SEP_ROUTE_CONFIG_MAP = {
  sep: {
    path: 'sep/*',
    parameters: {},
    element: <App headerElement={<SepHeader baseRef={'sep'} />} />,
    linkText: 'SEP',
    tooltip: 'Site & Engineering Properties',
    children: {
      dtnModels: {
        path: 'dtnModels',
        element: <SepDtn />,
        linkText: 'All SEP data sorted by DTN',
        parameters: {},
      },
      dtnModel: {
        path: 'dtnModel/:tdifId',
        element: <SepDtnModel />,
        linkText: 'SEP data model by DS',
        parameters: { tdifId: '' },
      },
      parameter: {
        path: 'search/parameter/:tdifId',
        element: <SepParameter />,
        linkText: 'SEP data model by parameter',
        parameters: { detailId: '' },
      },
      keyword: {
        path: 'search/keyword/:tdifId',
        element: <SepKeyword />,
        linkText: 'SEP data model by keyword',
        parameters: { detailId: '' },
      },
      index: { path: '*', element: <Index />, linkText: 'SEP', parameters: {} },
      ...SEP_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
