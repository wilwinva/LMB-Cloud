declare module 'react-router' {
  import { Context, Provider, ReactElement, ReactNode } from 'react';
  import * as H from 'history';
  import { Location, LocationState, MemoryHistory } from 'history';
  import { LinkProps } from 'react-router-dom';
  //TODO -- upgrade from react-router ALPHA build to react-router release when available and replace these types

  export interface LocationContextValue {
    history: MemoryHistory;
    location: Location;
    pending: boolean;
  }
  export type LocationContext = Context<LocationContextValue>;

  export interface RouteContextValue<P extends RouteProps = RouteProps> {
    outlet: ReactElement;
    params: { [index: string]: string };
    pathname: string;
    route: P; //test if this is props or the jsx element
  }
  export type RouteContext = Context<LocationContextValue>;

  export interface RouterProps {
    children?: ReactNode;
    history?: MemoryHistory;
    timeout?: number;
  }
  export type Router = (props: RouterProps) => Provider<LocationContextValue>;

  export interface MemoryRouterProps {
    children?: ReactNode;
    timeout: number;
    initialEntries?: H.LocationDescriptor[];
    initialIndex?: number;
  }
  export function MemoryRouter(props: MemoryRouterProps): ReactElement;

  type DefaultRouteProps = RouteProps<RouteProps>;
  export interface RouteProps<T extends RouteProps = DefaultRouteProps> {
    children?: T[] | { [key: string]: T };
    element?: ReactElement; //todo -- can / should these use generics?
    path?: string;
  }

  export type ParametersFunction = (...params: string[]) => string;
  /** Note: There is currently no 'exact' in typescript, so this can only be used to determine that at least these keys exist. */
  export type ObjectValueTypes<T> = { [key in keyof T]: T[key] };
  export interface RouteLinkableProps extends RouteProps<RouteLinkableProps> {
    linkText: string;
    tooltip?: string;
    parameters: ObjectValueTypes<{}>; //todo -- this should be optional, bit of pain with types, but important
    custom?: Partial<LinkProps>;
  }

  export interface IndexableRouteLinkableProps extends Omit<RouteLinkableProps, 'children'> {
    children?: { [key: string]: IndexableRouteLinkableProps };
  }

  //todo -- test if extra props are actually passed down, looks like they might be removed, in which case generic not needed
  export function Route<P extends RouteProps = RouteProps>(props: P): ReactElement;

  export interface RoutesProps {
    basename?: string;
    caseSensitive?: boolean;
    children?: ReactNode;
  }
  export function Routes(props: RoutesProps): JSX.Element;

  export type To = string | { pathname: string; search?: string; hash?: string };

  export interface NavigateProps {
    to: To;
    replace?: boolean;
    state?: LocationState; //todo -- does locationstate need to work with generics?
  }
  export function Navigate(props: NavigateProps): ReactElement;
  export function useNavigate(): (to: To, props?: { replace?: boolean; state?: LocationState }) => void;

  export interface RedirectProps {
    from: string;
    to: To;
  }
  export type RedirectPropsStrict = Exclude<RedirectProps, 'children'>;
  export function Redirect(props: RedirectPropsStrict): ReactElement;

  export function Outlet(): ReactElement;
  export function useOutlet(): ReactElement;

  export function createRoutesFromChildren(children: ReactElement): RouteLinkableProps[];

  export function matchRoutes<P extends RouteProps = RouteProps>(
    routes: P[],
    location: Location,
    basename?: string,
    caseSensitive?: boolean
  ): ReactElement | null;

  export function useRoutes<P extends RouteProps = RouteProps>(
    routes: P[],
    basename?: string,
    caseSensitive?: boolean
  ): ReactElement | null;

  //todo - can this be smarter? matched route with path: '/users/:userId' would have params {userId: string}
  export function useParams(): { [index: string]: string };

  //todo -- add rest of the exported object types
}
