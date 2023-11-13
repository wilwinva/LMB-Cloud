import React, { ReactElement } from 'react';
import {
  DocumentNode,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
  useMutation as useMutationBase,
} from '@apollo/client';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';

export type MutationProps = Required<Record<'mutationKey', string> & Record<'mutation', DocumentNode>>;

export type MutationFunction<T, V> = (options?: MutationFunctionOptions<T, V>) => Promise<FetchResult<T>>;

export function useMutation<T, V = OperationVariables>(
  props: MutationProps
): [MutationFunction<T, V> | undefined, ReactElement | undefined] {
  const { mutationKey } = props;
  const [mutation, { loading, error }] = useMutationBase<T, V>(props.mutation);
  if (loading) {
    return [undefined, <Spinner size={SpinnerSize.small} />];
  } else if (error) {
    console.error(`Error doing mutation for key ${mutationKey}: ${error}`);
    return [undefined, <>{error}</>];
  }
  return [mutation, undefined];
}

export type Mutation = Required<Record<'mutationKey', string> & Record<'trigger', number>>;

export type MutationBase = Required<Record<'mutations', Mutation[]>>;

export const defaultMutationBase: MutationBase = {
  mutations: [],
};

export const MutationContext = React.createContext(defaultMutationBase);
