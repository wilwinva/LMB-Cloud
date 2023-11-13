interface ObjectConstructor {
  entries<T, K extends keyof T = keyof T>(o: { [K in keyof T]: T[K] } | ArrayLike<T>): [K, T[K]][];
}
