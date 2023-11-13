import { Configuration } from 'msal';
import { ApiToken } from './ApiToken';

export interface MsalConfig {
  configuration: Configuration;
  apiTokens: ApiToken[];
}
