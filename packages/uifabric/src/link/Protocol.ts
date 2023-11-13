export enum Protocol {
  HTTP = 'http',
  HTTPS = 'https',
}

export function parseProtocol(it: string): Protocol | undefined {
  if (!it) {
    return undefined;
  } else if (it! === Protocol.HTTP) {
    return Protocol.HTTP;
  } else if (it! === Protocol.HTTPS) {
    return Protocol.HTTPS;
  }
  return undefined;
}
