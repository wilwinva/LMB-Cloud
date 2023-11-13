import useLinks from './useLinks';
import { RoutableLinks } from '../../Routes';

type RouteKey = {
  [K in keyof RoutableLinks]: RoutableLinks[K] extends HasDataset<K, RoutableLinks[K]> ? K : never;
}[keyof RoutableLinks];
type Route = { [K in RouteKey]: RoutableLinks[K] }[RouteKey];
type HasDataset<K extends keyof RoutableLinks, T extends RoutableLinks[K]> = T extends { dtnModels: infer R }
  ? T
  : never;

export default function useDtnModelLinkStrict<K extends RouteKey>(appName: K) {
  const links = useLinks();

  return links[appName].dtnModel;
}

export function useDtnModelLink(key?: string) {
  const links = useLinks();
  const lowerKey = key?.toLowerCase();

  if (isRouteKey(links, lowerKey)) {
    return links[lowerKey].dtnModel;
  }
}

function isRouteKey(links: any, key?: string): key is RouteKey {
  if (!key) {
    return false;
  }

  const appLinks: any = links[key.toLowerCase()];

  return !!(appLinks && appLinks.dtnModel !== undefined);
}
