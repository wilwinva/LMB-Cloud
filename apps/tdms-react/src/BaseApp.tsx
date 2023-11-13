import React, { ComponentType, lazy, Suspense } from 'react';
import RootRoutes from './Routes';
import { ApolloProvider } from '@apollo/client';
import getClient from './ApolloClient';
import { LinkInterception } from '@nwm/uifabric';
import { Loading } from '@nwm/util';
import 'unfetch/polyfill/index';
import { initializeIcons } from '@uifabric/icons';
import { Customizer } from 'office-ui-fabric-react';
import { appCustomizations } from './appPalette';
import { ApiToken, Authentication, MsalConfig } from '@nwm/azure-authentication';

initializeIcons();

interface ApolloProviderProps {}

export async function getApolloProvider(
  props: React.PropsWithChildren<ApolloProviderProps>
): Promise<{ default: ComponentType<any> }> {
  const client = await getClient();
  return {
    default: () => <ApolloProvider client={client}>{props.children}</ApolloProvider>,
  };
}

interface SuspensefulApolloProviderProps {
  fallback?: React.Component<any>;
}

function SuspensefulApolloProviderComponent(props: React.PropsWithChildren<SuspensefulApolloProviderProps>) {
  const fallback = props.fallback ? props.fallback : <Loading name={'Application'} />;
  const LazyApolloProvider = lazy(() => getApolloProvider({ children: props.children }));
  return (
    <Customizer {...appCustomizations}>
      <Suspense fallback={fallback}>
        <LazyApolloProvider />
      </Suspense>
    </Customizer>
  );
}

export const SuspensefulApolloProvider = React.memo(SuspensefulApolloProviderComponent);

export const STORAGE_API_TOKEN: ApiToken = {
  host: 'storage.azure.com',
  scope: ['https://storage.azure.com/user_impersonation'],
};

export const STORAGE_LINK_INTERCEPTION: LinkInterception = {
  isDataUrl: true,
  b: (href: string) => href.includes('ftp://'),
  baseRegex: /(ftp|http|https):\/\/.*\/pub/g,
  base: `${process.env.BLOB_STORAGE_LEGACY}/pub`,
};

export const YMP_LINK_INTERCEPTION: LinkInterception = {
  isDataUrl: false,
  b: (href: string) => href.includes('http://connect.ymp.gov'),
  baseRegex: /http:\/\/connect\.ymp\.gov.*\?/g,
  base: '',
};

export const HRC_LINK_INTERCEPTION: LinkInterception = {
  isDataUrl: false,
  b: (href: string) => href.includes('http://hrc.ymp.gov'),
  baseRegex: /http:\/\/hrc\.ymp\.gov.*\?/g,
  base: `${process.env.BLOB_STORAGE_TDMS}/`,
};

export const BYEBYE_LINK_INTERCEPTION: LinkInterception = {
  isDataUrl: false,
  b: (href: string) => href.includes('http://hrc.ymp.gov'),
  baseRegex: /http:\/\/.*\?byebye/g,
  base: `${process.env.BLOB_STORAGE_TDMS}/`,
};

export const LINK_INTERCEPTIONS: LinkInterception[] = [
  YMP_LINK_INTERCEPTION,
  HRC_LINK_INTERCEPTION,
  STORAGE_LINK_INTERCEPTION,
];

const AppComponent: React.FunctionComponent = () => {
  //todo: Put this config crap in env file
  const msalConfig: MsalConfig = {
    configuration: {
      auth: {
        clientId: '2db660c0-9512-462f-88bf-d32f03762c5f',
        authority: 'https://login.microsoftonline.com/1b544066-1920-44c1-80c9-405d504ec412',
        redirectUri: window.location.href.includes('localhost')
          ? 'https://localhost:8080'
          : 'https://tdms-development.nwm.doe.gov/',
      },
      cache: {
        cacheLocation: 'sessionStorage',
      },
    },
    apiTokens: [STORAGE_API_TOKEN],
  };
  return (
    <SuspensefulApolloProvider>
      <Authentication msalConfig={msalConfig}>
        <RootRoutes />
      </Authentication>
    </SuspensefulApolloProvider>
  );
};
export const BaseApp = React.memo(AppComponent);
