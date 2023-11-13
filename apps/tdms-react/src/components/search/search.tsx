import React from 'react';
import { SearchRow } from './searchRow';
import { Stack, IStackTokens, IComboBoxOption, IComboBox, IStackItemStyles } from 'office-ui-fabric-react';
import { Button, IButtonProps } from '@nwm/uifabric';

export interface IRowProps {
  title?: string;
  instructions?: string;
  button: IButtonProps;
  width?: number | string;
}

export interface IResetProp {
  reset: () => void;
}

interface IBaseSearchProps {
  errorMessage: string;
  reset: () => void;
  validate: () => boolean;
  buttonClick: () => void;
  instructions?: string;
}

export interface ISearchTextFieldProps extends IBaseSearchProps {
  value: string;
  onChange: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
  deferredValidationTime?: number;
}

export interface ISearchComboBoxProps extends IBaseSearchProps {
  onChange: (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => void;
  options: IComboBoxOption[];
  selectedKey: string;
}

export interface ISearchProps {
  keywordProps?: ISearchTextFieldProps;
  dtnProps?: ISearchComboBoxProps;
  mapsProps?: ISearchComboBoxProps;
  parameterProps?: ISearchComboBoxProps;
  productNameProps?: ISearchComboBoxProps;
  subdirectoryProps?: ISearchComboBoxProps;
  resetProps?: IResetProp[];
}

const rowGapStackTokens: IStackTokens = {
  childrenGap: 10,
};
const buttonStyles: IStackItemStyles = {
  root: {
    paddingLeft: 595,
    width: 175,
    selectors: {
      button: {
        width: 175,
      },
    },
  },
};
function SearchComponent(props: ISearchProps) {
  const { keywordProps, dtnProps, parameterProps, productNameProps, subdirectoryProps, mapsProps, resetProps } = props;
  const reset = () => {
    resetProps?.forEach(function (item) {
      item.reset();
    });
  };

  return (
    <Stack verticalAlign={'start'} tokens={rowGapStackTokens}>
      {keywordProps ? KeyWordComponent(keywordProps!) : ''}
      {dtnProps ? DtnComponent(dtnProps!) : ''}
      {parameterProps ? ParameterComponent(parameterProps!) : ''}
      {mapsProps ? MapComponent(mapsProps!) : ''}
      {productNameProps ? ProductNameComponent(productNameProps!) : ''}
      {subdirectoryProps ? SubdirectoryComponent(subdirectoryProps!) : ''}
      <Stack styles={buttonStyles}>
        <Stack.Item>
          <Button text={'Reset'} onClick={reset} />
        </Stack.Item>
      </Stack>
    </Stack>
  );
}
export const SearchBy = React.memo(SearchComponent);

function KeyWordComponent(textFieldProps: ISearchTextFieldProps) {
  const rowProps: IRowProps = {
    title: 'Keyword',
    instructions: textFieldProps.instructions
      ? textFieldProps.instructions
      : 'Instructions: Enter a Data Set Title Keyword',
    button: { text: 'Search by Keyword', width: 175, onClick: textFieldProps.buttonClick },
  };
  return <SearchRow rowProps={rowProps} textFieldProps={textFieldProps} />;
}

function DtnComponent(comboBoxProps: ISearchComboBoxProps) {
  const rowProps: IRowProps = {
    title: 'DTN',
    instructions: 'Instructions: Enter or Select a DTN',
    button: { text: 'Search by DTN', width: 175, onClick: comboBoxProps.buttonClick },
  };
  return <SearchRow rowProps={rowProps} comboBoxProps={comboBoxProps} />;
}

function ParameterComponent(comboBoxProps: ISearchComboBoxProps) {
  const rowProps: IRowProps = {
    title: 'Parameter',
    instructions: 'Instructions: Enter or Select a Parameter',
    button: { text: 'Search by Parameter', width: 175, onClick: comboBoxProps.buttonClick },
  };
  return <SearchRow rowProps={rowProps} comboBoxProps={comboBoxProps} />;
}

function MapComponent(comboBoxProps: ISearchComboBoxProps) {
  const rowProps: IRowProps = {
    title: 'Map',
    instructions: 'Instructions: Enter or Select a Map',
    button: { text: 'Search by Map', width: 175, onClick: comboBoxProps.buttonClick },
  };
  return <SearchRow rowProps={rowProps} comboBoxProps={comboBoxProps} />;
}

function ProductNameComponent(comboBoxProps: ISearchComboBoxProps) {
  const rowProps: IRowProps = {
    title: 'Product Name',
    instructions: 'Instructions: Enter or Select a Product Name',
    button: { text: 'Search by Product Name', width: 175, onClick: comboBoxProps.buttonClick },
  };
  return <SearchRow rowProps={rowProps} comboBoxProps={comboBoxProps} />;
}

function SubdirectoryComponent(comboBoxProps: ISearchComboBoxProps) {
  const rowProps: IRowProps = {
    title: 'Subdirectory',
    instructions: 'Instructions: Enter or Select a Subdirectory',
    button: { text: 'Search by Subdirectory', width: 175, onClick: comboBoxProps.buttonClick },
  };
  return <SearchRow rowProps={rowProps} comboBoxProps={comboBoxProps} />;
}
