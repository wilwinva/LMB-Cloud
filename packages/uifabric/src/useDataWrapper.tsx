import React, { ReactElement } from 'react';
import { Loading } from '@nwm/util';
import { Text } from 'office-ui-fabric-react';
import { ApolloError } from '@apollo/client';

export interface DataWrapperProps<Data> {
  loading?: boolean;
  error?: ApolloError;
  data: Data | undefined;
  name: string;
}

/**
 * Provides handling for useQuery loading & error state boilerplate code.
 *
 * @note Ideally this would also type `data` as Required<Data> so that the caller doesn't need to check if data is not
 * null again (or use a `!` or `as` assertion). Haven't been able to find a good solution for that yet.
 *
 * @param props Takes useQuery state props to determine if a loading or error component is needed. Name is used to
 *  label the loading and error messages.
 */
export function useDataWrapper<Data>(props: DataWrapperProps<Data>): ReactElement | undefined {
  const { data, error, loading, name } = props;
  if (loading) {
    return <Loading name={name} />;
  } else if (error) {
    const message = `Error getting data for ${name}: ${error}`;
    console.error(message);
    return <Text>{message}</Text>;
  } else if (!data) {
    return <Text>{'No data returned'}</Text>;
  }
}
