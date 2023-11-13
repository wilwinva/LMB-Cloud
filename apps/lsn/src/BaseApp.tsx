import React, { ComponentType, lazy, Suspense } from 'react';
import Routes from './Routes';
import { ApolloProvider } from '@apollo/client';
import getClient from './ApolloClient';
import 'unfetch/polyfill/index';
import { initializeIcons } from '@uifabric/icons';
import { Customizer } from 'office-ui-fabric-react';
import { appCustomizations } from './appPalette';
import { Loading } from '@nwm/util';
import AuthProvider from './components/AuthProvider/AuthProvider';

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
  fallback?: React.Component;
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
const AppComponent: React.FunctionComponent = () => {
  return (
    <Customizer {...appCustomizations}>
      <AuthProvider>
        <SuspensefulApolloProvider>
          <Routes />
        </SuspensefulApolloProvider>
      </AuthProvider>
    </Customizer>
  );
};
export const BaseApp = React.memo(AppComponent);
