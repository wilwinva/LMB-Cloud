import React from 'react';
import { useCustomizations } from '@nwm/uifabric';
import { IComboBoxStyles, IComboBoxOption, VirtualizedComboBox } from 'office-ui-fabric-react';

export interface ContactsComboBoxProps {
  comboBoxOptions: IComboBoxOption[];
  selected_key: number;
  onChange: any;
}

export default function ComboBoxComponent(props: ContactsComboBoxProps) {
  const { comboBoxOptions, selected_key, onChange } = props;

  const theme = useCustomizations().settings.theme!;
  const ComboBoxStyles: Partial<IComboBoxStyles> = {
    root: {
      selectors: {
        '.ms-Icon': {
          color: theme.palette.black,
        },
      },
    },
    optionsContainerWrapper: {
      selectors: {
        'button:hover': {
          background: theme.palette.neutralSecondary,
          color: theme.palette.neutralPrimary,
        },
        'button.is-checked': {
          background: theme.palette.neutralDark,
          color: theme.palette.themeLighter,
        },
      },
    },
  };

  return (
    <VirtualizedComboBox
      selectedKey={selected_key}
      allowFreeform
      autoComplete="on"
      options={comboBoxOptions}
      dropdownMaxWidth={200}
      useComboBoxAsMenuWidth
      styles={ComboBoxStyles}
      onChange={onChange}
    />
  );
}
