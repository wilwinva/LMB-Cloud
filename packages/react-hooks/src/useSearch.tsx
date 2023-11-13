import * as React from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Path } from '@nwm/util';
import { LinkProps } from 'react-router-dom';

export type TextLinkProps = { linkText: string } & LinkProps;

/** Special type to support fabric ui onChange handler, which does not conform to FormEventHandler or ChangeEventHandler types. */
export type ChangeEventHandler<T> = (event: React.FormEvent<T>, newValue?: string) => void;
export type ErrorMessageSetter = (
  value: ((prevState: string | JSX.Element) => string | JSX.Element) | string | JSX.Element
) => void;
export type searchType = {
  errorMessage: string | JSX.Element;
  setErrorMessage: ErrorMessageSetter;
  onInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  inputValue: string;
  onKeyPress: (event: React.KeyboardEvent) => void;
  nav: () => void;
  validate: () => boolean;
};

export type HrefBuilder = (input: string) => TextLinkProps;
export function useSearch(href: string | HrefBuilder): searchType {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | JSX.Element>('');
  const onInputChange = useCallback(
    (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setInputValue(newValue || '');
      if (errorMessage && newValue && newValue.trim() !== '') {
        setErrorMessage('');
      }
    },
    [errorMessage]
  );

  const nav = useCallback(() => {
    if (validate()) {
      const navUrl = typeof href === 'function' ? href(inputValue).to : Path.joinPaths([href, inputValue]);
      navigate(navUrl);
    }
  }, [href, inputValue]);

  const onKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        nav();
      }
    },
    [nav]
  );

  function validate() {
    if (!inputValue.trim()) {
      setErrorMessage('Search value cannot be empty');
      return false;
    }

    return true;
  }

  //todo -- added many things here for preload.. maybe expose two versions of search to keep this clean?
  return {
    errorMessage,
    setErrorMessage,
    onInputChange,
    inputValue,
    onKeyPress,
    nav,
    validate,
  };
}
