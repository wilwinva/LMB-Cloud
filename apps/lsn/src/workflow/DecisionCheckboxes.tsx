import React from 'react';
import { Stack, Checkbox, IStackStyles } from 'office-ui-fabric-react';

/***
 * legacy code for determining if a checkbox was checked from previous decision
 * const
 *    BaseHex : array[1..15] of char = ('1','2','3','4','5','6','7','8','9','A','B','C','D','E','F');
 *
 * for i:=1 to MAX_CHECK do begin
 *  if pos(BaseHex[i],s2)>0 then begin
 *    cb := GetCheckBox(i);
 *    cb.Checked := True;
 *  end;
 * end;
 */
export interface DecisionCheckboxesProps {
  parentKey: number;
  parentElement: string;
  checkboxes: { checkboxParent: number | undefined; text: string | null; key: string; selected: boolean }[];
  disabled?: boolean;
  onChange: (
    parentElement: string,
    childElement: string,
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => void;
}

export const baseHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']; // I added a zero to respect indices
export default function DecisionCheckboxes(props: DecisionCheckboxesProps) {
  //console.log(props.checkboxes);
  // Used to add spacing between checkboxes
  const stackTokens = { childrenGap: 10 };
  const stackStyles: IStackStyles = {
    root: {
      selectors: {
        'div:first-child label': {
          paddingTop: 10,
        },
        label: {
          paddingLeft: 25,
        },
      },
    },
  };
  return (
    <Stack tokens={stackTokens} styles={stackStyles}>
      {props.checkboxes.map((element) => (
        <Checkbox
          label={element.text ? element.text : undefined}
          key={element.key}
          disabled={props.disabled}
          className={props.parentElement}
          checked={element.selected}
          onChange={(e, checked) => props.onChange(props.parentElement, element.key, e, checked)}
        />
      ))}
    </Stack>
  );
}
