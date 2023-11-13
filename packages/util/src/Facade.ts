export type Facade<T, U extends keyof T> = (t: T) => Pick<T, U>;
