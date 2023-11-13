import { AuthResponse } from 'msal';

export interface ApiToken {
  host: string;
  scope?: string[] | undefined;
  authResponse?: (url: string) => Promise<AuthResponse | undefined>;
}
