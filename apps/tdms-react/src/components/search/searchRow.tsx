import React from 'react';
import {
  Stack,
  Text,
  IStackItemStyles,
  IStackStyles,
  TextField,
  IStackTokens,
  VirtualizedComboBox,
  IComboBoxStyles,
} from 'office-ui-fabric-react';
import { Button, IButtonProps, useCustomizations, IThemeExtended } from '@nwm/uifabric';
import { IRowProps, ISearchComboBoxProps, ISearchTextFieldProps } from './search';

interface ISearchRowProps {
  rowProps: IRowProps;
  textFieldProps?: ISearchTextFieldProps;
  comboBoxProps?: ISearchComboBoxProps;
}

const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 10,
};
const componentBaseWidth = 175;
const stackItemLabelStyles: IStackItemStyles = {
  root: {
    width: componentBaseWidth,
  },
};

const stackItemStyles: IStackItemStyles = {
  root: {
    width: 350,
  },
};

const buttonStyles: IStackItemStyles = {
  root: {
    paddingLeft: 0,
    width: 175,
  },
};

function buildTextField(textFieldProps: ISearchTextFieldProps, optionsContainerStyles: Partial<IComboBoxStyles>) {
  return <TextField {...textFieldProps} />;
}

const buildComboBox = (comboBoxProps: ISearchComboBoxProps, optionsContainerStyles: Partial<IComboBoxStyles>) => {
  return (
    <VirtualizedComboBox
      autoComplete="on"
      allowFreeform={true}
      scrollSelectedToTop={true}
      {...comboBoxProps}
      styles={optionsContainerStyles}
    />
  );
};

function renderLabel({ title }: ISearchRowProps['rowProps']) {
  const displayLabel: string = title ? `${title}:` : '';
  return <Text variant={'mediumPlus'}>{displayLabel}</Text>;
}

function renderInputField({ rowProps, textFieldProps, comboBoxProps }: ISearchRowProps, settings: IThemeExtended) {
  const hasTitle = rowProps?.title && rowProps?.title.length > 0;

  const optionsContainerStyles: Partial<IComboBoxStyles> = {
    optionsContainerWrapper: {
      selectors: {
        'button:hover': {
          background: settings.palette.neutralSecondary,
          color: settings.palette.neutralPrimary,
        },
        'button.is-checked': {
          background: settings.palette.neutralDark,
          color: settings.palette.themeLighter,
        },
      },
    },
  };

  if (comboBoxProps) {
    return buildComboBox(comboBoxProps!, optionsContainerStyles);
  } else if (hasTitle) {
    return buildTextField(textFieldProps!, optionsContainerStyles);
  }

  return null;
}

function SearchRowComponent(props: ISearchRowProps) {
  const { rowProps } = props;
  const buttonProps: IButtonProps = rowProps?.button;
  const wrapperWidth = rowProps?.width ? rowProps?.width : 100;

  const styleSettings = useCustomizations().settings.extended!;

  const stackStyles: IStackStyles = {
    root: {
      width: `calc(${wrapperWidth}% - 50px)`,
      marginLeft: 50,
      marginBottom: 10,
    },
  };

  return (
    <Stack
      horizontal={true}
      horizontalAlign={'start'}
      verticalAlign={'center'}
      tokens={horizontalGapStackTokens}
      styles={stackStyles}
      disableShrink={true}
    >
      <Stack.Item disableShrink styles={stackItemLabelStyles}>
        {renderLabel(rowProps)}
      </Stack.Item>
      <Stack.Item disableShrink styles={stackItemStyles}>
        {renderInputField(props, styleSettings)}
      </Stack.Item>
      {buttonProps && (
        <Stack.Item disableShrink styles={buttonStyles}>
          <Button text={buttonProps.text} onClick={buttonProps.onClick} width={buttonProps?.width}></Button>
        </Stack.Item>
      )}
      <Stack.Item grow={3}>{rowProps.instructions}</Stack.Item>
    </Stack>
  );
}

export const SearchRow = React.memo(SearchRowComponent);
