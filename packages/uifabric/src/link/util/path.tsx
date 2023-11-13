import { Path } from '@nwm/util';
import { ParamAdder } from './params';
import { ObjectValueTypes } from 'react-router';

export type PathBuilder<T extends ObjectValueTypes<T>> = (props: T) => string;
export const pathBuilderFactory = <T extends ObjectValueTypes<T>>(
  pathBuilder: string | ParamAdder<T>[]
): PathBuilder<T> => {
  return (props: T) => {
    return typeof pathBuilder === 'string' ? pathBuilder : fullPathBuilder<T>(pathBuilder, props);
  };
};

export const fullPathBuilderFactory = <C extends ObjectValueTypes<C>, P extends ObjectValueTypes<P>>(
  pathBuilder: string | ParamAdder<C>[],
  parentPathBuilder?: PathBuilder<P>
): PathBuilder<P & C> => {
  //todo -- handle the special cases: '?search', '#hashstring'

  return (props: P & C) => {
    const parentPath = parentPathBuilder !== undefined ? parentPathBuilder(props) : '';
    const path = pathBuilderFactory(pathBuilder)(props);
    return Path.joinPaths([parentPath, path]);
  };
};

export function fullPathBuilder<T extends ObjectValueTypes<T>>(paramAdders: ParamAdder<T>[], props: T): string {
  return paramAdders.reduce((acc, paramAdder, _index) => {
    return acc + paramAdder.addParam(props[paramAdder.paramName]);
  }, '');
}

export function cleansePath(path: string) {
  return path.replace('*', '');
}
