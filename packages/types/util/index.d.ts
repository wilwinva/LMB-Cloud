export type RequireSubset<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Require at least one property of a set of properties from an object:
 * Examples:
 *  - type R = RequireOnlyOne<{s1: string, s2: string}>;
 *    const: R = {s1: ''} || {s2: ''} || {s1: '', s2: ''} ... works
 *    const: BR = {} || {s6: ''} || {s1: 123} ... error
 *  - type R = RequireOnlyOne<{s1: string, s2: string, n1: number}, 's1' | 'n1'>;
 *    const: R = {s1: '', s2: ''} || {s2: '', n1: 123} || {s1: '', s2: '', n1: 123} ... works
 *    const: BR = {} || {s1: ''} || {s1: 123, s2: ''}, {s1: '', n1: 123} ... error
 * todo -- unit tests
 */
export type RequireOneOf<T, Keys extends keyof T = keyof T> = Omit<T, Keys> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<{ [IK in keyof Exclude<Keys, K>]: Exclude<Keys, K>[IK] }[keyof Exclude<Keys, K>]>;
  }[Keys];

/**
 * Requires provided fields `K`, makes all other fields in `T` optional.
 */
export type RequireOnly<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  {
    [P in K]-?: T[P];
  };

/**
 * Requires provided fields `K`, preserves optionality of all other fields in `T`.
 */
export type Require<T, K extends keyof T> = UndefinedOptional<RequireTemp<T, K>>;
type RequireTemp<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]: T[X];
} &
  {
    [P in K]-?: T[P];
  };

type ExtractKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? K : never;
}[keyof T];

type OnlyUndefined<T> = {
  [K in ExtractKeys<T, undefined>]: T[K];
};

type ExcludeKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? never : K;
}[keyof T];

type ExcludeUndefined<T> = {
  [K in ExcludeKeys<T, undefined>]: T[K];
};

type UndefinedOptional<T> = ExcludeUndefined<T> & Partial<OnlyUndefined<T>>;

export interface IdentityFunction {
  <T>(fn: T): T;
}
