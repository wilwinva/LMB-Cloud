import { IndexableRouteLinkableProps, RouteLinkableProps } from 'react-router';
import { TextLinkProps } from '../TextLink';
import { RouteLink } from '../RouteLink';

export interface RouteLinkablePropsMap {
  [key: string]: IndexableRouteLinkableProps;
}

//todo -- is this needed? what happens if parameters is optional on RouteLinkableProps?
export interface RouteLinkableComponentProps extends Omit<RouteLinkableProps, 'parameters' | 'children'> {
  children?: RouteLinkableComponentProps[];
}
export function flattenRouteMap(propMap: RouteLinkablePropsMap): RouteLinkableComponentProps[] {
  return Object.values(propMap).reduce((acc, props) => {
    const { parameters, ...cProps } = props;
    const route: RouteLinkableComponentProps = {
      ...cProps,
      children: props.children ? flattenRouteMap(props.children) : undefined,
    };
    acc.push(route);
    return acc;
  }, [] as RouteLinkableComponentProps[]);
}

export function routesToLinks(routesProps: RouteLinkableProps[]) {
  return routesProps.map(RouteLink);
}

export function routeToTextLinkProp(routeProps: RouteLinkableProps): TextLinkProps {
  return { to: routeProps.path || '', linkText: routeProps.linkText, ...routeProps.custom };
}

export function routesToTextLinksProps(routesProps: RouteLinkableProps[] | RouteLinkablePropsMap): TextLinkProps[] {
  return Array.isArray(routesProps) ? routesProps.map(routeToTextLinkProp) : routeMapToTextLinksProps(routesProps);
}

export function routeMapToTextLinksProps(routesPropsMap: RouteLinkablePropsMap): TextLinkProps[] {
  const reducer = (acc: TextLinkProps[], routeProps: IndexableRouteLinkableProps) => {
    acc.push({
      ...routeProps,
      ...routeProps.custom,
      to: routeProps.path || '',
      children: routeProps.children !== undefined ? routeMapToTextLinksProps(routeProps.children) : routeProps.children,
    });
    return acc;
  };

  return Object.values(routesPropsMap).reduce(reducer, []);
}
