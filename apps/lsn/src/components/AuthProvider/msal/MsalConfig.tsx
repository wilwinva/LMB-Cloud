export const msalConfig = {
  auth: {
    clientId: 'c1b0872c-1ee4-4324-90c8-2b516a43da30',
    authority: 'https://login.microsoftonline.com/1b544066-1920-44c1-80c9-405d504ec412',
    redirectUri: window.location.href.includes('localhost')
      ? 'http://localhost:8080'
      : 'https://lsn-development.nwm.doe.gov/',
  },
};

export const servicePrincipalScope = 'https://nwm-lsn.azurewebsites.net/user_impersonation';
export const storageAccountScope = 'https://storage.azure.com/user_impersonation';
/**
 * ensure the service principle is always the first scope. I set this for the default token to be used
 * for JWT validation to Azure API management
 * */
export const loginRequest = {
  scopes: [servicePrincipalScope, storageAccountScope],
};
