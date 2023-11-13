import React from 'react';
import AppHeader from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';

export const LSN_HEADER_ROUTE_CONFIG_MAP = {};
export const LSN_HEADER_ROUTE_CONFIG = routesToTextLinksProps(LSN_HEADER_ROUTE_CONFIG_MAP);

export interface LsnHeaderProps {
  baseRef: string;
}
export default function LsnHeader(props: LsnHeaderProps) {
  return (
    <AppHeader {...props} headers={{ name: 'LSN', description: 'Index Page' }} linkProps={LSN_HEADER_ROUTE_CONFIG} />
  );
}
