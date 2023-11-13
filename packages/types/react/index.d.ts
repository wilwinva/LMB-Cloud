import 'react';

declare module 'react' {
  /** Fixes generic function component types being lost. */
  export function memo<T>(fn: T): T;
}
