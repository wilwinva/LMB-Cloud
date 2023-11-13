import { LinkProps } from 'react-router-dom';
import { RouteLinkablePropsMap } from './util/route';
import { IndexableRouteLinkableProps, ObjectValueTypes } from 'react-router';
import { cleansePath, fullPathBuilderFactory, PathBuilder, pathBuilderFactory } from './util/path';
import { getValidParamAdders, ParamAdder } from './util/params';
import { paramLinkFactory, paramPropsBuilderFactory, ParamsLink, ParamsLinkPropsBuilder } from './ParamLink';

export type TextLinkProps = {
  linkText: string;
  tooltip?: string;
} & LinkProps;

export type TextLinksMap<T extends RouteLinkablePropsMap, ParentRouteParameters extends {} = {}> = {
  [K in keyof T]: TextLinkParent<T[K], ParentRouteParameters, Pick<T[K], 'parameters'>['parameters']>;
};

//todo -- parameters should be optional, bit of pain with types, but important
//todo -- allow calling params objects with undefined when no props are required
export interface TextLink<
  GlobalRouteParameters extends ObjectValueTypes<GlobalRouteParameters>,
  ChildRouteParameters extends ObjectValueTypes<ChildRouteParameters>
> {
  fullPath: PathBuilder<GlobalRouteParameters>;
  relativeLink: ParamsLink<ChildRouteParameters>;
  relativeTextLinkProps: ParamsLinkPropsBuilder<ChildRouteParameters>;
  globalLink: ParamsLink<GlobalRouteParameters>;
  globalTextLinkProps: ParamsLinkPropsBuilder<GlobalRouteParameters>;
}

export type TextLinkParent<
  T extends IndexableRouteLinkableProps,
  ParentRouteParameters extends ObjectValueTypes<ParentRouteParameters>,
  ChildRouteParameters extends ObjectValueTypes<ChildRouteParameters>,
  GlobalRouteParameters extends ParentRouteParameters & ChildRouteParameters = ParentRouteParameters &
    ChildRouteParameters
> = T['children'] extends RouteLinkablePropsMap
  ? TextLink<GlobalRouteParameters, ChildRouteParameters> & TextLinksMap<T['children'], GlobalRouteParameters>
  : TextLink<GlobalRouteParameters, ChildRouteParameters>;

export function buildLinks<
  T extends RouteLinkablePropsMap,
  ParentRouteParameters extends ObjectValueTypes<ParentRouteParameters> = {}
>(routePropMap: T): TextLinksMap<T, ParentRouteParameters> {
  //todo -- types
  return Object.entries(routePropMap).reduce<TextLinksMap<any>>((acc, props) => buildLinkReducer(acc, props), {});
}

const buildLinkReducer = <
  T extends RouteLinkablePropsMap,
  ParentRouteParameters extends ObjectValueTypes<ParentRouteParameters> = {},
  ChildRouteParameters extends ObjectValueTypes<T['parameters']> = T['parameters'],
  GlobalRouteParameters extends ParentRouteParameters & ChildRouteParameters = ParentRouteParameters &
    ChildRouteParameters
>(
  acc: TextLinksMap<any>, //todo -- types
  routePropsEntry: [string, IndexableRouteLinkableProps],
  parentPath?: PathBuilder<ParentRouteParameters>
) => {
  const [routeName, routeProps] = routePropsEntry;
  const path = routeProps.path || '';

  type TextLinkChildren = Pick<typeof routeProps, 'children'>['children'];

  const paramAdders: ParamAdder<ChildRouteParameters>[] | null = getValidParamAdders<ChildRouteParameters>(path);
  const pathBuilder = pathBuilderFactory<ChildRouteParameters>(paramAdders === null ? cleansePath(path) : paramAdders);
  const fullPathBuilder = fullPathBuilderFactory<ChildRouteParameters, ParentRouteParameters>(
    paramAdders || cleansePath(path),
    parentPath
  );

  const children =
    routeProps.children !== undefined
      ? Object.entries(routeProps.children).reduce<TextLinksMap<any>>(
          (childAcc, childProps) => buildLinkReducer(childAcc, childProps, fullPathBuilder),
          {}
        )
      : undefined;

  acc[routeName] = {
    fullPath: fullPathBuilder,
    relativeLink: paramLinkFactory<ChildRouteParameters>(routeProps, pathBuilder),
    relativeTextLinkProps: paramPropsBuilderFactory<ChildRouteParameters>(routeProps, pathBuilder),
    globalLink: paramLinkFactory<GlobalRouteParameters>(routeProps, fullPathBuilder),
    globalTextLinkProps: paramPropsBuilderFactory<GlobalRouteParameters>(routeProps, fullPathBuilder),
    ...children,
  };

  return acc;
};
