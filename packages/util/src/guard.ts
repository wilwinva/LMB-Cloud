export function keyGuard<O, S extends keyof O>(type: O, keys: (S | string)[], not: boolean = false) {
  return <K extends [keyof O, O[keyof O]]>(entry: [K[0], K[1]]): entry is [K[0], O[S]] => {
    // todo -- add support for symbol & number
    const propName = typeof entry[0] === 'string' ? entry[0] : '';
    return keys.includes(propName) !== not;
  };
}
