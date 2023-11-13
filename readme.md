## Contents

- [Setup Dev Environment](#setup-dev-environment)
  - [Required Software](#required-software)
  - [Install Dependencies](#install-dependencies)
  - [Npm Azure Authentication](#npm-azure-authentication)
  - [Notes](#notes)
- [Running](#running)
- [Testing](#testing)
- [Building](#building)
- [Deployment](#deployment)
- [Development](#development)
  - [Add New Project](#add-new-project)
  - [Typescript Configuration](#typescript-configuration)
  - [Babel Configuration](#babel-configuration)

## Setup Dev Environment

### Required Software:

- Install [npm][1] and [node][1-1] (refer to package.json for required version range).

  - Note: [nvm][1-2] is the recommended installation method.

### Npm Azure Authentication

- Npm is deploying scoped packages / apps into a private Azure NPM artifactory, see `./npmrc` for details.
- To pull from and publish to the Azure npm feed an authentication token must be setup, see [Azure Npm Authentication][6]

### Install Dependencies

- `npm run init`

Alternatively, if you need more fine-grained control manually execute the following, add flags as needed:

- `npm i` from root directory
- `lerna clean`
- `lerna link`
- `lerna bootstrap --hoist`
- `lerna run build`

Note: Lerna, Werbpack, etc. expose binaries that are frequently executed from the command line. These are setup to be installed
using the local project versions when `npm i` is run. Running `npm run init` will also ensure `$PATH` env variable points
to `$(pwd)/node_modules/.bin`; that will allow running the local binaries. Global installs should not be needed. If a global
install of one of the packages is used be very careful to ensure the version is compatible with the version range required
by this project.

### Notes

- Configuration is setup using package.json local file references, expected setup is `lerna boostrap --hoist` and `lerna link`.
  To setup independent packages instead semantic versioning should be used, `lerna link convert` should exclude the package, and
  configuration should be updated for that package (tsconfig, babel, webpack, and jest currently). See [lerna][2].

## Running

- Root run configuration is not currently setup, ie. `lerna run start` will not work
- Change directories to `apps/<name>` and refer to the local readme to run a project.
- Most packages are not currently setup to run as stand alone programs, they should be treated as libraries and bootstrapped
  with either an `apps` project or a testing framework.

## Testing

- Testing is setup as root jest configuration that will run jest configurations in `packages` and `apps` in parallel.
- From root: `npm run test`
- To run single package / app: `cd /packages|app/<name>; npm run test`

## Building

- `lerna run build`

## Deployment

Using Azure pipelines, ref configuration in: https://dev.azure.com/NWMProject/NWM%20Cloud

## Development

### Add New Project

From root directory:

- `lerna add` or `lerna add --scope=@nwm/project-name` -- adds dependency to package.json
- `lerna link` || `lerna link convert` -- sets up symbolic links to local files
- `lerna boostrap --hoist` -- install dependencies and move common dependencies to root node_modules
- Optional: `lerna publish <major|minor|patch` -- publish new project tp azure npm
- Reference: `lerna -h`, `lerna <your-command> -h`, [Lerna Documentation][2]

### Typescript Configuration

The base compiler options are set in `tsconfig-base.json`. The project references are set in `tsconfig.json.` Subprojects
should extend the `tsconfig-base.json` in their own `tsconfig.json` file and specify overrides there, if any.

Note, typescript has some opinionated defaults and quirky file path references, take care when adding settings to a local
`tsconfig.json` file. Adding a `typeRoots` for example, will remove the default `node_modules/@types` value which then needs
to be setup manually. This is taken care of in the root project; if those types need to be overriden then the paths need
to be updated in the local configuration to relative paths sourced from the subproject, ie `node_modules` becomes `../../node_modules`.
Also be aware that not all values will be passed down when using extends, which values are not extendable does not seem to
be well documented anywhere, so be sure to check for this behavior when adding values to the root configuration.

Shared types and module augmentations used across projects can be added to the`@nwm/types` package.

### Babel Configuration

Babel is setup using a root project configuration in `babel.config.js`. The file type does matter, this is _not_ the same
as using a `babelrs.js` file. The root configuration cascades down to child projects. To override these settings, a local
`.babelrc.js` can be setup in the subproject root directory. See [5-1] for more details.

### How do I CI/CD

- There has been a CI/CD pipelines that exists for this monorepo.
- CI/CD (Continuous Integration/Continuous Deployment) is an automated process that handles aspects of integration and deployment such as:
  - Building
  - Testing
  - Publishing
  - Archiving
  - Deploying
- The CI/CD logic is encoded as an azure-pipelines.yml file according to Microsoft docs. I won't link that documentation, please just do the googles for Microsoft Azure Pipelines.
- Versioning and production release aspects are going to be developed in later commits

### Reference

- [Npm Documentation][1]
  - [Node Documentation][1-1]
  - [Nvm Documentation][1-2]
- [Lerna Documentation][2]
- [Jest Documentation][3]
  - [Enzyme Documentation][3-1]
- [Typescript Documentation][4]
- [Babel Documentation][5]
  - [Babel Config][5-1]
- [Azure Npm Authentication][6]

---

[1]: https://docs.npmjs.com/ 'npm'
[1-1]: https://nodejs.org/en/ 'node'
[1-2]: https://github.com/nvm-sh/nvm 'nvm'
[2]: https://github.com/lerna/lerna 'lerna'
[3]: https://jestjs.io/docs/en/getting-started 'jest'
[3-1]: https://enzymejs.github.io/enzyme/docs/api/ 'enzyme'
[4]: https://www.typescriptlang.org/docs/home.html 'typescript'
[5]: https://babeljs.io/docs/en/ 'babel'
[5-1]: https://babeljs.io/docs/en/config-files 'babel-config'
[6]: https://docs.microsoft.com/en-us/azure/devops/artifacts/npm/npmrc?view=azure-devops&tabs=windows 'azure-npm-auth'
