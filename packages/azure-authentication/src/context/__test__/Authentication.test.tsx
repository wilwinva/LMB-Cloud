import React, { useContext } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Authentication, FakedUserAgentApplication } from '../Authentication';
import { AuthenticatedContext } from '../Authenticated';
import { AuthResponse, UserAgentApplication } from 'msal';
import { IdToken } from 'msal/lib-commonjs/IdToken';
import { Account } from 'msal/lib-commonjs/Account';
import { Facade } from '@nwm/util';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function MockedConsumer() {
  const { isAuthenticated } = useContext(AuthenticatedContext);
  return (
    <ul>
      <li>{`${isAuthenticated}`}</li>
    </ul>
  );
}

//todo: Add tests for authentication edge cases, expiration ... etc
//todo: Add e2e tests
test('When using Authentication component then authentication should be successful', async () => {
  const idTokenClaims = { preferred_username: 'b' };
  const account = new Account('', '', '', '', idTokenClaims, '', '');
  const authResponse = new Promise<AuthResponse>((resolve, _reject) =>
    resolve({
      uniqueId: '',
      tenantId: '',
      tokenType: '',
      idToken: new IdToken('abcdadfadfasdf'),
      idTokenClaims: idTokenClaims,
      accessToken: 'a',
      scopes: [],
      expiresOn: new Date(),
      account: account,
      accountState: '',
      fromCache: false,
    })
  );
  const facade: Facade<UserAgentApplication, FakedUserAgentApplication> = (
    userAgentApplication: UserAgentApplication
  ) => ({
    loginPopup: (it) => authResponse,
    acquireTokenSilent: (it) => authResponse,
    getAccount: () => account,
    ssoSilent: (it) => authResponse,
    loginRedirect: (it) => {},
    acquireTokenPopup: (it) => authResponse,
  });
  const wrapper = mount(
    <Authentication
      msalConfig={{
        configuration: {
          auth: {
            clientId: 'a',
          },
        },
        apiTokens: [{ host: 'storage.azure.com', scope: ['https://storage.azure.com/user_impersonation'] }],
      }}
      facade={facade}
    >
      <MockedConsumer />
    </Authentication>
  );
  await act(async () => {
    await wait(0);
  });
  await act(async () => {
    await wait(300);
    const afterUpdate = wrapper.update();
    console.debug(afterUpdate.debug());
    expect(afterUpdate.exists('ul')).toBeTruthy();
    const li = afterUpdate.find('ul').find('li').at(0);
    expect(li.exists()).toBeTruthy();
    expect(li.text()).toBe('true');
  });
});
