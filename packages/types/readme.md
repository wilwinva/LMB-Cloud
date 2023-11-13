## Contents

- [Description](#description)
- [Justification](#justification)
- [Reference](#reference)

## Description

This package is for declaring:

- Module augmentation across projects
  - Augmentations should be setup as an index.d.ts file under a directory named exactly the same as the module it is augmenting.
  - Augmentation definitions should be in a `declare module module-name` where module-name matches the directory exactly.
  - Do not export augmentations from the root index.d.ts file
- Shared types that do not belong to a package / app

  - The root index.d.ts exports type definitions that are to be reused under the `@nwm/types` import.

## Justification

This package exists so that there is one common place to share types and augmentations that will be used across projects.
This enables the DRY principle to be followed. When setting up `tsconfig.json` `typeRoots` augmentations are unable to be
declared in a root directory for all packages / applications. Due to this behavior we use a package configuration instead
of a directory in the root folder references by `typeRoots`.

## Reference

- [Typescript Documentation][1]
  - [Typescript Project References][1-1]
  - [Typescript Config][1-2]
    - [Typescript Config Schema][1-2-1]

---

[1]: https://www.typescriptlang.org/docs/home.html 'typescript'
[1-1]: https://www.typescriptlang.org/docs/handbook/project-references.html 'project-references'
[1-2]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types 'tsconfg-overview'
[1-2-1]: https://json.schemastore.org/tsconfig 'tsconfig-schema'
