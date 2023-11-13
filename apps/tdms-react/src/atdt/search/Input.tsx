import * as React from 'react';
import {
  ISpinnerStyles,
  IStackStyles,
  IStackTokens,
  ITextStyles,
  Separator,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TextField,
  VirtualizedComboBox,
  IComboBoxStyles,
} from 'office-ui-fabric-react';
import { ISearchComboBoxProps } from '../../components/search/search';
import { IThemeExtended, useCustomizations } from '@nwm/uifabric';

//todo -- these should be less of a pain to specify, use Pick maybe?
export interface InputProps {
  choiceGroup: JSX.Element;
  loading: boolean;
  inputHeader: string;
  comboBoxProps: ISearchComboBoxProps;
}

function Input(props: InputProps) {
  const styleSettings = useCustomizations().settings.extended!;
  const stackStyles: IStackStyles = {
    root: {
      width: 400,
      marginLeft: '5px',
    },
  };
  const stackTokens: IStackTokens = {
    childrenGap: 2,
    maxWidth: 800,
  };

  const labelStyles: ITextStyles = {
    root: {
      fontWeight: 'bold',
    },
  };

  const spinnerStyles: ISpinnerStyles = {
    root: {
      paddingTop: '7px',
      marginLeft: '5px',
    },
  };

  function buildTextField(props: any) {
    return <TextField onChange={props.onInputChange} onKeyPress={props.onKeyPress} errorMessage={props.errorMessage} />;
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

  function renderInputField(props: any, settings: IThemeExtended) {
    const optionsContainerStyles: Partial<IComboBoxStyles> = {
      optionsContainerWrapper: {
        selectors: {
          'button.is-checked': {
            background: settings.palette.neutralDark,
            color: settings.palette.themeLighter,
          },
        },
      },
    };

    if (props.comboBoxProps) {
      return buildComboBox(props.comboBoxProps!, optionsContainerStyles);
    }
    return buildTextField(props!);
  }

  return (
    <Stack styles={stackStyles} tokens={stackTokens}>
      <Text variant="large" styles={labelStyles}>
        {props.inputHeader}
      </Text>
      <Stack horizontal>
        <Stack.Item grow={95}>{renderInputField(props, styleSettings)}</Stack.Item>
        <Stack.Item>
          {props.loading ? (
            <Spinner size={SpinnerSize.small} styles={spinnerStyles} />
          ) : (
            <div
              style={{
                width: '16px',
                marginLeft: '5px',
                paddingTop: '7px',
              }}
            />
          )}
        </Stack.Item>
      </Stack>
      <Separator />
      {props.choiceGroup}
    </Stack>
  );
}

export default React.memo(Input);
