import React from 'react';
import { Account } from 'msal';

export interface Authenticated {
  getAccessToken: (scopes: string[]) => Promise<string>;
  user: { bearerToken: string; account: Account };
}

export const defaultAuthenticated: Authenticated = {
  getAccessToken: (scopes: string[]): Promise<string> => {
    return new Promise<string>((resolve) => {
      resolve();
    });
  },
  user: {
    bearerToken: '',
    account: {
      accountIdentifier: '',
      homeAccountIdentifier: '',
      userName: '',
      idToken: {},
      name: '',
      idTokenClaims: {},
      sid: '',
      environment: '',
    },
  },
};

export const AuthenticationContext = React.createContext(defaultAuthenticated);
