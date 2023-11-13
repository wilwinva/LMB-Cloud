import { useContext } from 'react';
import { LinkContext, RouteConfigMap } from '../../Routes';
import { TextLinksMap } from '@nwm/uifabric';

export type RoutableApp = {
  [K in keyof TextLinksMap<RouteConfigMap>]: TextLinksMap<RouteConfigMap>[K];
};

export type RoutableAppKey = keyof TextLinksMap<RouteConfigMap>;

export default function useLinks() {
  return useContext(LinkContext);
}
