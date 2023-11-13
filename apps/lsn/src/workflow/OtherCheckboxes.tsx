import React from 'react';
import { Stack, Checkbox, IStackStyles } from 'office-ui-fabric-react';
import { result3BoxType } from './WorkflowDocument';

export interface OtherCheckboxesProps {
  result3Boxes: result3BoxType[];
  onChange: (key: string, ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => void;
  disabled?: boolean;
}

export default function OtherCheckboxes(props: OtherCheckboxesProps) {
  //add spacing between 'other checkboxes'
  const checkboxStackTokens = { childrenGap: 10 };
  const checkboxStackStyles: IStackStyles = {
    root: {
      paddingTop: 10,
    },
  };

  return (
    <Stack tokens={checkboxStackTokens} styles={checkboxStackStyles}>
      {props.result3Boxes.map((d, index) => (
        <Checkbox
          label={d.label}
          key={d.key}
          checked={d.selected} //based on the order of the checkboxes and if that indices appears in result3_tab
          onChange={(e, checked) => props.onChange(d.key, e, checked)}
          disabled={props.disabled}
        />
      ))}
    </Stack>
  );
}
