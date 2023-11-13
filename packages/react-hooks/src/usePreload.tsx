import { DocumentNode, QueryLazyOptions, useLazyQuery } from '@apollo/client';
import { HrefBuilder, searchType, useSearch } from './useSearch';
import * as React from 'react';
import { useCallback, useState } from 'react';

export type Preload<Q, V> = {
  loading: boolean;
} & searchType;
export type PreloadOptions<V> = (input: string) => QueryLazyOptions<V>;
export type PreloadValidator<Q> = (data: Q, input: string) => string;

export function usePreload<Q, V>(
  query: DocumentNode,
  href: string | HrefBuilder,
  options?: PreloadOptions<V>,
  validate?: PreloadValidator<Q>
): Preload<Q, V> {
  const search = useSearch(href);

  /** Note:
   * - useLazyQuery onComplete is not called when there is a cache hit.
   * - useLazyQuery result.called is not reset to false, once true, it is always true.
   * - rules of hooks prevent nesting useLazyQuery in an effect or callback.
   * Because of these constraints called state and an effect is introduced to allow validation at the appropriate
   * times whiles still leveraging the cache.
   * */
  const [called, setCalled] = useState(false);
  const [fetchData, { data, loading }] = useLazyQuery<Q, V>(query, {
    onError: (error) => console.log(`Error querying input_dtn: ${error}`),
  });

  React.useMemo(() => {
    if (data && !loading && called) {
      if (validate) {
        const err = validate(data, search.inputValue);
        search.setErrorMessage(err);
        if (!err || err.trim() === '') {
          search.nav();
        }
        return;
      }

      search.setErrorMessage('');
      search.nav();
    }
  }, [validate, data, loading, called, search.inputValue]);

  const onKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && search.validate()) {
        setCalled(true);
        options ? fetchData(options(search.inputValue)) : fetchData();
      }
    },
    [fetchData, options, search.inputValue]
  );

  const nav = useCallback(() => {
    if (search.validate()) {
      setCalled(true);
      options ? fetchData(options(search.inputValue)) : fetchData();
    }
  }, [fetchData, options, search.inputValue]);

  const onInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setCalled(false);
      return search.onInputChange(event, newValue);
    },
    [search.onInputChange]
  );

  return { ...search, onKeyPress, nav, onInputChange, loading };
}
