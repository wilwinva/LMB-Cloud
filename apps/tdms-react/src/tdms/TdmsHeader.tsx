import React from 'react';
import Help from './help/Help';
import AppHeader, { APP_HEADER_ROUTE_CONFIG } from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';

export const TDMS_HEADER_ROUTE_CONFIG_MAP = {
  ...APP_HEADER_ROUTE_CONFIG,
  help: { path: 'help', element: <Help />, linkText: 'Help!', parameters: {} },
};
export const TDMS_HEADER_ROUTE_CONFIG = routesToTextLinksProps(TDMS_HEADER_ROUTE_CONFIG_MAP);

export interface TdmsHeaderProps {
  baseRef: string;
}
export default function TdmsHeader(props: TdmsHeaderProps) {
  return (
    <AppHeader {...props} headers={{ name: 'TDMS', description: 'Index Page' }} linkProps={TDMS_HEADER_ROUTE_CONFIG} />
  );
}
