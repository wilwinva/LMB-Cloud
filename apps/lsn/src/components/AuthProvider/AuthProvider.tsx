import React, { PropsWithChildren } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import { AuthType, useAuth } from './useAuth';

export default function AuthProvider(props: PropsWithChildren<any>) {
  const auth: AuthType = useAuth();

  if (!auth.loading && auth.isAuthenticated && auth.userAccount) {
    return (
      <AuthenticationContext.Provider
        value={{
          user: { bearerToken: auth.accessToken, account: auth.userAccount },
          getAccessToken: auth.getAccessToken,
        }}
      >
        {props.children}
      </AuthenticationContext.Provider>
    );
  } else if (!auth.loading && !auth.isAuthenticated) {
    return <div>Could not authenticate. {auth.errorMessage}</div>;
  }
  return <div>Loading Auth...</div>;
}
