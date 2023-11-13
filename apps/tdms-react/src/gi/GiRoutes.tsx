import React from 'react';

import { App } from '@nwm/uifabric';
import GiHeader, { GI_HEADER_ROUTE_CONFIG_MAP } from './GiHeader';
import Index from './Index';
import GiSearchResults, { CATEGORIES } from './GiSearchResults';
import GiDtnModel from './GiDtnModel';
import DirectoryView from '../components/directoryView/DirectoryView';

export type GiRouteConfigMap = typeof GI_ROUTE_CONFIG_MAP;
export const GI_ROUTE_CONFIG_MAP = {
  gis: {
    path: 'gis/*',
    parameters: {},
    element: <App headerElement={<GiHeader baseRef={'gis'} />} />,
    linkText: 'GIS',
    tooltip: 'Geographic Information',
    children: {
      searchResults: {
        path: 'search/:searchType/:query',
        element: <GiSearchResults />,
        linkText: 'Search Results',
        parameters: {},
      },
      coverages: {
        path: 'search/coverages',
        element: <GiSearchResults category={CATEGORIES.coverage} />,
        linkText: 'Coverages',
        parameters: {},
      },
      mapProducts: {
        path: 'search/mapProducts',
        element: <GiSearchResults category={CATEGORIES.mapProduct} />,
        linkText: 'Map Products',
        parameters: {},
      },
      all: {
        path: 'search/all',
        element: <GiSearchResults category={CATEGORIES.all} />,
        linkText: 'All GIS Products',
        parameters: {},
      },
      dtnModel: {
        path: 'dtnModels/:tdifId',
        element: <GiDtnModel />,
        linkText: 'Data Set',
        parameters: { tdifId: '' },
      },
      directory: {
        path: 'directory',
        element: <DirectoryView />,
        linkText: 'Directory view for MWD',
        parameters: {},
      },
      index: { path: '*', element: <Index />, linkText: 'GI', parameters: {} },
      ...GI_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
