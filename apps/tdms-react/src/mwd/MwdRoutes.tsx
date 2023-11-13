import React from 'react';
import { App } from '@nwm/uifabric';
import MwdHeader, { MWD_HEADER_ROUTE_CONFIG_MAP } from './MwdHeader';
import Disruptive from './Disruptive';
import DtnModels from './DtnModels';
import Biosphere from './Biosphere';
import Index from './Index';
import MwdParameter from './MwdParameter';
import MwdKeyword from './MwdKewyword';
import MwdDataSetPage from './MwdDataSetPage';
import DirectoryView from '../components/directoryView/DirectoryView';

export type MwdRouteConfigMap = typeof MWD_ROUTE_CONFIG_MAP;
export const MWD_ROUTE_CONFIG_MAP = {
  mwd: {
    path: 'mwd/*',
    parameters: {},
    element: <App headerElement={<MwdHeader baseRef={'mwd'} />} />,
    linkText: 'MWD',
    tooltip: 'Model Warehouse Data',
    children: {
      biosphere: {
        path: 'biosphere',
        element: <Biosphere />,
        linkText: 'Biosphere Modeling Data',
        parameters: {},
      },
      disruptive: {
        path: 'disruptive',
        element: <Disruptive />,
        linkText: 'Disruptive Events Modeling Data',
        parameters: {},
      },
      dtnModels: {
        path: 'dtnModels',
        element: <DtnModels />,
        linkText: 'All modeling data sorted by DTN',
        parameters: {},
      },
      dtnModel: {
        path: 'dtnModels/:tdifId',
        element: <MwdDataSetPage />,
        linkText: 'MWD data model by DS',
        parameters: { tdifId: '' },
      },
      parameter: {
        path: 'search/parameter/:tdifId',
        element: <MwdParameter />,
        linkText: 'MWD data model by parameter',
        parameters: { detailId: '' },
      },
      keyword: {
        path: 'search/keyword/:tdifId',
        element: <MwdKeyword />,
        linkText: 'MWD data model by keyword',
        parameters: { detailId: '' },
      },
      directory: {
        path: 'directory',
        element: <DirectoryView />,
        linkText: 'Directory view for MWD',
        parameters: {},
      },
      index: { path: '*', element: <Index />, linkText: 'MWD', parameters: {} },
      ...MWD_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
