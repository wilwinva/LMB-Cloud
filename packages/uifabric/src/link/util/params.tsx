import { Path } from '@nwm/util';
import { ObjectValueTypes } from 'react-router';

//todo -- add support for other input types than string
export type ParamAdder<T extends ObjectValueTypes<T>> = { paramName: keyof T; addParam: (input: string) => string };

export function getParams<T extends ObjectValueTypes<T>>(path: string): ParamAdder<T>[] {
  const matches = [...path.matchAll(/(?:\**?)([$\-_.+!'();?@=&<>#%{}|^~[\]`/\w]+)|(?::(\w+))/g)];
  const uris = matches.map((match) => {
    const [text, paramName] = [match[1], match[2]];
    return {
      prefix: text,
      paramName: paramName,
    };
  });

  //todo : Explicitly declare what to do when ?. is undefined, put in the paths
  return uris
    .map((uri, index) => {
      if (uri.paramName) {
        const prefix: string = uris[index - 1]?.prefix || '';

        const postfix: string =
          uris[index + 1]?.prefix && uris[index + 2]?.paramName === undefined ? uris[index + 1]?.prefix : '';
        return {
          paramName: uri.paramName, //todo -- these need to be unique constrained
          addParam: (input: string) => Path.joinPaths([prefix, input, postfix].filter((s) => s !== '')),
        };
      }

      return undefined;
    })
    .filter((param) => param !== undefined) as ParamAdder<T>[];
}

export function getValidParamAdders<T extends ObjectValueTypes<T>>(path?: string): ParamAdder<T>[] | null {
  if (path === undefined || path === '') {
    return null;
  }
  const paramAdders = getParams<T>(path);
  return paramAdders === undefined || paramAdders.length === 0 ? null : paramAdders;
}
