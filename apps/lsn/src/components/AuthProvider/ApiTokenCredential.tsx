import { GetTokenOptions, TokenCredential, AccessToken } from '@azure/identity';

export class ApiTokenCredential implements TokenCredential {
  private readonly userAccessToken: string;
  constructor(userAccessToken: string) {
    this.userAccessToken = userAccessToken;
  }
  getToken(scopes: string | string[], options?: GetTokenOptions | undefined): Promise<AccessToken | null> {
    const accessToken: AccessToken = {
      token: this.userAccessToken,
      expiresOnTimestamp: Date.now() + 60 * 60 * 1000,
    };
    return new Promise<AccessToken | null>((resolve) => {
      resolve(accessToken);
    });
  }
}
