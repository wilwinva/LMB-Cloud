import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from 'react-router';
import Index from './lsn/Index';
import { App, buildLinks, flattenRouteMap } from '@nwm/uifabric';
import { LSN_ROUTE_CONFIG_MAP } from './lsn/LsnRoutes';
import LsnHeader, { LSN_HEADER_ROUTE_CONFIG_MAP } from './lsn/LsnHeader';
import { WORKFLOW_ROUTE_CONFIG_MAP } from './workflow/WorkFlowRoutes';

const ROOT_ROUTES = {
  root: {
    path: '/*',
    parameters: {},
    element: <App headerElement={<LsnHeader baseRef={'lsn'} />} />, //todo -- add keys to elements and test remounting
    linkText: 'Home',
    children: {
      main: { element: <Index />, linkText: 'LSN', parameters: {} },
      ...LSN_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};

export type RouteConfigMap = typeof ROOT_ROUTE_CONFIG_MAP;
export const ROOT_ROUTE_CONFIG_MAP = {
  ...LSN_ROUTE_CONFIG_MAP, //todo -- don't allow apps to silently overwrite each other... symbols?
  ...WORKFLOW_ROUTE_CONFIG_MAP, //todo -- add remaining apps back in
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
