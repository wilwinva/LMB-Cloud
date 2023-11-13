declare module 'react-router-dom' {
  import React, { CSSProperties, HTMLAttributes, LinkHTMLAttributes, ReactElement, ReactNode } from 'react';
  import { BrowserHistoryBuildOptions } from 'history/createBrowserHistory';
  import { HashHistoryBuildOptions, LocationState } from 'history';
  import { To } from 'react-router';
  //TODO -- upgrade from react-router ALPHA build to react-router release when available and replace these types

  export * from 'react-router';

  export interface BrowserRouterProps {
    children?: ReactNode;
    timeout?: number;
    window?: BrowserHistoryBuildOptions;
  }
  export function BrowserRouter(props: BrowserRouterProps): ReactElement;

  export interface HashRouterProps {
    children?: ReactNode;
    timeout?: number;
    window?: HashHistoryBuildOptions;
  }
  export function HashRouter(props: HashRouterProps): ReactElement;

  export interface LinkProps extends HTMLAttributes<HTMLLinkElement> {
    children?: ReactNode;
    as?: ReactElement;
    onClick?: any;
    replace?: boolean;
    state?: LocationState; //todo -- this probably needs smarter typing
    target?: string;
    to: To;
  }
  export function Link(props: LinkProps): ReactElement;

  export interface NavLinkProps extends LinkProps {
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true';
    activeClassName?: string;
    activeStyle?: React.CSSProperties;
    className?: string;
    style?: React.CSSProperties;
  }
  export function NavLink(props: NavLinkProps): ReactElement;

  export interface PromptProps {
    message?: string;
    when?: boolean;
  }
  export function Prompt(props: PromptProps): ReactElement;

  export function usePrompt(message?: string, when?: boolean): void;
}
