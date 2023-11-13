## Contents

- [Setup Dev Environment](#setup-dev-environment)
  - [Required Software](#required-software)
  - [Install Dependencies](#install-dependencies)
- [Running](#running)
  - [Notes](#notes)
- [Testing](#testing)
- [Building](#building)
- [Deployment](#deployment)
- [Notes](#notes)

  - [React & Relay Versions](#react-%26-relay-versions)
  - [Code Splitting](#code-splitting)
  - [GraphQL](#graphql)

## Setup Dev Environment

### Required Software

- Install [npm][7] and [node][7-1] (refer to package.json for required version range).

  - Note: [nvm][7-2] is the recommended installation method.

### Npm Azure Authentication

- Npm is deploying scoped packages / apps into a private Azure NPM artifactory, see `./npmrc` for details.
- To pull from and publish to the Azure npm feed an authentication token must be setup, see [Azure Npm Authentication][8]

### Install Dependencies

**Warning**: Do not run `npm i` here, use boostrap to properly hoist dependencies. If dependencies were installed here by mistake
then either delete `./node_modules` or run `lerna clean`. `npm run init` will also run the clean step.

Run:

- `npm run init`

Alternatively, if you need more fine-grained control manually execute the following, add flags as needed:

- `npm i` from root project directory (NOT this directory)
- `lerna clean`
- `lerna link`
- `lerna bootstrap --hoist`
- `lerna run build`

## Running

- Dev configuration: `npm run start`
  - Note: this will use graphql mock resolvers by default. To opt out of using the mock resolvers you can do one of the following:
    - Edit `env.ts` and set mockGraphQL to false
    - Setup a client side resolver, see [apollo-client] (mock or real)
    - Run the production configuration instead
- Prod configuration `npm run start-prod`

### Notes

- [Webpack][6] is setup to automatically run the following scripts for you on start & filechange:
  - `npm run fetch-schema`
    - This is setup to look for env https_proxy & http_proxy variables, unset them if not behind a proxy
  - `npm run generate-typescript`
  - These scripts can be run manually if needed, but that generally should not be required
- Webpack module resolution:
  - loads modules using the target and resolve.mainField properties. The default configuration is to use:
    - `target=web`
    - `mainField= ['browser', 'module' 'main']`
  - package.json declares the mainField values, typically they should be used as follows:
    - browser -- runs on target browser platform, module type varies, not used often
    - module -- usually ES module
    - main -- usually commonjs to support `node` which looks for this field first
  - Our build output is run through tsc and babel with the final artifact, see `babel.config.rc` for more information.
    Multiple output targets can be configured in the build pipeline if desired.
  - We add an aditional `module-ts` field to package.json to allow webpack to switch between using source files and lib
    files as needed. They will behave as follows: - module (webpack default, preferred for npm consumers) - Must run `npm run build` for changes in `packages/<package>` - Webpack will not live reload changes to `packages/<package>/src` - Webpack will live reload changes to `packages/<package>/lib`, which is triggered by a build - module-ts (preferred for development within monorepo) - Webpack will live reload changes to `packages/<package>/src` - In both cases - Local `packages/<package>` and `apps/<app>` tsconfig settings will be respected - the tsconfig output will be run through babel transpiler
    files as needed. They will behave as follows:
  - module (webpack default, preferred for npm consumers)
    - Must run `npm run build` for changes in `packages/<package>`
    - Webpack will not live reload changes to `packages/<package>/src`
    - Webpack will live reload changes to `packages/<package>/lib`, which is triggered by a build
  - module-ts (preferred for development within monorepo)
    - Webpack will live reload changes to `packages/<package>/src`
  - In both cases
    - Local `packages/<package>` and `apps/<app>` tsconfig settings will be respected
    - the tsconfig output will be run through babel transpiler

## Testing

- `npm run test`
- `npm run coverage`

## Building

- `npm run build`

## Deployment

Using Azure pipelines, ref configuration in: https://dev.azure.com/NWMProject/NWM%20Cloud

- Deploying the infrastructure using Terraform: [terraform-modules]

## Notes

### React & Relay Versions

- These modules are currently using experimental versions for the following features:
  - React Suspense
  - React Lazy
  - React concurrent mode
- You will see npm warnings when running `npm install` because of the experimental versions, these can usually be ignored safely
- When the above features are in stable _or_ are no longer npm should be updated to use the latest LTS version instead

### Code splitting

Webpack is configured to split code based on dynamic imports. This is currently being done with a routing code splitting
strategy (as opposed to component based). To setup code splitting use a lazy import in the router for the component that
will be resolved for that route. The component should be wrapped in a `React.Suspense`.

### GraphQL

- Update the server schema: `npm run fetch-schema`
- Graphql API is servered from Hasura, reference `ApolloClient.ts` for current connection information
  - TODO
    - Move credentials to KeyVault
    - Change credentials after moving to KeyVault
    - Setup user level (ie. non-admin) authentication
- Add client side state: [apollo-client-state][2-1]
- Query / Mutate in react
  - [apollo-client-queries][2-2]
  - [apollo-client-mutations][2-3]
  - Expose components with fragments
    - [apollo-client-fragments][2-4]
    - Use fragments to allow one root query per component hierarchy. One method is route based, where there is a root query
      for each page route with subcomponents exposed as fragments.
- Show loading screen while data loads:
  - Route
    - If using dynamic importing (`React.Lazy`) then the component will need to be wrapped with a `React.Suspense`
    - Use `React.Suspense` to show fallback while data loads
- Note: React Router does not provide an abstraction to initiate data loading pre-render (yet, its being worked). That means
  the data fetch will typically start when the render does. Additionally, if there is a child that also fetches data this can
  result in waterfall data requests if fragments are not used correctly. If there is an issue with performance the data fetch
  can be started before render using an event handler or some other technique. Ie. nav button click results in data fetch,
  then navigates to the new component which calls render (with loading placeholder), then shows the data once it returns.

---

[1]: https://reactjs.org/docs/ 'react'
[1-1]: https://reactjs.org/docs/hooks-intro.html 'react-hooks'
[1-2]: https://reactjs.org/docs/code-splitting.html 'react-splitting'
[2]: https://www.apollographql.com/docs/react/ 'apollo-client'
[2-1]: https://www.apollographql.com/docs/react/data/local-state/ 'apollo-client-local-state'
[2-2]: https://www.apollographql.com/docs/react/data/queries/ 'apollo-client-queries'
[2-3]: https://www.apollographql.com/docs/react/data/mutations// 'apollo-client-mutations'
[2-4]: https://www.apollographql.com/docs/react/data/fragments/ 'apollo-client-fragments'
[3]: https://reacttraining.com/react-router/web/guides/quick-start 'react-router'
[4]: https://graphql.org/learn/ 'graphql'
[5]: https://hasura.io/docs/1.0/graphql/manual/index.html 'hasura'
[6]: https://webpack.js.org/concepts/ 'webpack'
[7]: https://docs.npmjs.com/ 'npm'
[7-1]: https://nodejs.org/en/ 'node'
[7-2]: https://github.com/nvm-sh/nvm 'nvm'
[8]: https://docs.microsoft.com/en-us/azure/devops/artifacts/npm/npmrc?view=azure-devops&tabs=windows 'azure-npm-auth'
[root-web]: https://dev.azure.com/NWMProject/NWM%20Cloud/_git/NWM-Cloud?path=%2Freadme.md&version=GBmaster&_a=preview 'root-readme'
[root-local]: ../../readme.md 'root-readme-local'
[project]: https://dev.azure.com/NWMProject/NWM%20Cloud
[project-wiki]: https://dev.azure.com/NWMProject/NWM%20Cloud/_wiki/wikis/NWM-Cloud.wiki
[terraform-modules]: https://dev.azure.com/NWMProject/Configuration%20Management/_git/terraform-modules?path=%2FREADME.md&version=GBmaster
