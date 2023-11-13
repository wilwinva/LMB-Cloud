import { useEffect, useRef } from 'react';
import * as util from 'util';
import { InspectOptions } from 'util';

type JsObject = { [key: string]: any };
export type Filter = (value: string, index: number, array: string[]) => unknown;
const defaultFilter: Filter = (key) => !key.startsWith('_');

const defaultInspectOptions: InspectOptions = {
  showHidden: false,
  colors: true,
  compact: true,
  showProxy: false,
  depth: 3,
};

export function useWhyDidYouExecute<P extends { [key: string]: any }>(
  name: string,
  props: P,
  inspectOptions: InspectOptions = defaultInspectOptions,
  filter?: Filter
) {
  const previousProps = useRef<P>();

  useEffect(() => {
    if (previousProps.current) {
      const changes = diff(previousProps.current, props, filter);
      if (Object.keys(changes).length > 0) {
        console.groupCollapsed(`${name} changes`);
        {
          Object.values(changes).forEach((change) =>
            console.log(
              `Previous: ${util.inspect(change[0], inspectOptions)}, Current: ${util.inspect(
                change[1],
                inspectOptions
              )} `
            )
          );
        }
        console.groupEnd();
      }
    }

    previousProps.current = props;
  });
}

export function diff(prev: JsObject, cur: JsObject, filter: Filter = defaultFilter) {
  return Object.keys({ ...prev, ...cur })
    .filter((key) => prev[key] !== cur[key])
    .filter(filter)
    .reduce((acc, key) => {
      acc[key] = [prev[key], cur[key]];
      return acc;
    }, {} as JsObject);
}
