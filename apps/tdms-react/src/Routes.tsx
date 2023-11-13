import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import Index from './tdms/Index';
import { App, buildLinks, flattenRouteMap } from '@nwm/uifabric';
import { TDMS_ROUTE_CONFIG_MAP } from './tdms/TdmsRoutes';
import TdmsHeader, { TDMS_HEADER_ROUTE_CONFIG_MAP } from './tdms/TdmsHeader';
import { ATDT_ROUTE_CONFIG_MAP } from './atdt/AtdtRoutes';
import { GI_ROUTE_CONFIG_MAP } from './gi/GiRoutes';
import { MWD_ROUTE_CONFIG_MAP } from './mwd/MwdRoutes';
import { SPA_ROUTE_CONFIG_MAP } from './spa/SpaRoutes';
import { SEP_ROUTE_CONFIG_MAP } from './sep/SepRoutes';
import { TDP_ROUTE_CONFIG_MAP } from './tdp/TdpRoutes';

const ROOT_ROUTES = {
  root: {
    path: '/*',
    parameters: {},
    element: <App headerElement={<TdmsHeader baseRef={'tdms'} />} />, //todo -- add keys to elements and test remounting
    linkText: 'Home',
    children: {
      main: { element: <Index />, linkText: 'TDMS', parameters: {} },
      ...TDMS_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};

export type RouteConfigMap = typeof ROOT_ROUTE_CONFIG_MAP;
export const ROOT_ROUTE_CONFIG_MAP = {
  ...TDMS_ROUTE_CONFIG_MAP, //todo -- don't allow apps to silently overwrite each other... symbols?
  ...ATDT_ROUTE_CONFIG_MAP, //todo -- add remaining apps back in
  ...GI_ROUTE_CONFIG_MAP,
  ...MWD_ROUTE_CONFIG_MAP,
  ...SEP_ROUTE_CONFIG_MAP,
  ...SPA_ROUTE_CONFIG_MAP,
  ...TDP_ROUTE_CONFIG_MAP,
  ...ROOT_ROUTES,
};

const LINKS = buildLinks(ROOT_ROUTE_CONFIG_MAP);
export const LinkContext = React.createContext(LINKS);
export type RoutableLinks = typeof LINKS;

export const ROOT_ROUTE_CONFIG = flattenRouteMap(ROOT_ROUTE_CONFIG_MAP);

export function AppRoutes() {
  return useRoutes(ROOT_ROUTE_CONFIG);
}

export default function RootRoutes() {
  return (
    <BrowserRouter>
      <LinkContext.Provider value={LINKS}>
        <AppRoutes />
      </LinkContext.Provider>
    </BrowserRouter>
  );
}
