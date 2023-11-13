import React from 'react';
import { App } from '@nwm/uifabric';
import SpaHeader, { SPA_HEADER_ROUTE_CONFIG_MAP } from './SpaHeader';
import CountyData from './CountyData';
import Index from './Index';
import UniversityData from './UniversityData';
import SpaDtn from './SpaDtn';
import SpaDataSetPage from './SpaDataSetPage';
import SpaParameter from './SpaParameter';
import SpaKeyword from './SpaKewyword';
import DirectoryView from '../components/directoryView/DirectoryView';

export type SpaRouteConfigMap = typeof SPA_ROUTE_CONFIG_MAP;
export const SPA_ROUTE_CONFIG_MAP = {
  spa: {
    path: 'spa/*',
    parameters: {},
    element: <App headerElement={<SpaHeader baseRef={'spa'} />} />,
    linkText: 'SPA',
    tooltip: 'System Performance Assessment',
    children: {
      county: { path: 'county', element: <CountyData />, linkText: 'Nye County Oversight Data', parameters: {} },
      university: {
        path: 'university',
        element: <UniversityData />,
        linkText: 'University and Community College System of Nevada Oversight Data',
        parameters: {},
      },
      dtnModels: {
        path: 'dtnModels',
        element: <SpaDtn />,
        linkText: 'All SPA data sorted by DTN',
        parameters: {},
      },
      dtnModel: {
        path: 'dtnModels/:tdifId',
        element: <SpaDataSetPage />,
        linkText: 'Dataset',
        parameters: { tdifId: '' },
      },
      parameter: {
        path: 'search/parameter/:tdifId',
        element: <SpaParameter />,
        linkText: 'SPA data model by parameter',
        parameters: { detailId: '' },
      },
      keyword: {
        path: 'search/keyword/:tdifId',
        element: <SpaKeyword />,
        linkText: 'SPA data model by keyword',
        parameters: { detailId: '' },
      },
      directory: {
        path: 'directory',
        element: <DirectoryView />,
        linkText: 'Directory view for SPA',
        parameters: {},
      },
      index: { path: '*', element: <Index />, linkText: 'SPA', parameters: {} },
      ...SPA_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
