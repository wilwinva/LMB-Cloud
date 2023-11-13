import { useEffect, useState } from 'react';
import { UserAgentApplication } from 'msal';
import { msalConfig, loginRequest, servicePrincipalScope } from './msal/MsalConfig';
import { Account } from 'msal';

export const msalAuth = new UserAgentApplication(msalConfig);

export type AuthType = {
  userAccount: Account | undefined;
  accessToken: string;
  getAccessToken: (scopes: string[]) => Promise<string>;
  isAuthenticated: boolean;
  loading: boolean;
  error: boolean;
  errorMessage: string;
};

export function useAuth(): AuthType {
  const [userAccount, setUserAccount] = useState<Account>();
  const [accessToken, setAccessToken] = useState<string>('');
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async function login() {
      setLoading(true);
      try {
        // Login via popup
        await msalAuth
          .loginPopup({
            scopes: loginRequest.scopes,
          })
          .then(() => {
            setisAuthenticated(true);
            setLoading(false);
            setUserAccount(msalAuth.getAccount());
            getAccessToken([servicePrincipalScope]).then((result) => {
              setAccessToken(result);
            });
          });
      } catch (err) {
        console.log(err);
        setLoading(false);
        setisAuthenticated(false);
        setError(true);
        setErrorMessage(err);
      }
    })();
  }, []);

  return { userAccount, accessToken, getAccessToken, isAuthenticated, loading, error, errorMessage };
}

/*
 * I'm returning this function because I need a way to request a token on a per API (scope)
 * basis. For example, I might want a token for the storage API or KeyVault API. According to the MSDocs
 * you can only request a single API token at a time. It was a bit confusing because you can Auth with as many
 * scopes as you want but that's only providing users with a consent to those scopes, not the actual token
 *
 * A good use case is the page where I need access to a storage account on a user's behalf.
 * We'd simply call use AuthenticationContext.getAccessToken('<storageAPIScore>') to retrieve a token
 * for requests to the storage Account
 * */
async function getAccessToken(scopes: string[]): Promise<string> {
  try {
    // Get the access token silently
    // If the cache contains a non-expired token, this function
    // will just return the cached token. Otherwise, it will
    // make a request to the Azure OAuth endpoint to get a token
    const silentResult = await msalAuth.acquireTokenSilent({
      scopes: scopes,
    });
    console.log('aquired token');
    return silentResult.accessToken;
  } catch (err) {
    console.log(err);
    // If a silent request fails, it may be because the user needs
    // to login or grant consent to one or more of the requested scopes
    if (isInteractionRequired(err)) {
      const interactiveResult = await msalAuth.acquireTokenPopup({
        scopes: scopes,
      });

      return interactiveResult.accessToken;
    } else {
      throw err;
    }
  }
}

function isInteractionRequired(error: Error): boolean {
  if (!error.message || error.message.length <= 0) {
    return false;
  }

  return (
    error.message.indexOf('consent_required') > -1 ||
    error.message.indexOf('interaction_required') > -1 ||
    error.message.indexOf('login_required') > -1
  );
}
