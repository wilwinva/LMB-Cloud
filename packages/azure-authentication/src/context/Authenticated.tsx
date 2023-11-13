import React from 'react';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiToken } from './ApiToken';
import { Account } from 'msal';

export interface AxiosDelegator {
  request<T>(axiosRequestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

export interface Authenticated {
  isAuthenticated: boolean;
  apiTokens: ApiToken[];
  userAccount: Account;
  request: <T extends {}>(apiToken: ApiToken, axiosRequestConfig: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}

export const defaultAuthenticated: Authenticated = {
  isAuthenticated: false,
  apiTokens: [],
  request: async <T extends {}>(_apiToken: ApiToken, axiosRequestConfig: AxiosRequestConfig) => {
    return axios.request<T>(axiosRequestConfig);
  },
  userAccount: {
    accountIdentifier: '',
    homeAccountIdentifier: '',
    userName: '',
    idToken: {},
    name: '',
    idTokenClaims: {},
    sid: '',
    environment: '',
  },
};

export const AuthenticatedContext = React.createContext(defaultAuthenticated);
