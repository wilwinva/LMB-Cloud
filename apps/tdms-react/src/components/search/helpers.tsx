import { curry, get } from 'lodash';
import { IStackItemStyles } from 'office-ui-fabric-react';
import { ReactText, useState, FormEvent } from 'react';
import { IComboBox, IComboBoxOption } from 'office-ui-fabric-react';

export const getOptions = curry(
  <T, K extends keyof T>(key: K, itemKey: string, itemLabelKey: string, data: T | undefined) => {
    return get(data, key, [])
      .map((item: any) => ({
        key: get(item, itemKey),
        text: get(item, itemLabelKey),
      }))
      .filter((item: any) => item.key != null);
  }
);

export const searchStackItemStyles: IStackItemStyles = {
  root: {
    selectors: {
      ul: {
        marginLeft: '55px',
        paddingLeft: '0px',
        selectors: {
          'li:last-child': {
            marginTop: '16px',
          },
        },
      },
      span: {
        fontWeight: 600,
      },
    },
  },
};

export const buildQueryString = (key: string, query?: ReactText) => `search/${key}${query ? '/' + query : ''}`;

/*
  imported from gi/Helpers.tsx
 */
interface SearchFieldData {
  value: ReactText;
  error: string;
}
type SearchFieldChangeEvent = FormEvent<HTMLInputElement | HTMLTextAreaElement> | FormEvent<IComboBox>;
export type SearchFieldChangeEventHandler = (
  event: SearchFieldChangeEvent,
  newValue?: IComboBoxOption | ReactText
) => void;
export type SearchField = [SearchFieldData, SearchFieldChangeEventHandler, () => void, () => boolean];

// TODO: Merge these helpers into the global hooks files for wider reuse.
export const useTextField = () => {
  const [field, setField] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setField('');
    setError('');
  };

  const validate = () => {
    if (!field && !error) {
      setError("Search field can't be empty");
      console.log(`! ${field} - ${field.length}`);
    } else if (field) {
      setError('');
      console.log(`${field} - ${field.length}`);
      return true;
    }

    return false;
  };

  const change = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setField(newValue || '');
  };

  return { field, error, change, reset, validate };
};

export const useComboBox = () => {
  const [field, setField] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setField('');
    setError('');
  };

  const validate = () => {
    if (!field && !error) {
      setError("Search field can't be empty");
    } else if (field) {
      setError('');
      return true;
    }

    return false;
  };

  const change = (ev: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
    setField((option?.key as string) || '');
  };

  return { field, error, change, reset, validate };
};
