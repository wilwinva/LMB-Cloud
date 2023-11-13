import React from 'react';
import { MsalConfig } from './MsalConfig';
import { UserAgentApplication, AuthenticationParameters } from 'msal';
import { Facade } from '@nwm/util';
import { AuthenticationConsumer } from './AuthenticationConsumer';

export type FakedUserAgentApplication =
  | 'loginPopup'
  | 'acquireTokenSilent'
  | 'getAccount'
  | 'ssoSilent'
  | 'loginRedirect'
  | 'acquireTokenPopup';

export interface AuthenticationProps {
  msalConfig: MsalConfig;
  facade?: Facade<UserAgentApplication, FakedUserAgentApplication> | undefined;
}

export function Authentication(props: React.PropsWithChildren<AuthenticationProps>) {
  const { msalConfig, facade, children } = props;
  if (facade) {
    return (
      <AuthenticationConsumer msalConfig={msalConfig} facade={facade!}>
        {children}
      </AuthenticationConsumer>
    );
  }
  return (
    <AuthenticationConsumer
      msalConfig={msalConfig}
      facade={(userAgentApplication: UserAgentApplication) => ({
        loginPopup: (it: AuthenticationParameters) => userAgentApplication.loginPopup(it),
        acquireTokenSilent: (it: AuthenticationParameters) => userAgentApplication.acquireTokenSilent(it),
        getAccount: () => userAgentApplication.getAccount(),
        ssoSilent: (it: AuthenticationParameters) => userAgentApplication.ssoSilent(it),
        loginRedirect: (it: AuthenticationParameters) => userAgentApplication.loginRedirect(it),
        acquireTokenPopup: (it: AuthenticationParameters) => userAgentApplication.acquireTokenPopup(it),
      })}
    >
      {children}
    </AuthenticationConsumer>
  );
}
