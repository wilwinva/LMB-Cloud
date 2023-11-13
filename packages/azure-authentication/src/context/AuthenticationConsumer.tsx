import React, { useEffect, useState } from 'react';
import { UserAgentApplication } from 'msal';
import { AuthenticatedContext } from './Authenticated';
import { ApiToken } from './ApiToken';
import { Facade, Loading, TodoPlaceholder } from '@nwm/util';
import axios, { AxiosRequestConfig } from 'axios';
import { MsalConfig } from './MsalConfig';
import { FakedUserAgentApplication } from './Authentication';

export interface AuthenticationConsumerProps {
  msalConfig: MsalConfig;
  facade: Facade<UserAgentApplication, FakedUserAgentApplication>;
}

interface AuthenticationState {
  isAuthenticated: boolean;
  isError: boolean;
  errorMessage?: string | undefined;
  isLoading: boolean;
  apiTokens: ApiToken[];
}

export function AuthenticationConsumer(props: React.PropsWithChildren<AuthenticationConsumerProps>) {
  const { msalConfig, facade, children } = props;
  const { configuration, apiTokens } = msalConfig;
  const [authenticationState, setAuthenticationState] = useState<AuthenticationState>({
    isAuthenticated: false,
    isError: false,
    isLoading: true,
    apiTokens: apiTokens,
  });
  const userAgentApplication = facade(new UserAgentApplication(configuration));
  const account = userAgentApplication.getAccount();
  useEffect(() => {
    if (account) {
      doSsoSilent(userAgentApplication, authenticationState).then(
        (res) => {
          console.log(res);
          setAuthenticationState({ ...res });
        },
        (err) => {
          const message = `Critical error: cannot set authentication state ${err}`;
          console.error(message);
          setAuthenticationState({
            ...authenticationState,
            errorMessage: message,
            isError: true,
            isLoading: false,
          });
        }
      );
    }
  }, []);
  const loading = <Loading name={'Authentication request'} />;
  if (!account) {
    userAgentApplication.loginRedirect({
      scopes: ['User.Read'],
    });
    return loading;
  } else if (authenticationState.isError) {
    return <TodoPlaceholder description={authenticationState.errorMessage} />;
  } else if (authenticationState.isLoading) {
    return loading;
  }
  return (
    <AuthenticatedContext.Provider
      value={{
        isAuthenticated: authenticationState.isAuthenticated,
        apiTokens: authenticationState.apiTokens,
        userAccount: account,
        request: async <T extends {}>(apiToken: ApiToken, axiosRequestConfig: AxiosRequestConfig) => {
          if (!apiToken.authResponse) {
            throw new Error('Critical error: Api token does not have auth response');
          }
          const authResponse = await apiToken.authResponse!(axiosRequestConfig.url!).then(
            (res) => res,
            (err) => {
              console.error(err);
              return undefined;
            }
          );
          if (!authResponse) {
            throw new Error(`Api token does not exist for Api ${apiToken.scope} ${apiToken.host}`);
          }
          return axios.request<T>({
            ...axiosRequestConfig,
            headers: {
              ...axiosRequestConfig.headers,
              Authorization: bearer(authResponse!.accessToken),
            },
          });
        },
      }}
    >
      {children}
    </AuthenticatedContext.Provider>
  );
}

const doSsoSilent = async (
  userAgentApplication: Pick<UserAgentApplication, FakedUserAgentApplication>,
  it: AuthenticationState
) => {
  const account = userAgentApplication.getAccount();
  console.log(account);
  const ssoResult = await userAgentApplication
    .ssoSilent({
      loginHint: account.idTokenClaims.preferred_username,
    })
    .then(
      (res) => {
        if (!res) {
          return {
            ...it,
            isError: true,
            errorMessage: 'Critical error: cannot sso',
            isLoading: false,
          };
        }
        console.debug('Doing SSO...');
        console.debug(res);
        return doAcquireTokensSilent(userAgentApplication, it);
      },
      (err) => {
        return {
          ...it,
          isError: true,
          errorMessage: `Critical error: cannot sso ${err}`,
          isLoading: false,
        };
      }
    );
  if (ssoResult.errorMessage && ssoResult.errorMessage.includes('InteractionRequiredAuthError')) {
    const account = userAgentApplication.getAccount();
    return await userAgentApplication
      .loginPopup({
        loginHint: account.idTokenClaims.preferred_username,
        scopes: ['User.Read'],
      })
      .then(
        (_res) => {
          return doAcquireTokensSilent(userAgentApplication, it).then(
            (res) => {
              return {
                ...res,
              };
            },
            (err) => {
              return {
                ...it,
                isError: true,
                errorMessage: `Critical error: cannot sso ${err}`,
                isLoading: false,
              };
            }
          );
        },
        (e) => {
          return {
            ...it,
            isError: true,
            errorMessage: `Critical error: cannot sso ${e}`,
            isLoading: false,
          };
        }
      );
  }
  return {
    ...ssoResult,
  };
};

const doAcquireTokensSilent = async (
  userAgentApplication: Pick<UserAgentApplication, FakedUserAgentApplication>,
  it: AuthenticationState
) => {
  const apiTokens: ApiToken[] = it.apiTokens.map((apiToken) => ({
    ...apiToken,
    authResponse: () => {
      return userAgentApplication
        .acquireTokenSilent({
          loginHint: userAgentApplication.getAccount().idTokenClaims.preferred_username,
          scopes: apiToken.scope,
        })
        .then(
          (res) => {
            if (!res || !res.accessToken) {
              return userAgentApplication.acquireTokenPopup({
                loginHint: userAgentApplication.getAccount().idTokenClaims.preferred_username,
                scopes: apiToken.scope,
              });
            }
            return res;
          },
          (err) => {
            if (err.name.includes('InteractionRequiredAuthError')) {
              return userAgentApplication
                .acquireTokenPopup({
                  loginHint: userAgentApplication.getAccount().idTokenClaims.preferred_username,
                  scopes: apiToken.scope,
                })
                .then((res) => ({ ...res }));
            }
            return undefined;
          }
        );
    },
  }));
  return {
    ...it,
    isError: false,
    isLoading: false,
    isAuthenticated: true,
    apiTokens: apiTokens,
  };
};
const bearer = (s: string) => `Bearer ${s}`;
