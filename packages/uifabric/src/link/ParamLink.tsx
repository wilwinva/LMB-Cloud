import React, { ReactElement } from 'react';
import { ObjectValueTypes, RouteLinkableProps } from 'react-router';
import { PathBuilder, routeToTextLinkProp } from './util';
import { TextLinkProps } from './TextLink';
import { RouteLink } from './RouteLink';
import { ToolTipLink } from './tooltip';

export type ParamsLink<T extends ObjectValueTypes<T>> = (props: T) => ReactElement;
export function paramLinkFactory<T extends ObjectValueTypes<T>>(
  routeProps: RouteLinkableProps,
  pathBuilder: string | PathBuilder<T>
): ParamsLink<T> {
  return (props: T): ReactElement => {
    // validateParams(params, paramAdders);
    return typeof pathBuilder === 'string' ? (
      <RouteLink {...routeProps} />
    ) : (
      ParamLink<T>({ routeLinkableProps: routeProps, pathBuilder: pathBuilder, params: props })
    );
  };
}

export type ParamsLinkPropsBuilder<T extends ObjectValueTypes<T>> = (props: T) => TextLinkProps;
export function paramPropsBuilderFactory<T extends ObjectValueTypes<T>>(
  routeProps: RouteLinkableProps,
  pathBuilder: string | PathBuilder<T>
): ParamsLinkPropsBuilder<T> {
  return (props: T) => {
    //validateParams(params, paramAdders);
    return typeof pathBuilder === 'string'
      ? routeToTextLinkProp(routeProps)
      : paramPropsBuilder({ routeLinkableProps: routeProps, pathBuilder: pathBuilder, params: props });
  };
}

interface ParamLinkProps<T extends ObjectValueTypes<T>> {
  routeLinkableProps: RouteLinkableProps;
  pathBuilder: PathBuilder<T>;
  params: T;
}
function ParamLink<T extends ObjectValueTypes<T>>(props: ParamLinkProps<T>): ReactElement {
  const { linkText, tooltip, ...rest } = paramPropsBuilder(props);
  return (
    <ToolTipLink toolTipContent={tooltip} {...rest}>
      {linkText}
    </ToolTipLink>
  );
}

function paramPropsBuilder<T extends ObjectValueTypes<T>>(props: ParamLinkProps<T>): TextLinkProps {
  const { routeLinkableProps, pathBuilder, params } = props;
  return {
    linkText: routeLinkableProps.linkText,
    tooltip: routeLinkableProps.tooltip,
    to: pathBuilder(params),
    ...routeLinkableProps.custom,
  };
}
